var api = require('../routes'),
	_   = require('underscore');

var spotsApi = {

	delete: function(req, res){

		var params = req.params.id ? req.params.id.split('+') : [],
			spotId = params[0] || '',
			usedId = params[1] || '';

		api.SpotModel.findById(spotId, function (err, spot) {

			if(!spot) {
				res.statusCode = 404;
				return res.send({ error: 'Not found' });
			}

			if(spot.owner !== usedId){
				console.log('Error: login for ID "' + usedId + '"');
				res.statusCode = 401;
				return res.send({msg: 'ID is wrong'});
			}

			spot.remove(function (err) {
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

	},

	put: function(req, res){

		api.SpotModel.findById(req.params.id, function (err, spot) {

			if(!spot) {
				res.statusCode = 404;
				return res.send({ error: 'Not found' });
			}

			if(req.body.comment){

				spot.comments = spot.comments || [];

				spot.comments.push(req.body.comment);

				spot.rating = 0;

				spot.comments.map(function(obj){spot.rating += obj.rating});

				spot.rating /= spot.comments.length;


			} else {

				if(spot.owner !== req.body.owner){
					console.log('Error: login for ID "' + req.body.owner + '"');
					res.statusCode = 401;
					return res.send({msg: 'ID is wrong'});
				}

				spot.name     = req.body.name;
				spot.desc     = req.body.desc;
				spot.coords   = req.body.coords;

			}

			spot.save(function (err) {
				if (!err) {
					console.log('Success: spot updated');
					return res.send({ status: 'OK', spot:spot});
				} else {
					console.log('Error: ', res.statusCode, err.message);
					if(err.name == 'ValidationError') {
						res.statusCode = 400;
						return res.send({ error: 'Validation error' });
					}
					res.statusCode = 500;
					return res.send({ error: 'Server error' });
				}
			});

		});

	},

	post: function(req, res){

		var spot = new api.SpotModel({
			name    : req.body.name,
			desc    : req.body.desc,
			coords  : req.body.coords,
			owner   : req.body.owner
		});

		spot.save(function (err) {
			if (!err) {
				console.log('Success: spot created');
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
		}.call(this));

	},

	get: function(req, res){

		if(_.keys(req.params).length !== 0){

			this.getSpot(req, res);

		} else if (_.keys(req.query).length !== 0) {

			this.getSpots(req, res);

		} else {

			this.getTotal(res);

		}

	},

	getTotal: function(res){

		api.SpotModel.count({}, function(err, total) {

			if (!err) {
				console.log('Success: total ammount returned');
				return res.send({status: 'OK', total: total});
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

		api.SpotModel.find({}, 'name coords rating', function (err, spots) {
			if (!err) {
				console.log('Success: spots list returned');
				return res.send(spots);
			} else {
				res.statusCode = 500;
				console.log('Error: ', res.statusCode, err.message);
				return res.send({ error: 'Server error' });
			}
		});

	},

	getSpot: function(req, res){

		api.SpotModel.findById(req.params.id, '-owner', function (err, spot) {

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

	}

};

_.bindAll(spotsApi, 'get', 'post', 'put', 'delete');

exports.Spots = spotsApi;