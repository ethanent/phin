"use strict";

const http = require("http");
const https = require("https");
const url = require("url");
const zlib = require("zlib");

module.exports = function(opts, cb) { // All opts: url, method, port, auth, headers, data
	// Validate most inputs
	if (typeof(opts) !== "string" && !opts.hasOwnProperty("url")) {
		throw "Missing url option from options for request method.";
	}

	var addr, options;

	if (typeof(opts) === "string") { // Default options (GET, default port / selected port) from string URL
		addr = url.parse(opts);
		options = {
			"hostname": addr.hostname,
			"port": (Number(addr.port) || (addr.protocol.toLowerCase() === "http:" ? 80 : 443)), // Either port selected in string URL (if any) or if nonexistant default for protocol.
			"path": addr.path,
			"method": "GET",
			"headers": {},
			"auth": (addr.auth || null)
		};
	} else { // Custom options
		addr = url.parse(opts.url);
		options = {
			"hostname": addr.hostname,
			"port": (Number(opts.port) || Number(addr.port) || (addr.protocol.toLowerCase() === "http:" ? 80 : 443)), // Selected through options / selected in URL / default for protocol.
			"path": addr.path,
			"method": (opts.method || "GET"),
			"headers": (opts.headers || {}),
			"auth": (opts.auth || addr.auth || null)
		};
	}
	
	var customEncoding = false;
	if (options.headers["accept-encoding"]) {
		customEncoding = true;
	} else {
		options.headers["accept-encoding"] = "gzip,deflate";
	}

	var req;

	var resHandler = (res) => {
		if (cb) {
			var resBody = new Buffer([]);
			res.on("data", (chunk) => {
				resBody = Buffer.concat([resBody, chunk]);
			});
			res.on("end", () => {
				if (!customEncoding) {
					if (res.headers["content-encoding"] === "gzip") {
						zlib.gunzip(resBody, (err, data) => cb(err, data, res));
					} else if (res.headers["content-encoding"] === "deflate") {
						zlib.inflate(resBody, (err, data) => cb(err, data, res));
					} else {
						cb(null, resBody, res);
					}
				} else {
					cb(null, resBody, res);
				}
			});
		}
	};

	switch (addr.protocol.toLowerCase()) {
		case "http:":
			req = http.request(options, resHandler);
			break;
		case "https:":
			req = https.request(options, resHandler);
			break;
		default:
			if (cb) {
				cb(new Error("Invalid / unknown address protocol. (Expected HTTP or HTTPS.)"));
			}
			return;
	}

	req.on("error", (err) => {
		if (cb) {
			cb(err);
		}
	});

	var postData = null;

	if (opts.hasOwnProperty("data")) {
		if (opts.data instanceof Buffer) {
			postData = opts.data;
		} else if (typeof opts.data !== "object") {
			postData = new Buffer(opts.data);
		} else if (typeof opts.data === "object") {
			postData = new Buffer(JSON.stringify(opts.data));
		}
	}

	req.end(postData);
};