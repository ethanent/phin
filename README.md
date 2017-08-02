# phin

> Ultra-simple, lightweight, dependency-free Node.JS HTTP request client (with util.promisify support)

<img src="http://i.imgur.com/SSBM2Pw.png" width="100" alt="phin logo"/>

---

[Full documentation](https://futuristiccake.github.io/phin/) | [GitHub](https://github.com/FuturisticCake/phin) | [NPM](https://www.npmjs.com/package/phin)

## Simple Usage
For a simple GET request.

```javascript
var p = require("phin");

p("https://www.ony.io", (err, res) => {
	if (!err) console.log(res.body);
});
```


## Installation

```
npm install phin
```


## Demonstrations

### GET request with added headers

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
}, (err, res) => {
	if (!err) console.log("Sent data!");
});
```

### GET request with authorization using `auth` option

```javascript
p({
	"url": "https://ony.io:8080",
	"auth": "ethan:letmein"
}, (err, res) => {
	if (!err) console.log(res.body);
});
```

### GET request with authorization through `url`

```javascript
p({
	"url": "https://ethan:letmein@ony.io:8080"
}, (err, res) => {
	if (!err) console.log(res.body);
});
```


---

## Documentation

See [the phin documentation](https://futuristiccake.github.io/phin/).

Note that `phin` has [`util.promisify`](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) support.