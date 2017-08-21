const realHttp = require("http");
const https = require("https");
const url = require("url");
const qs = require("querystring");
const zlib = require("zlib");
const util = require("util");

/**
* phin options object
* @typedef {Object} phinOptions
* @property {string} url - URL to request (autodetect infers from this URL)
* @property {string} [method=GET] - Request method ('GET', 'POST', etc.)
* @property {string|Object} [data] - Data to send as request body (if Object, data is JSON.stringified unless content-type header is present and set to 'application/x-www-url-form-encoded' in which case the data will be encoded as a query string.)
* @property {Object} [headers={}] - Request headers
* @property {boolean} [compression=false] - Enable compression for request
* @property {?number} [timeout=null] - Request timeout in milliseconds
* @property {string} [hostname=autodetect] - URL hostname
* @property {Number} [port=autodetect] - URL port
* @property {string} [path=autodetect] - URL path
* @property {string} [auth=autodetect] - Request authentiction in "user:password" format
*/

/**
* Response data callback
* @callback phinResponseCallback
* @param {?(Error|string)} error - Error if any occurred in request, otherwise null.
* @param {?http.serverResponse} phinResponse - phin response object. Like <a href="https://nodejs.org/api/http.html#http_class_http_serverresponse">http.ServerResponse</a> but has a body property containing response body
*/

/**
* Sends an HTTP request
* @param {phinOptions|string} options - phin options object (or string for auto-detection)
* @param {phinResponseCallback} [callback=null] - Callback to which data is sent upon request completion
* @param {Object} [httpModule=require('http')] - HTTP module injection (for testing)
*/
const phin = (opts, cb, injectedHttp) => {
	if (typeof(opts) !== "string") {
		if (!opts.hasOwnProperty("url")) {
			throw new Error("Missing url option from options for request method.");
		}
	}

	var addr;
	if (typeof opts === "object") {
		addr = url.parse(opts.url);
	} else {
		opts = url.parse(opts);
	}

	if (addr) {
		Object.assign(opts, opts);
	}

	if (opts.port) {
		opts.port = Number(opts.port);
	} else {
		opts.port = opts.protocol === "http:" ? 80 : 443;
	}

	if (opts.compressed === true) {
		opts.headers["accept-encoding"] = "gzip, deflate";
	}

	var req;
	const resHandler = (res) => {
		var stream = res;
		if (opts.compressed === true) {
			if (res.headers["content-encoding"] === "gzip") {
				stream = res.pipe(zlib.createGunzip());
			} else if (res.headers["content-encoding"] === "deflate") {
				stream = res.pipe(zlib.createInflate());
			}
		}
		res.body = new Buffer([]);
		stream.on("data", (chunk) => {
			res.body = Buffer.concat([res.body, chunk]);
		});
		stream.on("end", () => {
			if (cb) {
				cb(null, res);
			}
		});
	};

	// Dependency injection for testing

	const http = injectedHttp || realHttp;

	switch (addr.protocol.toLowerCase()) {
		case "http:":
			req = http.request(opts, resHandler);
			break;
		case "https:":
			req = https.request(opts, resHandler);
			break;
		default:
			if (cb) {
				cb(new Error("Invalid / unknown URL protocol. Expected HTTP or HTTPS."), null);
			}
			return;
	}

	if (typeof opts.timeout === "number") {
		req.setTimeout(opts.timeout, () => {
			req.abort();

			cb(new Error("Timeout has been reached."), null);
			cb = null;
		});
	}

	req.on("error", (err) => {
		if (cb) {
			cb(err, null);
		}
	});

	if (opts.hasOwnProperty("data")) {
		var postData = opts.data;
		if (!(opts.data instanceof Buffer) && typeof opts.data === "object") {
			const contentType = opts.headers["Content-Type"] || opts.headers["content-type"];
			if (contentType === "application/x-www-url-form-encoded") {
				postData = qs.stringify(opts.data);
			} else {
				try {
					postData = JSON.stringify(opts.data);
				}
				catch (err) {
					cb(new Error("Couldn't stringify object. (Likely due to a circular reference.)"), null);
				}
			}
		}
		req.write(postData);
	}
	req.end();
};

const promisified = (opts, http) => {
	return new Promise((resolve, reject) => {
		phin(opts, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		}, http);
	});
};

// Node.js 8 util.promisify 

if (util.promisify) {
	phin[util.promisify.custom] = promisified;
}

phin.promisified = promisified;

module.exports = phin;