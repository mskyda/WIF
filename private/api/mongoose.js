var mongoose = require('mongoose');

mongoose.connect('mongodb://mskyda:' + process.env.WIF_SECRET + '@ds023373.mlab.com:23373/whereisfish');

var db = mongoose.connection;

db.on('error', function (err) {console.log('Error: ', err.message)});

db.once('open', function callback () {console.log("Success: connected to DB!")});

var Spot = new mongoose.Schema({
	name:         { type: String, required: true  },
	desc:         { type: String, required: false },
	coords:       { type: Object, required: true  },
	owner:        { type: String, required: true  },
	comments:     { type: Array,  required: false },
	rating:       { type: Number, required: false },
	picture:      { type: String, required: false } // Todo: images support
});

Spot.path('name').validate(function (str) {

    return str.length > 5 && str.length < 70;

}, 'invalid name');

Spot.path('owner').validate(function (str) {

	return str.length = 60;

}, 'invalid owner id');

exports.SpotModel = mongoose.model('Spot', Spot);

