var api = require('../routes'),
	_ = require('underscore'),
	crypto = require('crypto');

var authtApi = {

	init: function(req, res){

		if(req.body.spotID){

			api.SpotModel.findById(req.body.spotID, function (err, spot) {

				if(!spot) {

					res.statusCode = 404;

					return res.send({ error: 'Not found' });

				}

				if(spot.owner === req.body.userID){

					// eslint-disable-next-line no-console
					console.log('Success: login for ID "' + req.body.userID + '"');

					return res.send({ msg: 'ID is correct' });

				}

				// eslint-disable-next-line no-console
				console.log('Error: login for ID "' + req.body.userID + '"');

				res.statusCode = 401;

				return res.send({ msg: 'ID is wrong' });

			});

		} else if(req.body.userID){

			var decipher = crypto.createDecipher('aes-128-cbc', process.env.WIF_SECRET), decrypted;

			// eslint-disable-next-line no-empty
			try { decrypted = decipher.update(req.body.userID, 'hex', 'utf-8') + decipher.final('utf-8'); } catch (e){}

			if(decrypted && decrypted === req.body.userEmail.slice(0, 15)){

				// eslint-disable-next-line no-console
				console.log('Success: login for "' + req.body.userEmail + '"');

				return res.send({ msg: 'ID is correct' });

			}

			// eslint-disable-next-line no-console
			console.log('Error: login for "' + req.body.userEmail + '"');

			res.statusCode = 401;

			return res.send({ msg: 'ID is wrong' });

		} else {

			var cipher = crypto.createCipher('aes-128-cbc', process.env.WIF_SECRET);

			// eslint-disable-next-line new-cap
			api.SendEmail(req.body.lang, cipher.update(req.body.userEmail.slice(0, 15), 'utf8', 'hex') + cipher.final('hex'), req.body.userEmail);

			return res.send({ msg: 'email sent' });

		}

	}

};

_.bindAll(authtApi, 'init');

exports.Auth = authtApi;

