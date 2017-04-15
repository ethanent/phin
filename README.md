# phin

> Ultra-simple, lightweight, dependency-free Node.JS HTTP request client

[![phin on NPM](https://nodei.co/npm/phin.png)](https://www.npmjs.com/package/phin)

[![phin - Downloads Total](https://img.shields.io/npm/dt/phin.svg)](https://www.npmjs.com/package/phin) [![phin - Version](https://img.shields.io/npm/v/phin.svg)](https://www.npmjs.com/package/phin) [![phin - License](https://img.shields.io/npm/l/phin.svg)](https://www.npmjs.com/package/phin) [![phin - Github Stars](https://img.shields.io/github/stars/FuturisticCake/phin.svg?style=social&label=Star)](https://github.com/FuturisticCake/phin)

---

## Simple Usage
For a simple GET request.

```javascript
const p = require("phin");

p("https://www.ony.io").then(res => {
	console.log("Retireved body data: ", res.body);
}, err => {
	console.log("Uh oh! An error: ", err);
});
```


## Installation

```
npm install phin
```


## Demonstrations

### GET request with custom headers

```javascript
p({
	"url": "https://ony.io",
	"headers": {
		"User-Agent": "phin"
	}
});
```

### POST request with data

```javascript
p({
	"url": "https://ony.io",
	"method": "POST",
	"port": 8080,
	"data": JSON.stringify({
		"name": "John Doe"
	})
}).then(() => {
	console.log("Sent data!");
}, err => {
	console.log("Uh oh! An error: ", err);
});
```

### GET request with authorization using `auth` option

```javascript
p({
	"url": "https://ony.io",
	"auth": "ethan:letmein"
}).then(res => {
	console.log("Retireved body data: ", res.body);
}, err => {
	console.log("Uh oh! An error: ", err);
});
```

### GET request with authorization through `url`

```javascript
p({
	"url": "https://ethan:letmein@ony.io:8080"
}).then(res => {
	console.log("Retireved body data: ", res.body);
}, err => {
	console.log("Uh oh! An error: ", err);
});
```


---

## API

#### (options, callback)

* `options` **required** - _Object or String_ - object containing request options OR string URL to send GET request to
	* `url` **required** - _String_ - URL to request (Can include port, auth. These will be used if their respective options are not present.)
	* See other available options [here](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_request_options_callback)
* **returns** a promise
	* `resolves` if the request was successful with a [Node.js `IncomingMessage`](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_incomingmessage) object
		* `body` phin injects the `body` property, containing the response body
	* `rejects` if the request failed, with an error


## License (MIT)

Copyright 2017 Ethan Davis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.