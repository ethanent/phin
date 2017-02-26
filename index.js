/*jslint node: true*/
"use strict";

// Require statements

const http = require("http"),
https = require("https"),
url = require("url");

module.exports = function(opts) {

	const promise = new Promise(function(resolve, reject) { // Create the promise to return

		if (typeof(opts) !== "string" && !opts.hasOwnProperty("url")) { // Validate options
			reject(new Error("Missing URL option"));
			return;
		}

		// Parse the URL

		const parsedUrl = url.parse(typeof(opts) === "object" ? opts.url : opts);

		// Set up the options

		const options = {
			"hostname": parsedUrl.hostname,
			"port": opts.port || Number(parsedUrl.port) || (parsedUrl.protocol === "http://" ? 80 : 443 /* use default ports for HTTP / HTTPS if not specified*/),
			"path": parsedUrl.path,
			"method": opts.method || "GET",
			"headers": opts.headers || {},
			"auth": opts.auth || parsedUrl.auth || null,
			"encoding" : opts.encoding || "utf8"
		};

		// Send the request

		var module = parsedUrl.protocol === "http:" ? http : https;

		var req = module.request(options, function(res) {

			// Set encoding

			res.setEncoding(options.encoding);

			// Get the data from the server

			res.body = "";
			res.on("data", function(chunk) {
				res.body += chunk;
			});
			res.on("end", function() {
				resolve(res);
			});
		});

		// Handle error

		req.on("error", function(err) {
			reject(err);
		});

		// Send data if present

		if (opts.hasOwnProperty("data")) req.write(opts.data.toString());

		req.end();
	});

	return promise; // Return the promise
};