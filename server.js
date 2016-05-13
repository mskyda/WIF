var express         = require('express'),
	favicon         = require('serve-favicon'),
	path            = require('path'),
	bodyParser      = require('body-parser'),
	log             = require('./libs/log')(module),
	Spot            = require('./libs/mongoose').SpotModel,
	app             = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, "public")));

/*app.get('/api', function (req, res) {res.send('API is running');});*/

app.get('/api/spots', function(req, res) {

	Spot.find({}, 'name coords', function (err, spots) {
        if (!err) {
			log.info("spots list returned");
            return res.send(spots);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });

});

app.get('/api/spot/:id', function(req, res) {

	Spot.findById(req.params.id, function (err, spot) {
		if(!spot) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}
		if (!err) {
			log.info("spot info returned");
			return res.send({ status: 'OK', spot: spot});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			return res.send({ error: 'Server error' });
		}
	});

});

app.post('/api/spot', function(req, res) {

	var spot = new Spot({
		name    : req.body.name,
		desc    : req.body.desc,
		coords  : req.body.coords
	});

	spot.save(function (err) {

		if (!err) {
			log.info("spot created");
			return res.send({ status: 'OK', spot: spot});
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

app.put('/api/spot/:id', function (req, res){ // update

	Spot.findById(req.params.id, function (err, spot) {

		if(!spot) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}

		spot.name     = req.body.name;
		spot.desc     = req.body.desc;
		spot.coords   = req.body.coords;

		spot.save(function (err) {
			if (!err) {
				log.info("spot updated");
				return res.send({ status: 'OK', spot:spot});
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

app.delete('/api/spot/:id', function (req, res){

	Spot.findById(req.params.id, function (err, spot) {

		if(!spot) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}

		return spot.remove(function (err) {
			if (!err) {
				log.info("spot deleted");
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
});

app.use(function(err, req, res){ // error
	res.status(err.status || 500);
	log.error('Internal error(%d): %s',res.statusCode,err.message);
	res.send({ error: err.message });
});

var port = process.env.PORT || 1337;

app.listen(port, function(){
    log.info('Express server listening on port ' + port);
});