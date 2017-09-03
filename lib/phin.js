const realHttp = require('http')
const https = require('https')
const url = require('url')
const qs = require('querystring')
const zlib = require('zlib')
const util = require('util')

/**
* phin options object
* @typedef {Object} phinOptions
* @property {string} url - URL to request (autodetect infers from this URL)
* @property {string} [method=GET] - Request method ('GET', 'POST', etc.)
* @property {string} [data] - Data to send as request body (phin may attempt to convert this data to a string if it isn't already)
* @property {Object} [form] - Object to send as form data (sets 'Content-Type' and 'Content-Length' headers, as well as request body) (overwrites 'data' option if present)
* @property {Object} [headers={}] - Request headers
* @property {boolean} [compression=false] - Enable compression for request
* @property {?number} [timeout=null] - Request timeout in milliseconds
* @property {string} [hostname=autodetect] - URL hostname
* @property {Number} [port=autodetect] - URL port
* @property {string} [path=autodetect] - URL path
* @property {string} [auth=autodetect] - Request authentiction in 'user:password' format
*/

/**
* Response data callback
* @callback phinResponseCallback
* @param {?(Error|string)} error - Error if any occurred in request, otherwise null.
* @param {?http.serverResponse} phinResponse - phin response object. Like <a href='https://nodejs.org/api/http.html#http_class_http_serverresponse'>http.ServerResponse</a> but has a body property containing response body
*/

/**
* Sends an HTTP request
* @param {phinOptions|string} options - phin options object (or string for auto-detection)
* @param {phinResponseCallback} [callback=null] - Callback to which data is sent upon request completion
* @param {Object} [httpModule=require('http')] - HTTP module injection (for testing)
*/
const phin = (opts, cb, injectedHttp) => {
	if (typeof(opts) !== 'string') {
		if (!opts.hasOwnProperty('url')) {
			throw new Error('Missing url option from options for request method.')
		}
	}

	var addr
	if (typeof opts === 'object') {
		addr = url.parse(opts.url)
	} else {
		addr = url.parse(opts)
	}
	var options = {
		'hostname': addr.hostname,
		'port': addr.port || (addr.protocol.toLowerCase() === 'http:' ? 80 : 443),
		'path': addr.path,
		'method': 'GET',
		'headers': {},
		'auth': (addr.auth || null),
		'timeout': null
	}

	if (typeof opts === 'object') {
		options = Object.assign(options, opts)
	}
	options.port = Number(options.port)

	if (options.compressed === true) {
		options.headers['accept-encoding'] = 'gzip, deflate'
	}

	if (opts.hasOwnProperty('form')) {
		if (typeof opts.form !== 'object') {
			throw new Error('phin \'form\' option must be of type Object if present.')
		}

		const formDataString = qs.stringify(opts.form)

		options.headers['Content-Type'] = 'application/x-www-url-form-encoded'
		options.headers['Content-Length'] = Buffer.byteLength(formDataString)

		opts.data = formDataString
	}

	var req
	const resHandler = (res) => {
		var stream = res
		if (options.compressed === true) {
			if (res.headers['content-encoding'] === 'gzip') {
				stream = res.pipe(zlib.createGunzip())
			} else if (res.headers['content-encoding'] === 'deflate') {
				stream = res.pipe(zlib.createInflate())
			}
		}
		res.body = new Buffer([])
		stream.on('data', (chunk) => {
			res.body = Buffer.concat([res.body, chunk])
		})
		stream.on('end', () => {
			if (cb) {
				cb(null, res)
			}
		})
	}

	// Dependency injection for testing

	const http = injectedHttp || realHttp

	switch (addr.protocol.toLowerCase()) {
		case 'http:':
			req = http.request(options, resHandler)
			break
		case 'https:':
			req = https.request(options, resHandler)
			break
		default:
			if (cb) {
				cb(new Error('Invalid / unknown URL protocol. Expected HTTP or HTTPS.'), null)
			}
			return
	}

	if (typeof options.timeout === 'number') {
		req.setTimeout(options.timeout, () => {
			req.abort()

			cb(new Error('Timeout has been reached.'), null)
			cb = null
		})
	}

	req.on('error', (err) => {
		if (cb) {
			cb(err, null)
		}
	})
	
	if (opts.hasOwnProperty('data')) {
		var postData = opts.data

		if (!(opts.data instanceof Buffer) && typeof opts.data === 'object') {
			const contentType = options.headers['content-type'] || options.headers['Content-Type']
			if (contentType === 'application/x-www-url-form-encoded') {
				postData = qs.stringify(opts.data)
			} else {
				try {
					postData = JSON.stringify(opts.data)
				}
				catch (err) {
					cb(new Error('Couldn\'t stringify object. (Likely due to a circular reference.)'), null)
				}
			}
		}
		req.write(postData)
	}
	req.end()
}

// If we're running Node.js 8+, let's promisify it

phin.promisified = (opts, http) => {
	return new Promise((resolve, reject) => {
		phin(opts, (err, res) => {
			if (err) {
				reject(err)
			} else {
				resolve(res)
			}
		}, http)
	})
}

if (util.promisify) {
	phin[util.promisify.custom] = phin.promisified
}

module.exports = phin