const w = []

w.add = (name, t) => w.push([name, t])

const p = require('../').unpromisified
const pp = require('../')

const http = require('http')
const zlib = require('zlib')
const qs = require('querystring')

var httpHandler = (req, res) => {
	switch (req.method) {
		case 'GET':
			switch (req.url) {
				case '/testget':
					res.writeHead(200)
					res.end('Hi.')
					break
				case '/slowres':
					setTimeout(() => {
						res.writeHead(200)
						res.end('That was slow.')
					}, 1300);
					break
				case '/notjson':
					res.writeHead(200)
					res.end('hey')
					break
				case '/chunked':
						res.writeHead(200)
						res.write('hi')
						setTimeout(() => {
							res.end('hey')
						}, 50)
					break
				case '/json':
					res.writeHead(200)
					res.end(JSON.stringify({
						'hi': 'hey'
					}))
					break
				case '/corrected':
					res.writeHead(200)
					res.end('That\'s better.')
					break
				case '/redirect2':
					res.writeHead(301, {
						'Location': '/corrected'
					})
					res.end()
					break
				case '/redirect':
					res.writeHead(301, {
						'Location': '/redirect2'
					})
					res.end()
					break
				case '/compressed':
					res.writeHead(200, {
						'Content-Encoding': 'gzip'
					})

					const compressor = zlib.createGzip()

					compressor.pipe(res)

					compressor.write('Hello there')
					compressor.end()
					break
				default:
					res.writeHead(404)
					res.end('Not a valid test endpoint')
					break
			}
			break
		case 'POST':
			var postbody = ''

			req.on('data', (ch) => {
				postbody += ch
			})

			req.on('end', () => {
				switch (req.url) {
					case '/testpost':
						if (postbody === 'Hey there!') {
							res.writeHead(200)
							res.end('Looks good.')
						}
						else {
							res.writeHead(400)
							res.end('Client didn\'t send expected data.')
						}
						break
					case '/testemptyresponse':
						res.writeHead(204)
						res.end()
						return
					case '/testContentTypeJSON':
						if (req.headers['content-type'] === 'application/json') {
							res.writeHead(200)
							res.end('OK')
						}
						else {
							res.writeHead(400)
							res.end('Bad header')
						}

						break
					case '/testfd':
						if (postbody.includes('hey') && postbody.includes('Hi')) {
							if (req.headers['content-type'].toString().includes('form')) {
								res.writeHead(200)
								res.end('got some form-like data.')
							}
							else {
								res.writeHead(400)
								res.end('Incorrect Content-Type recieved by server.')
							}
						}
						else {
							res.writeHead(400)
							res.end('Couldn\'t find a required property in data.')
						}
						break
					case '/testjson':
						try {
							let jsonParsed = JSON.parse(postbody)

							if (jsonParsed.hi === 'hey') {
								res.writeHead(200)
								res.end('Good.')
							}
							else {
								res.writeHead(400)
								res.end('Bad data.')
							}
						}
						catch (err) {
							res.writeHead(400)
							res.end('Not JSON.')
							return
						}
						break
					case '/simplepost':
						res.writeHead(200)
						res.end('Got your POST.')
						break
					default:
						res.writeHead(404)
						res.end('Not a valid POST test endpoint')
						break
				}
			})
			break
		default:
			res.writeHead(405)
			res.end('Invalid request method')
			break
	}
}

w.add('Simple GET request', (result) => {
	p('http://localhost:5136/testget', (err, res) => {
		if (err) {
			result(false, err)
			return
		}
		if (res.statusCode === 200 && res.body.toString() === 'Hi.') {
			result(true, 'Recieved expected body and status code.')
		}
		else {
			result(false, 'Recieved unexpected data. Status code: ' + res.statusCode)
		}
	})
})

