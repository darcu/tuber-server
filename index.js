var colors = require('colors');


var http = require('http');
var restify = require('restify');
var listData = require('save')('lists');

var port = 5454;



// var lists = {
// 	'a1': vids
// };

var vids = [
	'A_q5bdrelvI',
	'Jcu1AHaTchM',
	'5OVvJOeUdUs',
	'Zh3VENebCgk'
];

listData.create({
	name: 'default',
	vids: vids
}, function(error, list) {
	if (error) {
		console.log('err creating list');
	}
});


// http.createServer(function(request, response) {
// 	response.writeHead(200, {
// 		'Content-Type': 'text/plain'
// 	});
// 	response.write('Hello World\n');
// 	response.end();
// }).listen(port);


var server = restify.createServer({
	name: 'tuber'
});
server.listen(port, function() {
	console.log(colors.green('listening on port ' + port));
});

server
	.use(restify.fullResponse())
	.use(restify.bodyParser());

// server.get('/list', function(req, res, next) {
// 	listData.find({}, function(err, list) {
// 		res.send(list);
// 		// res.send(JSON.stringify(vids));
// 	});
// });

server.post('/list/create', function(req, res, next) {
	console.log('\n called list/create');
	console.log(req.params);


	if (req.params.name === undefined) {
		return next(new restify.InvalidArgumentError('Name must be supplied'));
	}

	listData.create({
		name: req.params.name
	}, function(error, list) {
		if (error) {
			return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
		}

		res.send(201, list);
	});
});

server.post('/list/get', function(req, res, next) {
	console.log('\n called list/get');
	console.log(req.params.name);

	listData.findOne({
		name: req.params.name
	}, function(error, list) {
		if (error) {
			return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
		}

		if (list) {
			res.send(200, list);
		} else {
			res.send(404);
		}
	});
});

server.post('/list/add', function(req, res, next) {
	console.log('\n called list/add');
	console.log(req.params);

	if (req.params.name === undefined || req.params.id === undefined) {
		return next(new restify.InvalidArgumentError('Id must be supplied'));
	}

	listData.findOne({
		name: req.params.name
	}, function(error, list) {
		if (error) {
			return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
		}

		if (!list) {
			var vids = [req.params.id];
			listData.create({
				name: req.params.name,
				vids: vids
			}, function(error, list) {
				if (error) {
					return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
				}

				res.send(201, list);
			});
		} else {
			list.vids.push(req.params.id);

			listData.update(list, function(error, list) {
				if (error) {
					return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
				}
				res.send(201, list);
			});
		}
	});
});
