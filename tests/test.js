const p = require("../index.js");

var w;

try {
	w = require("whew");
}
catch (err) {
	console.log("The whew testing library should be installed for testing the phin library!");
	process.exit(0);
}

const http = require("http");

console.log("Starting testing server...");

var server = http.createServer((req, res) => {
	switch (req.method) {
		case "GET":
			res.writeHead(200);
			res.end("Responding!");
			break;
		case "POST":
			var postbody = "";
			req.on("data", (chunk) => {
				postbody += chunk;
			});

			req.on("end", () => {
				res.writeHead(200);
				if (postbody === "Sending some data...") {
					res.end("success");
				}
				else {
					res.end("failed");
				}
			});
			break;
	}
});

server.on("error", (err) => {
	console.log("The test couldn't complete. Testing server failed to function properly. (This isn't an issue with phin itself.)");
	console.log(err);
	process.exit(1);
});

w.add("Simple server connection", (res) => {
	p("http://127.0.0.1:1808", (err, body, r) => {
		if (!err && r.statusCode === 200) {
			if (body === "Responding!") {
				res(true, "Successfully connected to test server and used response.");
			}
			else {
				res(false, "Didn't recieve expected body from test server.");
			}
		}
		else res(false, "Couldn't find expected status response from phin.");
	});
});

w.add("POST body connection", (res) => {
	p({
		"url": "http://127.0.0.1:1808",
		"method": "POST",
		"data": "Sending some data..."
	}, (err, body, r) => {
		if (err) {
			res(false, "phin gave error response for request. " + err);
			return;
		}
		if (body === "success") {
			res(true, "Successfully uploaded correct data.");
		}
		else {
			res(false, "Failed to upload data.");
		}
	});
});

server.listen(1808, "127.0.0.1", () => {
	w.test();
});