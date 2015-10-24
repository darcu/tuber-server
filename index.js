var colors = require('colors'); // command line colors, fully optional
var http = require('http');
var restify = require('restify'); // api lib

var list = require('./list.js');


var port = 5454;
var app = restify.createServer({
	name: 'tuber'
});

function log(endpoint, message) {
	console.log(colors.green(endpoint) + '\n' + colors.white(message) + '\n');
}

app.listen(port, () => log('listening on port', 5454));
app.use(restify.CORS({
	origins: ['http://localhost:8080'], // defaults to ['*']
	credentials: true, // defaults to false
	headers: ['X-Requested-With']
}));
app.use(restify.fullResponse());
app.use(restify.bodyParser());


app.post('/api/list/get', function(req, res, next) {
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

app.post('/api/list/add', function(req, res, next) {
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

app.post('/api/list/drop', function(req, res, next) {
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

app.post('/api/user/login', function(req, res, next) {
	log('user/login', req.params.userId);

	res.send(200, {
		success: true,
		message: 'user login successful'
	});
});
