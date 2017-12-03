const w = require('whew')

const p = require('../')

const http = require('http')
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
					case '/testfd':
						try {
							if (qs.parse(postbody).hey === 'Hi') {
								if (Buffer.byteLength(postbody) === Number(req.headers['content-length'])) {
									if (req.headers['content-type'].toString() === 'application/x-www-form-urlencoded') {
										res.writeHead(200)
										res.end('Recieved valid data.')
									}
									else {
										res.writeHead(400)
										res.end('Incorrect content-type recieved by server.')
									}
								}
								else {
									res.writeHead(400)
									res.end('Content-Length header contained incorrect content length.')
								}
							}
							else {
								res.writeHead(400)
								res.end('Couldn\'t find a required property in data.')
							}
						}
						catch (err) {
							res.writeHead(400)
							res.end('Parsing as query string failed. ' + err)
							break
						}
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
	p.promisified({
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

var httpServer = http.createServer(httpHandler).listen(5136, () => {
	w.test()
})