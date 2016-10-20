const nano = require('nano')('http://localhost:5984'); // couchdb lib
const cdb = nano.db;

const log = require('./util.js').log;

const musicList;

cdb.list((err, body) => {
	if (err) {
		log("db", err);
		return;
	}

	body.forEach((db) => {
		if (db === 'music') {
			musicList = cdb.use('music');
			dbReady();
		}
	});

	if (!musicList) {
		cdb.create('music', () => {
			cdb.use('music');
			dbReady();
		});
	}
});


function dbReady() {
	var dData = {
		vids: [
			'A_q5bdrelvI',
			'Jcu1AHaTchM',
			'5OVvJOeUdUs',
			'Zh3VENebCgk'
		]
	};

	function update(user, data, callback) {
		musicList.insert(data, user || 'default', function(err, body) {
			if (err) {
				console.log('pula');
				callback(err);
				return;
			}

			callback && callback(user, body);
		});
	}

	function getList(user, callback) {
		musicList.get(user, {}, function(err, body) {
			if (err) {
				if (err.statusCode === 404) {
					update(user, dData, callback);
					return;
				}
			} else {
				callback && callback(user, body);
			}
		});
	}

	function getDefaultList(callback) {
		getList('default', callback);
	}

	function addToList(user, vidID, callback) {
		getList(user, function(err, body) {
			body.vids.push(vidID);
			update(user, body, callback);
		});
	}

	function removeFromList(user, vidID, callback) {
		getList(user, function(err, body) {
			var index = body.vids.indexOf(vidID);
			if (index !== -1) {
				body.vids.splice(index, 1);
				update(user, body, callback);
			} else {
				callback && callback('not found');
			}
		});
	}

	exports.getData = getList;
	exports.add = addToList;
	exports.remove = removeFromList;
}
