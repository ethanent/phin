<p align="center" style="text-align: center"><img src="https://raw.githubusercontent.com/ethanent/phin/master/media/phin-textIncluded.png" width="250" alt="phin logo"/></p>

---

> The ultra-lightweight Node.js HTTP client

[Full documentation](https://ethanent.github.io/phin/) | [GitHub](https://github.com/ethanent/phin) | [NPM](https://www.npmjs.com/package/phin)


## Simple Usage

```javascript
const p = require('phin')

p('https://ethanent.me', (err, res) => {
	if (!err) console.log(res.body)
})
```


## Installation

```
npm install phin
```


## Why phin?

phin is **trusted** by some really important projects. The hundreds of contributors at [Less](https://github.com/less/less.js), for example, depend on phin as part of their development process.

Also, phin is super **lightweight**. Like **99.6% smaller than request** lightweight.

<img src="https://pbs.twimg.com/media/DSLU_UcUEAI4bgc.jpg:large" alt="Request is over 6MB in size. phin is just 25KB in size."/>


## Quick Demos

Simple POST:

```javascript
p({
	url: 'https://ethanent.me',
	method: 'POST',
	data: {
		'hey': 'hi'
	}
})
```

Promisified:

```javascript
const p = require('phin').promisified
```

```javascript
;(async () => {
	const res = await p({
		url: 'https://ethanent.me'
	})

	console.log(res.body)
})()
```


## Documentation

See [the phin documentation](https://ethanent.github.io/phin/).

`phin` has [`util.promisify`](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) support. The promisified library can also be accessed with `require('phin').promisified`!