w.add('POST request with body', (result) => {
	p({
		'url': 'http://localhost:5136/testpost',
		'method': 'POST',
		'data': 'Hey there!'
	}, (err, res) => {
		if (err) {
			result(false, err)
			return
		}
		if (res.statusCode === 200 && res.body.toString() === 'Looks good.') {
			result(true, 'Client sent expected data, recieved by endpoint.')
		}
		else {
			result(false, 'Recieved unexpected data. Status code: ' + res.statusCode)
		}
	})
})

w.add('Promisified phin requesting', (result) => {
	pp({
		'url': 'http://localhost:5136/testget',
		'method': 'GET'
	}).then((res) => {
		if (res.body.toString() === 'Hi.') {
			result(true, 'Promisified phin requested properly.')
		}
		else {
			result(false, 'Promisified phin did not properly send data to handler.')
		}
	}).catch((err) => {
		result(false, err)
	})
})

w.add('Timeout option', (result) => {
	p({
		'url': 'http://localhost:5136/slowres',
		'method': 'GET',
		'timeout': 500
	}, (err, res) => {
		if (err) {
			if (/timeout/gi.test(err.toString())) {
				result(true, 'Request timed out properly.')
				return
			}
			else {
				result(false, 'Non-timeout related error from phin.')
			}
		}
		else {
			result(false, 'Request didn\'t time out properly.')
		}
	})
})

w.add('Sending form data with \'form\' option', (result) => {
	p({
		'url': 'http://localhost:5136/testfd',
		'method': 'POST',
		'form': {
			'hey': 'Hi'
		}
	}, (err, res) => {
		if (err) {
			result(false, err)
		}
		else {
			if (res.statusCode === 200) {
				result(true, 'Server recieved valid form data.')
			}
			else {
				result(false, res.body.toString())
			}
		}
	})
})

w.add('Parse JSON', (result) => {
	p({
		'url': 'http://localhost:5136/json',
		'method': 'GET',
		'timeout': 500,
		'parse': 'json'
	}, (err, res) => {
		if (!err && typeof res.body === 'object' && res.body.hi === 'hey') {
			result(true, 'Parsed JSON properly.')
		}
		else result(false, 'Failed to parse JSON.')
	})
})

w.add('Parse string', (result) => {
	p({
		'url': 'http://localhost:5136/testget',
		'method': 'GET',
		'parse': 'string',
	}, (err, res) => {
		if (!err && typeof res.body === 'string' && res.body === 'Hi.') {
			result(true, 'Parsed string properly.')
		}
		else result(false, 'Failed to parse string.')
	})
})

w.add('Parse "none" returns Buffer', (result) => {
	p({
		'url': 'http://localhost:5136/testget',
		'method': 'GET',
		'parse': 'none',
	}, (err, res) => {
		if (!err && res.body instanceof Buffer && Buffer.from('Hi.').equals(res.body)) {
			result(true, 'Buffer returned properly.')
		}
		else result(false, 'Failed to return Buffer.')
	})
})

w.add('Default no parse returns Buffer', (result) => {
	p({
		'url': 'http://localhost:5136/testget',
		'method': 'GET',
	}, (err, res) => {
		if (!err && res.body instanceof Buffer && Buffer.from('Hi.').equals(res.body)) {
			result(true, 'Buffer returned properly.')
		}
		else result(false, 'Failed to return Buffer.')
	})
})

w.add('Send object', (result) => {
	p({
		'url': 'http://localhost:5136/testjson',
		'method': 'POST',
		'timeout': 500,
		'data': {
			'hi': 'hey'
		}
	}, (err, res) => {
		if (!err) {
			if (res.statusCode === 200) {
				result(true, 'Server recieved the correct data.')
			}
			else result(false, res.body.toString())
		}
		else result(false, err)
	})
})

w.add('No callback', (result) => {
	try {
		p({
			'url': 'http://localhost:5136/testget',
			'method': 'GET',
			'stream': true,
			'timeout': 1000
		})
	}
	catch (err) {
		result(false, err)
		return
	}

	result(true, 'Success.')
})

