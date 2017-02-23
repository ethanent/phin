// Module requirements

var http = require("http");
var https = require("https");
var url = require("url");

module.exports = function(opts, cb) {

	// Enclose all code in a try-catch statement

	try {

		// Parse the URL

		var parsedUrl = url.parse(typeof(opts) === "object" ? opts.url : opts);

		// Set up the options

		var options = {
			"hostname": parsedUrl.hostname,
			"port": opts.port || Number(parsedUrl.port) || (parsedUrl.protocol === "http://" ? 80 : 443 /* use default ports for HTTP / HTTPS if not specified*/),
			"path": parsedUrl.path,
			"method": opts.method || "GET",
			"headers": opts.headers || {},
			"auth": opts.auth || parsedUrl.auth || null,
			"encoding" : opts.encoding || "utf8"
		};

		// Set up the function to be called back when the request is sent

		var resHandler = function(res) {
			res.setEncoding(options.encoding);
			res.body = "";
			res.on("data", function(chunk) {
				res.body += chunk;
			});
			res.on("end", function() {
				cb(null, res);
			});
		};

		// Send the request

		var req;

		if (parsedUrl.protocol === "http:") {
			req = http.request(options, resHandler);
		} else {
			req = https.request(options, resHandler);
		}

		// Send data if it is present

		if (opts.hasOwnProperty("data")) req.write(opts.data.toString());

		req.end();
	} catch (err) {
		cb(err);
	}
};