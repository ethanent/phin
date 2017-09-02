<p align="center" style="text-align: center;"><img src="https://raw.githubusercontent.com/ethanent/phin/master/media/phin-textIncluded.png" width="250" alt="phin logo"/></p>

---

> Ultra-simple, lightweight, dependency-free Node.JS HTTP request client (with util.promisify support)

[Full documentation](https://ethanent.github.io/phin/) | [GitHub](https://github.com/Ethanent/phin) | [NPM](https://www.npmjs.com/package/phin)

## Simple Usage
For a simple page GET request.

```javascript
var p = require("phin");

p("https://www.github.com/Ethanent", (err, res) => {
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
	"url": "https://www.github.com/Ethanent",
	"headers": {
		"User-Agent": "phin"
	}
});
```

### POST request with data

```javascript
p({
	"url": "https://www.github.com/Ethanent",
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

See [the phin documentation](https://ethanent.github.io/phin/).

Note that `phin` has [`util.promisify`](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) support.