var colors = require('colors'); // command line colors, fully optional
var http = require('http');
var restify = require('restify'); // api lib

var list = require('./list.js');

var port = 5454;

var server = restify.createServer({
	name: 'tuber'
});

function log(endpoint, message) {
	console.log(colors.green(endpoint) + '\n' + colors.white(message) + '\n');
}

server.listen(port, function() {
	log('listening on port', 5454)
});

server
	.use(restify.fullResponse())
	.use(restify.bodyParser());


server.post('/api/list/get', function(req, res, next) {
	log('list/get', req.params.userId);

	list.getData(req.params.userId, function(user, data) {
		if (data.vids) {
			res.send(200, {
				success: true,
				name: data._id,
				list: data.vids
			});
		} else {
			res.send(404);
		}
	});
});

server.post('/api/list/add', function(req, res, next) {
	log('list/add', req.params.id);

	if (req.params.id) {
		list.add(req.params.userId, req.params.id, function(user, data) {
			res.send(201, {
				success: true,
				name: data._id,
				list: data.vids,
				added: req.params.id
			});
		});
	}
});

server.post('/api/list/drop', function(req, res, next) {
	log('list/drop', req.params.id);

	if (req.params.id) {
		list.remove(req.params.userId, req.params.id, function(user, data) {
			res.send(201, {
				success: true,
				name: data._id,
				list: data.vids,
				added: req.params.id
			});
		});
	}
});

server.post('/api/user/login', function(req, res, next) {
	log('user/login', req.params.userId);

	res.send(200, {
		success: true,
		message: 'user login successful'
	});
});
