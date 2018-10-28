<p align="center" style="text-align: center"><img src="https://raw.githubusercontent.com/ethanent/phin/master/media/phin-textIncluded.png" width="250" alt="phin logo"/></p>

---

> The ultra-lightweight Node.js HTTP client

[Full documentation](https://ethanent.github.io/phin/) | [GitHub](https://github.com/ethanent/phin) | [NPM](https://www.npmjs.com/package/phin)


## Simple Usage

```javascript
const p = require('phin')

const res = await p('https://ethanent.me')

console.log(res.body)
```

Note that the above should be in an async context! phin also provides an unpromisified version of the library.

## Install

```
npm install phin
```


## Why phin?

phin is **trusted** by some really important projects. The hundreds of contributors at [Less](https://github.com/less/less.js), for example, depend on phin as part of their development process.

Also, phin is super **lightweight**. Like **99.8% smaller than request** lightweight. To compare to other libraries, see [phin vs. the Competition](https://github.com/ethanent/phin/blob/master/README.md#phin-vs-the-competition).

<img src="https://pbs.twimg.com/media/DSPF9TaUQAA0tIe.jpg:large" alt="phin became 33% lighter with release 2.7.0!"/>


## Quick Demos

Simple POST:

```javascript
await p({
	url: 'https://ethanent.me',
	method: 'POST',
	data: {
		hey: 'hi'
	}
})
```

## Unpromisified Usage

```javascript
const p = require('phin').unpromisified

p('https://ethanent.me', (err, res) => {
	if (!err) console.log(res.body)
})
```

Simple parsing of JSON:

```javascript
// (In async function in this case.)

const res = await p({
	url: 'https://ethanent.me/name',
	parse: 'json'
})

console.log(res.body.first)
```


## Full Documentation

See [the phin documentation](https://ethanent.github.io/phin/).

## phin vs. the Competition

<img src="https://pbs.twimg.com/media/DSLU_UcUEAI4bgc.jpg:large" alt="Request is over 6MB in size. phin is just 25KB in size."/>

phin is a very lightweight library.

It contains all of the common HTTP client features included in competing libraries!

Package | Size (KB) | Dependencies<br />(Tree Count) | Size Comparison<br />(vs. phin)
--- | --- | --- | ---
request | 4,446 | [53](http://npm.anvaka.com/#/view/2d/request) | 444.6x
superagent | 1,235 | [24](http://npm.anvaka.com/#/view/2d/superagent) | 123.5x
got | 664 | [44](http://npm.anvaka.com/#/view/2d/got) | 66.4x
snekfetch | 107 | [0](http://npm.anvaka.com/#/view/2d/snekfetch) | 10.7x
phin | 10 | [1](http://npm.anvaka.com/#/view/2d/phin) | 1x