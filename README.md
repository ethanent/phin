<p align="center" style="text-align: center"><img src="https://raw.githubusercontent.com/ethanent/phin/master/media/phin-textIncluded.png" width="250" alt="phin logo"/></p>

---

> The lightweight Node.js HTTP client

## Deprecation warning

Some version of this package are deprecated and should not be used. Ensure you are using a non-deprecated version.

See [#91](https://github.com/ethanent/phin/issues/91) for more information.

## Simple Usage

```javascript
const p = require('phin')

const res = await p('https://example.com')

console.log(res.body)
```

Note that the above should be in an async context! Phin also provides an unpromisified version of the library.


## Install

```
npm install phin
```


## Why Phin?

Phin is relied upon by important projects and large companies. The hundreds of contributors at [Less](https://github.com/less/less.js), for example, depend on Phin as part of their development process.

Also, Phin is very lightweight. To compare to other libraries, see [Phin vs. the Competition](https://github.com/ethanent/phin/blob/master/README.md#phin-vs-the-competition).

## Quick Demos

Simple POST:

```js
await p({
	url: 'https://example.com',
	method: 'POST',
	data: {
		hey: 'hi'
	}
})
```

### Unpromisified Usage

```js
const p = require('phin').unpromisified

p('https://example.com', (err, res) => {
	if (!err) console.log(res.body)
})
```

Simple parsing of JSON:

```js
// (In async function in this case.)

const res = await p({
	'url': 'https://example.com/',
	'parse': 'json'
})

console.log(res.body.first)
```

### Default Options

```js
const ppostjson = p.defaults({
	'method': 'POST',
	'parse': 'json',
	'timeout': 2000
})

// In async function...

const res = await ppostjson('https://example.com/somejson')
// ^ An options object could also be used here to set other options.

// Do things with res.body?
```

### Custom Axios HTTP Options

Phin allows you to set [Axios HTTP options](https://github.com/axios/axios?tab=readme-ov-file#request-config).

```js
await p({
	'url': 'https://example.com/name',
	'axiosOpts': {
		httpAgent: myAgent // Assuming you'd already created myAgent earlier.
	}
})
```

## Phin vs. the Competition

Phin is a very lightweight library, yet it contains all of the common HTTP client features included in competing libraries!

Here's a size comparison table:

Package | Size
--- | ---
request | [![request package size](https://packagephobia.now.sh/badge?p=request)](https://packagephobia.now.sh/result?p=request)
superagent | [![superagent package size](https://packagephobia.now.sh/badge?p=superagent)](https://packagephobia.now.sh/result?p=superagent)
got | [![got package size](https://packagephobia.now.sh/badge?p=got)](https://packagephobia.now.sh/result?p=got)
axios | [![axios package size](https://packagephobia.now.sh/badge?p=axios)](https://packagephobia.now.sh/result?p=axios)
isomorphic-fetch | [![isomorphic-fetch package size](https://packagephobia.now.sh/badge?p=isomorphic-fetch)](https://packagephobia.now.sh/result?p=isomorphic-fetch)
r2 | [![r2 package size](https://packagephobia.now.sh/badge?p=r2)](https://packagephobia.now.sh/result?p=r2)
node-fetch | [![node-fetch package size](https://packagephobia.now.sh/badge?p=node-fetch)](https://packagephobia.now.sh/result?p=node-fetch)
phin | [![phin package size](https://packagephobia.now.sh/badge?p=phin)](https://packagephobia.now.sh/result?p=phin)
