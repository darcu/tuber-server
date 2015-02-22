var nano = require('nano')('http://localhost:5984'); // couchdb lib
var cdb = nano.db;

var musicList;

cdb.list(function(err, body) {
	body.forEach(function(db) {
		if (db === 'music') {
			musicList = cdb.use('music');
			dbReady();
		}
	});

	if (!musicList) {
		cdb.create('music', function() {
			cdb.use('music');
			dbReady();
		});
	}
});


function dbReady() {
	var data = {
		vids: [
			'A_q5bdrelvI',
			'Jcu1AHaTchM',
			'5OVvJOeUdUs',
			'Zh3VENebCgk'
		]
	};

	function getFullList() {
		return data;
	}

	function update(callback) {
		musicList.insert(data, 'default', function(err, body) {
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

			data = body;
			callback && callback();
		});
	}

	function addToList(vidID, callback) {
		data.vids.push(vidID);
		update(callback);
	}

	function removeFromList(vidID, callback) {
		var index = data.vids.indexOf(vidID);
		if (index !== -1) {
			data.vids.splice(index, 1);
			update(callback);
		} else {
			callback && callback('not found');
		}
	}

	getDefaultList();

	exports.getData = getFullList;
	exports.add = addToList;
	exports.remove = removeFromList;
}
