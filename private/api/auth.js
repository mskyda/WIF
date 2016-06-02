var api       = require('../routes'),
	_         = require('underscore'),
	bcrypt    = require('bcrypt');

var authtApi = {

	init: function(req, res){

		if(req.body.spotID){

			api.SpotModel.findById(req.body.spotID, function (err, spot) {

				if(!spot) {
					res.statusCode = 404;
					return res.send({ error: 'Not found' });
				} else {
					if(spot.owner === req.body.userID){
						console.log('Success: login for "' + req.body.userEmail + '"');
						return res.send({msg: 'ID is correct'});
					} else {
						console.log('Error: login for "' + req.body.userEmail + '"');
						res.statusCode = 401;
						return res.send({msg: 'ID is wrong'});
					}
				}

			});

		} else if(req.body.userID){

			bcrypt.compare(req.body.userEmail, req.body.userID, function(err, result) {

				if(result){
					console.log('Success: login for "' + req.body.userEmail + '"');
					return res.send({msg: 'ID is correct'});
				} else {
					console.log('Error: login for "' + req.body.userEmail + '"');
					res.statusCode = 401;
					return res.send({msg: 'ID is wrong'});
				}

			});

		} else {

			bcrypt.hash(req.body.userEmail, 10, function(err, hash) {

				api.SendEmail(req.body.userEmail, hash);

				return res.send({msg: 'email sent'});

			});

		}

	}

};

_.bindAll(authtApi, 'init');

exports.Auth = authtApi;