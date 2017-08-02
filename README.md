# phin

> Ultra-simple, lightweight, dependency-free Node.JS HTTP request client (with util.promisify support)

<img src="http://i.imgur.com/SSBM2Pw.png" width="100" alt="phin logo"/>

---

[Full documentation](https://futuristiccake.github.io/phin/) | [GitHub](https://github.com/FuturisticCake/phin) | [NPM](https://www.npmjs.com/package/phin)

## Simple Usage
For a simple page GET request.

```javascript
var p = require("phin");

p("https://www.github.com/FuturisticCake", (err, res) => {
	if (!err) console.log(res.body.toString());
});
```


## Installation

```
npm install phin
```


## Quick Demos

### GET request with added headers

```javascript
p({
	"url": "https://www.github.com/FuturisticCake",
	"headers": {
		"User-Agent": "phin"
	}
});
```

### POST request with data

```javascript
p({
	"url": "https://www.github.com/FuturisticCake",
	"method": "POST",
	"port": 8080,
	"data": {
		"name": "John Doe",
		"someKey": "someValue"
	},
	"headers": {
		"Content-Type" : "application/json"
	}
}, (err, res) => {
	if (!err) console.log("Sent data!");
});
```

### GET request with authorization using `auth` option

```javascript
p({
	"url": "https://example.com",
	"auth": "ethan:letmein"
}, (err, res) => {
	if (!err) console.log(res.body);
});
```

### GET request with authorization through `url`

```javascript
p({
	"url": "https://ethan:letmein@example.com:8080"
}, (err, res) => {
	if (!err) console.log(res.body);
});
```


---

## Documentation

See [the phin documentation](https://futuristiccake.github.io/phin/).

Note that `phin` has [`util.promisify`](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) support.