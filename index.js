var colors = require('colors');


var http = require('http');
var restify = require('restify');
var listData = require('save')('lists');

var port = 5454;


var nano = require('nano')('http://localhost:5984');
var cdb = nano.db;

var musicList;

cdb.list(function(err, body) {
	body.forEach(function(db) {
		if (db === 'music') {
			musicList = cdb.use('music');
		}
	});

	if (!musicList) {
		cdb.create('music', function() {
			cdb.use('music');
		});
	}

	dbReady();
});


function dbReady() {
	var vids = [
		'A_q5bdrelvI',
		'Jcu1AHaTchM',
		'5OVvJOeUdUs',
		'Zh3VENebCgk'
	];

	var listData = {
		list: vids
	};

	function update(callback) {
		musicList.insert(listData, 'default', function(err, body) {
			if (err) {
				console.log('pula');
				callback(err);
				return;
			}

			callback && callback(null);
		});
	}

	function getDefaultList(callback) {
		musicList.get('default', {}, function(err, body) {
			if (err) {
				if (err.statusCode === 404) {
					update(getDefaultList);
					return;
				}
			}

			listData = body;
			callback && callback();
		});
	}

	function addToList(vidID, callback) {
		listData.list.push(vidID);
		update(callback);
	}

	function removeFromList(vidID, callback) {
		var index = listData.list.indexOf(vidID);
		if (index !== -1) {
			listData.list.splice(index, 1);
			update(callback);
		} else {
			callback && callback('not found');
		}
	}

	getDefaultList();

	/**
	 *
	 * server
	 *
	 */

	var server = restify.createServer({
		name: 'tuber'
	});
	server.listen(port, function() {
		console.log(colors.green('listening on port ' + port + '\n'));
	});

	server
		.use(restify.fullResponse())
		.use(restify.bodyParser());


	server.post('/list/get', function(req, res, next) {
		console.log('get list', listData.list);

		if (listData && listData.list) {
			res.send(200, {
				success: true,
				name: listData._id,
				list: listData.list
			});
		} else {
			res.send(404);
		}
	});

	server.post('/list/add', function(req, res, next) {
		console.log('add list', req.params.id);

		if (listData && listData.list && req.params.id) {
			addToList(req.params.id, function(err) {
					res.send(201, {
					success: true,
					name: listData._id,
					list: listData.list,
					added: req.params.id
				});
			});
		}
	});

	server.post('/list/drop', function(req, res, next) {
		console.log('drop list', req.params.id);

		if (listData && listData.list && req.params.id) {
			removeFromList(req.params.id, function(err) {
				res.send(201, {
					success: true,
					name: listData._id,
					list: listData.list,
					added: req.params.id
				});
			});
		}
	});
}
