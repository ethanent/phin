# phin

> Ultra-simple, lightweight, dependency-free Node.JS HTTP request client

---

[![NPM](https://nodei.co/npm/phin.png)](https://www.npmjs.com/package/phin)

## Simple Usage
For basic GET request.

```javascript
var p = require("phin");

p("https://www.ony.io:5135", function(err, body, response) {
	if (!err) console.log(body);
});
```


## Installation

```
npm install phin
```


## Demonstrations

### POST request with data

```javascript
p({
	"url": "https://ony.io",
	"method": "POST",
	"port": 8080,
	"data": JSON.stringify({
		"name": "John Doe"
	})
}, function(err, body, response) {
	if (!err) console.log("Sent data!");
});
```

### GET request with authorization

```javascript
p({
	"url": "https://ony.io:8080",
	"auth": "ethan:letmein"
}, function(err, body, response) {
	if (!err) console.log(body);
});
```

### GET request with custom headers

```javascript
p({
	"url": "https://ony.io",
	"headers": {
		"User-Agent": "Phin"
	}
})
```

---

## API

#### (options, callback)

* `options` **required** - {} - object containing request options OR string URL to send GET request to
	* `url` **required** - _String_ - URL to request (Can include port, auth. These will be used if their respective options are not present.)
	* `method` - _String_ - Default: `'GET'` - Request method. Ex. `'GET'`
	* `port` - _Integer_ (or integer as string) - Default: For HTTP, `80`. For HTTPS, `443`. - Request port
	* `headers` - _Object_ - Request headers
	* `data` - _String_ / non-circular JS object - Request data (request body)
	* `auth` - _String_ - Authorization in `'user:pass'` format
* `callback` **required** - function(err, body, response) {} - callback method
	* `err` - _String_ / null - Is null if no error occurs during request.
	* `body` - _String_ - Response content
	* `response` - HTTP / HTTPS response object. See [Node.JS HTTP docs - HTTP.serverResponse class](https://nodejs.org/dist/latest-v7.x/docs/api/http.html#http_class_http_serverresponse).