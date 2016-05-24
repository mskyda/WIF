var express         = require('express'),
	path            = require('path'),
	bodyParser      = require('body-parser'),
	_				= require('underscore'),
	Spot            = require('./libs/mongoose').SpotModel,
	sendEmail       = require('./libs/email').send,
	app             = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var API = {

	getTotal: function(res, data){

		Spot.count({}, function(err, total) {

			if (!err) {
				console.log('Success: total ammount returned');
				return res.send(_.extend({status: 'OK', total: total}, data || {}));
			} else {
				res.statusCode = 500;
				console.log('Error: Internal error(%d): %s',res.statusCode,err.message);
				return res.send({ error: 'Server error' });
			}

		})
	},

	getSpots: function(req, res){

		if(!req.query.lat || !req.query.lng){
			res.statusCode = 400;
			return res.send({ error: 'Validation error: "lat" and "lng" are required'});
		}

		// todo: filter results by coords

		Spot.find({}, 'name coords', function (err, spots) {
			if (!err) {
				console.log('Success: spots list returned');
				return res.send(spots);
			} else {
				res.statusCode = 500;
				console.log('Error: ', res.statusCode, err.message);
				return res.send({ error: 'Server error' });
			}
		});

	}

};

app.post('/api/account', function(req, res) {

	if(!req.body.password){

		sendEmail(req.body.email, 'sdfdsfdsf');

		return res.send({status: 'OK', msg: 'email sent.'});

	}

});


app.get('/api/spots', function(req, res) {

	return _.keys(req.query).length === 0 ? API.getTotal(res) : API.getSpots(req, res);

});

app.get('/api/spots/:id', function(req, res) {

	Spot.findById(req.params.id, function (err, spot) {
		if(!spot) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}
		if (!err) {
			console.log('Success: spot info returned');
			return res.send({ status: 'OK', spot: spot});
		} else {
			res.statusCode = 500;
			console.log('Error: ', res.statusCode, err.message);
			return res.send({ error: 'Server error' });
		}
	});

});

app.post('/api/spots', function(req, res) {

	var spot = new Spot({
		name    : req.body.name,
		desc    : req.body.desc,
		coords  : req.body.coords,
		owner   : req.body.owner
	});

	spot.save(function (err) {

		if (!err) {
			console.log('Success: spot created');
			return API.getTotal(res, {spot: spot})
		} else {
			if(err.name == 'ValidationError') {
				res.statusCode = 400;
				res.send({ error: 'Validation error' });
			} else {
				res.statusCode = 500;
				res.send({ error: 'Server error' });
			}
			console.log('Error: ', res.statusCode, err.message);
		}
	});


});

app.put('/api/spots/:id', function (req, res){ // update

	Spot.findById(req.params.id, function (err, spot) {

		if(!spot) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}

		spot.name     = req.body.name;
		spot.desc     = req.body.desc;
		spot.coords   = req.body.coords;
		spot.owner   = req.body.owner;

		spot.save(function (err) {
			if (!err) {
				console.log('Success: spot updated');
				return res.send({ status: 'OK', spot:spot});
			} else {
				if(err.name == 'ValidationError') {
					res.statusCode = 400;
					res.send({ error: 'Validation error' });
				} else {
					res.statusCode = 500;
					res.send({ error: 'Server error' });
				}
				console.log('Error: ', res.statusCode, err.message);
			}
		});
	});

});

app.delete('/api/spots/:id', function (req, res){

	Spot.findById(req.params.id, function (err, spot) {

		if(!spot) {
			res.statusCode = 404;
			return res.send({ error: 'Not found' });
		}

		return spot.remove(function (err) {
			if (!err) {
				console.log('Success: spot deleted');
				return res.send({ status: 'OK' });
			} else {
				res.statusCode = 500;
				console.log('Error: ', res.statusCode, err.message);
				return res.send({ error: 'Server error' });
			}
		});
	});

});

app.get('*', function(req, res){ // 404
	res.status(404);
	console.log('Error: Not found URL ',req.url);
	res.send({ error: 'Not found' });
});

app.use(function(err, req, res){ // error
	res.status(err.status || 500);
	console.log('Error: ', res.statusCode ,err.message);
	res.send({ error: err.message });
});

var port = process.env.PORT || 1337;

app.listen(port, function(){
	console.log('Success: server listening on port ' + port);
});