w.add('Parse bad JSON', (result) => {
	p({
		'url': 'http://localhost:5136/notjson',
		'method': 'GET',
		'timeout': 500,
		'parse': 'json'
	}, (err, res) => {
		if (err) {
			result(true, 'Gave correct error on invalid JSON.')
		}
		else {
			result(false, 'Didn\'t give error on invalid JSON.')
		}
	})
})

w.add('Compression', (result) => {
	p({
		'url': 'http://localhost:5136/compressed',
		'method': 'GET',
		'timeout': 1000,
		'compression': true
	}, (err, res) => {
		result(res.body.toString() === 'Hello there', res.body.toString())
	})
})

w.add('Follow redirect', (result) => {
	p({
		'url': 'http://localhost:5136/redirect',
		'method': 'GET',
		'timeout': 1000,
		'followRedirects': true
	}, (err, res) => {
		result(res.statusCode === 200)
	})
})

w.add('Stream data from server', (result) => {
	p({
		'url': 'http://localhost:5136/chunked',
		'method': 'GET',
		'stream': true,
		'timeout': 500
	}, (err, res) => {
		if (err) {
			result(false, err)
		}
		else {
			if (res.hasOwnProperty('stream')) {
				res.stream.once('data', (data) => {
					if (data.toString() === 'hi') {
						result(true, 'Stream got expected partial data.')
					}
					else {
						result(false, 'Stream got unexpected partial data.')
					}
				})
			}
			else {
				result(false, 'Stream property didn\'t exist.')
			}
		}
	})
})

w.add('Defaults with just URL', async (result) => {
	const ppost = pp.defaults({
		'method': 'POST'
	})

	const res = await ppost('http://localhost:5136/simplepost')

	result(res.statusCode === 200 && res.body.toString() === 'Got your POST.', res.statusCode)
})

w.add('Defaults with object options', async (result) => {
	const ppost = pp.defaults({
		'method': 'POST'
	})

	const res = await ppost({
		'url': 'http://localhost:5136/simplepost'
	})

	result(res.statusCode === 200 && res.body.toString() === 'Got your POST.', res.statusCode)
})

w.add('Buffer body', async (result) => {
	const res = await pp({
		'method': 'POST',
		'url': 'http://localhost:5136/testpost',
		'data': Buffer.from('Hey there!')
	})

	result(res.statusCode === 200, res.body.toString())
})

w.add('JSON body content-type header', async (result) => {
	const res = await pp({
		'method': 'POST',
		'url': 'http://localhost:5136/testContentTypeJSON',
		'data': {
			'hey': 'hi'
		}
	})

	result(res.statusCode === 200, res.body.toString())
})

w.add('Ensure that per-request options do not persist between defaults', async (result) => {
	const def = pp.defaults({
		'url': 'http://localhost:5136/testget',
		'timeout': 1000
	})

	const r1 = await def({
		'url': 'http://localhost:5136/notjson'
	})

	const r2 = await def({})

	result(r1.body.toString() === 'hey' && r2.body.toString() === 'Hi.', r1.body.toString() + ' ' + r2.body.toString())
})

let fail = false

const runTest = (i) => {
	const entry = w[i]
	console.log(i, "running", entry[0])
	const result = (r, message) => {
		if (r) {
			console.log("> OK", entry[0], message)
		} else {
			fail = true
			console.error("> Fail", entry[0], message)
		}
		if (w.length > i+1) {
			runTest(i+1)
		} else {
			process.exit(fail ? 1 : 0)
		}
	}
	if (entry[1].hasOwnProperty('then')) {
		entry[1](result).catch((err) => {
			fail = true
			console.error("> Error", entry[0], err)
		})
	} else {
		entry[1](result)
	}
}

const runTests = () => {
	runTest(0)
}

var httpServer = http.createServer(httpHandler).listen(5136, runTests)
