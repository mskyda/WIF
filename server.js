var express         = require('express');
var favicon         = require('serve-favicon');
var path            = require('path');
var bodyParser      = require('body-parser');
var log             = require('./libs/log')(module);
var session         = require('express-session');
var config          = require('./libs/config');
var MateModel       = require('./libs/mongoose').MateModel;

var app = express();

app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: 'seven'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, "public")));

/*app.get('/api', function (req, res) {res.send('API is running');});*/

app.get('/api/mates', function(req, res) {
    MateModel.find({}, 'name pic', function (err, mates) {
        if (!err) {
			log.info("mates list returned");
            return res.send(mates);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.get('/api/mate/:id', function(req, res) {
	MateModel.findById(req.params.id, function (err, mate) {
		if(!mate) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}
		if (!err) {
			log.info("mate info returned");
			return res.send({ status: 'OK', mate:mate });
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			return res.send({ error: 'Server error' });
		}
	});
});

app.post('/api/mate', function(req, res) {

	MateModel.findOne({sid: req.session.id}, function (err, mate){

		/*if(!!mate){
			log.info("mate is in session");
			res.statusCode = 403;
			return res.send({ error: 'forbidden' });
		}*/

		var mate = new MateModel({
			name    : req.body.name,
			desc    : req.body.desc,
			coords  : req.body.coords,
			pic     : req.body.pic,
			contact : req.body.contact,
			expireAt: new Date(new Date().valueOf() + +req.body.duration),
			sid: req.session.id
		});

		mate.save(function (err) {
			if (!err) {
				log.info("mate created");
				return res.send({ status: 'OK', mate: mate});
			} else {
				if(err.name == 'ValidationError') {
					res.statusCode = 400;
					res.send({ error: 'Validation error' });
				} else {
					res.statusCode = 500;
					res.send({ error: 'Server error' });
				}
				log.error('Internal error(%d): %s',res.statusCode,err.message);
			}
		});

	});

});

app.put('/api/mate/:id', function (req, res){ // update

	MateModel.findById(req.params.id, function (err, mate) {

		if(!mate) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}

		/*if(mate.sid !== req.session.id){
			log.info("no rights");
			res.statusCode = 403;
			return res.send({ error: 'forbidden' });
		}*/

		mate.name     = req.body.name;
		mate.desc     = req.body.desc;
		mate.coords   = req.body.coords;
		mate.exp      = req.body.exp;
		mate.pic      = req.body.pic;
		mate.contact  = req.body.contact;
		mate.expireAt = new Date(new Date().valueOf() + +req.body.duration);

		mate.save(function (err) {
			if (!err) {
				log.info("mate updated");
				return res.send({ status: 'OK', mate:mate });
			} else {
				if(err.name == 'ValidationError') {
					res.statusCode = 400;
					res.send({ error: 'Validation error' });
				} else {
					res.statusCode = 500;
					res.send({ error: 'Server error' });
				}
				log.error('Internal error(%d): %s',res.statusCode,err.message);
			}
		});
	});

});

app.delete('/api/mate/:id', function (req, res){
	MateModel.findById(req.params.id, function (err, mate) {
		if(!mate) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}
		return mate.remove(function (err) {
			if (!err) {
				log.info("mate removed");
				return res.send({ status: 'OK' });
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s',res.statusCode,err.message);
				return res.send({ error: 'Server error' });
			}
		});
	});
});

app.get('*', function(req, res){ // 404
	res.status(404);
	log.debug('Not found URL: %s',req.url);
	res.send({ error: 'Not found' });
	return;
});

app.use(function(err, req, res, next){ // error
	res.status(err.status || 500);
	log.error('Internal error(%d): %s',res.statusCode,err.message);
	res.send({ error: err.message });
	return;
});

var port = process.env.PORT || config.get('port');

app.listen(port, function(){
    log.info('Express server listening on port ' + port);
});