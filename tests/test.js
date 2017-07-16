const p = require("../index.js"),
w = require("whew"),
Stream = require("stream"),
assert = require("assert");

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
		response.statusCode = 200;
		setTimeout(() => {
			requestHandler(response);
			if (options.method === "GET") {
				response.emit("data", new Buffer("Responding!"));
				response.emit("end");
			} else if (options.method === "POST") {
				assert.ok(request.body.equals(new Buffer("Sending some data...")), "POST data not sent.");
				response.emit("data", new Buffer("Success!"));
				response.emit("end");
			}
		}, 0);
		return request;
	}
});

w.add("Simple server connection", (res) => {
	p("http://127.0.0.1", (err, r) => {
		if (!err && r.statusCode === 200) {
			if (r.body.equals(new Buffer("Responding!"))) {
				res(true, "Successfully connected to test server and used response.");
			} else {
				res(false, "Didn't recieve expected body from test server.");
			}
		} else {
			res(false, "Couldn't find expected status response from phin.");
		}
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
			res(true, "Successfully uploaded correct data.");
		} else {
			res(false, "Failed to upload data.");
		}
	}, http);
});

w.test();