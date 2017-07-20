# phin

> Ultra-simple, lightweight, dependency-free Node.JS HTTP request client

<img src="http://i.imgur.com/SSBM2Pw.png" width="200" alt="phin logo"></img>

[![phin on NPM](https://nodei.co/npm/phin.png)](https://www.npmjs.com/package/phin)

[![phin - Downloads Total](https://img.shields.io/npm/dt/phin.svg)](https://www.npmjs.com/package/phin) [![phin - Version](https://img.shields.io/npm/v/phin.svg)](https://www.npmjs.com/package/phin) [![phin - License](https://img.shields.io/npm/l/phin.svg)](https://www.npmjs.com/package/phin) [![phin - Github Stars](https://img.shields.io/github/stars/FuturisticCake/phin.svg?style=social&label=Star)](https://github.com/FuturisticCake/phin)

---

## Simple Usage
For a simple GET request.

```javascript
var p = require("phin");

p("https://www.ony.io", (err, body, response) => {
	if (!err) console.log(body);
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
	"data": {
		"name": "John Doe",
		"someKey": "someValue"
	},
	"headers": {
		"Content-Type" : "application/json" // or x/www-url-form-encoded if you want "data" encoded as a query string
	}
}, (err, body, response) => {
	if (!err) console.log("Sent data!");
});
```

### GET request with authorization using `auth` option

```javascript
p({
	"url": "https://ony.io:8080",
	"auth": "ethan:letmein"
}, (err, body, response) => {
	if (!err) console.log(body);
});
```

### GET request with authorization through `url`

```javascript
p({
	"url": "https://ethan:letmein@ony.io:8080"
}, (err, body, response) => {
	if (!err) console.log(body);
});
```


---

## Documentation

See [the documentation](https://FuturisticCake.github.io/phin).
Note that `phin` has [`util.promisify`](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) support.

## License (MIT)

Copyright 2017 Ethan Davis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
