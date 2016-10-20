const db = require("./db.js");
const api = require("./api.js");


db.init().then(api.init);




/*
server.listen(port, () => {
    log('listening on port', 5454)
});

server.use(restify.fullResponse())
      .use(restify.bodyParser());


server.post('/api/list/get', (req, res, next) => {
    log('list/get', req.params.userId);

    list.getData(req.params.userId, (user, data) => {
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

server.post('/api/list/add', (req, res, next) => {
    log('list/add', req.params.id);

    if (req.params.id) {
        list.add(req.params.userId, req.params.id, (user, data) => {
            res.send(201, {
                success: true,
                name: data._id,
                list: data.vids,
                added: req.params.id
            });
        });
    }
});

server.post('/api/list/drop', (req, res, next) => {
    log('list/drop', req.params.id);

    if (req.params.id) {
        list.remove(req.params.userId, req.params.id, (user, data) => {
            res.send(201, {
                success: true,
                name: data._id,
                list: data.vids,
                added: req.params.id
            });
        });
    }
});

server.post('/api/user/login', (req, res, next) => {
    log('user/login', req.params.userId);

    res.send(200, {
        success: true,
        message: 'user login successful'
    });
});
*/