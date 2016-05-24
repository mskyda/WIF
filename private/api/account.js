var api       = require('../routes'),
	_         = require('underscore'),
	bcrypt    = require('bcrypt');

var accountApi = {

	init: function(req, res){

		if(!req.body.userID){

			bcrypt.hash(req.body.userEmail, 10, function(err, hash) {

				api.SendEmail(req.body.userEmail, hash);

				return res.send({msg: 'email sent'});

			});

		} else {

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

		}

	}

};

_.bindAll(accountApi, 'init');

exports.Account = accountApi;