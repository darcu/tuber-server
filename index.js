var colors = require('colors'); // command line colors, fully optional
var http = require('http');
var restify = require('restify'); // api lib

var list = require('./list.js');

var port = 5454;

var server = restify.createServer({
	name: 'tuber'
});

server.listen(port, function() {
	console.log(colors.green('listening on port ' + port + '\n'));
});

server
// .use(restify.CORS())
	.use(restify.fullResponse())
	.use(restify.bodyParser());


server.post('/api/list/get', function(req, res, next) {
	console.log(list.getData());
	console.log('get list', list.getData().vids);

	if (list.getData() && list.getData().vids) {
		res.send(200, {
			success: true,
			name: list.getData()._id,
			list: list.getData().vids
		});
	} else {
		res.send(404);
	}
});

server.post('/api/list/add', function(req, res, next) {
	console.log('add list', req.params.id);

	if (list.getData() && list.getData().vids && req.params.id) {
		list.add(req.params.id, function(err) {
			res.send(201, {
				success: true,
				name: list.getData()._id,
				list: list.getData().vids,
				added: req.params.id
			});
		});
	}
});

server.post('/api/list/drop', function(req, res, next) {
	console.log('drop list', req.params.id);

	if (list.getData() && list.getData().vids && req.params.id) {
		list.remove(req.params.id, function(err) {
			res.send(201, {
				success: true,
				name: list.getData()._id,
				list: list.getData().vids,
				added: req.params.id
			});
		});
	}
});
