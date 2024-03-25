const {URL} = require('url')

const axios = require('axios')
const FormData = require('form-data')

/**
* phin options object. phin also supports all options from <a href="https://nodejs.org/api/http.html#http_http_request_options_callback">http.request(options, callback)</a> by passing them on to this method (or similar).
* @typedef {Object} phinOptions
* @property {string} url - URL to request (autodetect infers from this URL)
* @property {string} [method=GET] - Request method ('GET', 'POST', etc.)
* @property {string|Buffer|object} [data] - Data to send as request body (phin may attempt to convert this data to a string if it isn't already)
* @property {Object} [form] - Object to send as form data (sets 'Content-Type' and 'Content-Length' headers, as well as request body) (overwrites 'data' option if present)
* @property {Object} [headers={}] - Request headers
* @property {Object} [axiosOpts={}] - Custom core HTTP options for Axios
* @property {string} [parse=none] - Response parsing. Errors will be given if the response can't be parsed. 'none' returns body as a `Buffer`, 'json' attempts to parse the body as JSON, and 'string' attempts to parse the body as a string
* @property {boolean} [followRedirects=false] - Enable HTTP redirect following. This option exists for compatibility and sets axiosOpts.maxRedirects. Using axiosOpts.maxRedirects is recommended.
* @property {boolean} [compression=false] - Enable compression for request
* @property {boolean} [stream=false] - Enable streaming of response. (Removes body property)
* @property {?number} [timeout=null] - Request timeout in milliseconds
*/

/**
* Response data
* @callback phinResponseCallback
* @param {?(Error|string)} error - Error if any occurred in request, otherwise null.
* @param {?http.serverResponse} phinResponse - phin response object. Like <a href='https://nodejs.org/api/http.html#http_class_http_serverresponse'>http.ServerResponse</a> but has a body property containing response body, unless stream. If stream option is enabled, a stream property will be provided to callback with a readable stream.
*/

const axiosify = (opts) => {
	if (typeof opts === 'string') {
		return {
			'url': opts
		}
	}

	let responseType = 'arraybuffer'

	if (opts.parse) {
		responseType = {
			'none': 'arraybuffer',
			'json': 'json',
			'string': 'text'
		}[opts.parse]
	}

	if (opts.stream) {
		responseType = 'stream'
	}

	if (opts.hostname || opts.port || opts.path) {
		throw new Error('use of hostname, port, and path options is not supported')
	}

	const axiosOpts = {
		url: opts.url,
		method: opts.method,
		data: opts.data,
		headers: opts.headers,
		decompress: opts.compression,
		timeout: opts.timeout,
		responseType: responseType,
		transitional: {
			silentJSONParsing: false
		}
	}

	if (opts.followRedirects) {
		axiosOpts.maxRedirects = 10
	}

	if (opts.core) {
		throw new Error("core options no longer supported. see axiosOpts")
	}

	if (opts.form) {
		axiosOpts.data = new FormData()
		Object.keys(opts.form).forEach((fk) => {
			axiosOpts.data.append(fk, opts.form[fk])
		})
	}

	if (opts.axiosOpts) {
		Object.keys(opts.axiosOpts).forEach((ck) => {
			axiosOpts[ck] = opts.axiosOpts[ck]
		})
	}

	return axiosOpts
}

/**
* Sends an HTTP request
* @param {phinOptions|string} options - phin options object (or string for auto-detection)
* @returns {Promise<http.serverResponse>} - phin-adapted response object
*/
const phin = async (opts) => {
	if (typeof(opts) !== 'string') {
		if (!opts.hasOwnProperty('url')) {
			throw new Error('Missing url option from options for request method.')
		}
	}

	const aopts = axiosify(opts)

	const res = await axios(aopts)

	res.body = res.data
	res.statusCode = res.status
	res.stream = res.data

	return res
}

// If we're running Node.js 8+, let's promisify it

phin.promisified = phin

phin.unpromisified = (opts, cb) => {
	phin(opts).then((data) => {
		if (cb) cb(null, data)
	}).catch((err) => {
		if (cb) cb(err, null)
	})
}

// Defaults

phin.defaults = (defaultOpts) => async (opts) => {
	const nops = typeof opts === 'string' ? {'url': opts} : opts

	Object.keys(defaultOpts).forEach((doK) => {
		if (!nops.hasOwnProperty(doK) || nops[doK] === null) {
			nops[doK] = defaultOpts[doK]
		}
	})

	return await phin(nops)
}

phin.axiosify = axiosify

module.exports = phin
