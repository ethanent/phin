const p = require("../index.js"),
w = require("whew"),
Stream = require("stream"),
assert = require("assert"),
zlib = require("zlib"),
util = require("util");

class MockRequest extends Stream.Writable {
	constructor() {
		super();
		this.body = new Buffer([]);
	}

	_write(chunk, encoding, callback) {
		this.body = Buffer.concat([this.body, new Buffer(chunk, encoding)]);
		callback();
	}
}

const http = Object.assign({
	"request" : (options, requestHandler) => {
		const request = new MockRequest();
		const response = new Stream.Duplex({ read() { }, write() { } });
		response.headers = { };
		if (options.path === "/compressed") {
			response.headers["content-encoding"] = "gzip";
		}
		response.statusCode = 200;
		setTimeout(() => {
			requestHandler(response);
			if (options.path === "/compressed") {
				zlib.gzip("test data", (err, gzipped) => {
					response.emit("data", gzipped);
					response.emit("end");
				});
			} else if (options.method === "GET") {
				response.emit("data", new Buffer("Responding!"));
				response.emit("end");
			} else if (options.method === "POST") {
				assert.ok(request.body.equals(new Buffer("Sending some data...")), "POST data not sent.");
				response.emit("data", new Buffer("Success!"));
				response.emit("end");
			} else if (options.path === "/portTest") {
				assert.strictEqual(options.port, 5135);
			}
		}, 150);
		return request;
	}
});

const simpleServerConnectionTest = (r, res, err) => {
	if (!err && r.statusCode === 200) {
		if (r.body.equals(new Buffer("Responding!"))) {
			res(true, "Successfully recieved the correct response.");
		} else {
			res(false, "Didn't recieve expected body from test server.");
		}
	} else {
		res(false, "Couldn't find expected status response from phin.");
	}
};

w.add("Simple server connection", (res) => {
	p("http://127.0.0.1", (err, r) => {
		simpleServerConnectionTest(r, res, err);
	}, http);
});

w.add("POST body connection", (res) => {
	p({
		"url": "http://127.0.0.1",
		"method": "POST",
		"data": "Sending some data..."
	}, (err, r) => {
		if (err) {
			res(false, "phin gave error response for request. " + err);
			return;
		}
		if (r.body.equals(new Buffer("Success!"))) {
			res(true, "Successfully uploaded and recieved correct correct data.");
		} else {
			res(false, "Failed to upload data.");
		}
	}, http);
});

w.add("Compression options", (res) => {
	p({
		"url": "http://127.0.0.1/compressed",
		"compressed": true
	}, (err, r) => {
		if (r.body.equals(new Buffer("test data"))) {
			res(true, "Compression and decompression successful.");
		} else {
			res(false, "Compression and/or decompression failed.");
		}
	}, http);
});

w.add("util.promisify works on phin", (res) => {
	util.promisify(p)("http://127.0.0.1", http).then((r) => {
		simpleServerConnectionTest(r, res);
	}, (err) => {
		res(false, "An error occured: " + err + ".");
	});
});

w.add("Port is derived from URL", (res) => {
	p("http://127.0.0.1:5135", (err, r) => {
		if (err) {
			res(false, "Port wasn't derived correctly (or at all).");
		} else {
			res(true, "Port derived correctly.");
		}
	}, http);
});

/*w.add("Set request timeout", (res) => {
	p({
		"url": "http://127.0.0.1",
		"method": "GET",
		"timeout": 30
	}, (err, res) => {
		if (err) {
			res(true, "Request timeout resulted in request being cancelled when timeout reached.");
		}
		else {
			res(false, "Timeout was reached yet request wasn't cancelled.");
		}
	});
});*/

w.test();