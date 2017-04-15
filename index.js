"use strict";

const http = require("http");
const https = require("https");
const url = require("url");

module.exports = function(opts) {

	// Validate the options input

	if (typeof(opts) !== "string" && !opts.hasOwnProperty("url")) throw "Missing url option from options for request method.";

	// Create the promise

	const promise = new Promise((resolve, reject) => {
		var options;

		if (typeof(opts) === "string") {

			// The `opts` paramater passed in is a string, treat it as a URL

			options = url.parse(opts);
		} else {

			// They have custom options, merge that with a parsed version of the URL

			options = Object.assign(opts, url.parse(opts.url));
		}

		// Convert the port to a integer or infer it from the protocol

		options.port = options.port ? parseInt(options.port) : options.protocol === "http:" ? 80 : 443;

		var req;

		var resHandler = (res) => {
			res.setEncoding("utf8");
			res.body = "";
			res.on("data", (chunk) => {
				res.body += chunk;
			});
			res.on("end", () => {
				resolve(res);
			});
		};

		switch (options.protocol.toLowerCase()) {
			case "http:":
				req = http.request(options, resHandler);
				break;
			case "https:":
				req = https.request(options, resHandler);
				break;
			default:
				reject(new Error("Invalid / unknown address protocol. Expected HTTP or HTTPS."));
				return;
		}

		req.on("error", (err) => {
			reject(err);
		});

		if (opts.hasOwnProperty("data")) {
			if (typeof(opts.data) === "object") {
				req.write(JSON.stringify(opts.data));
			} else {
				req.write(opts.data.toString());
			}
		}

		req.end();
	});
	
	return promise;
};