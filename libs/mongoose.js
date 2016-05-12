var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {log.error('connection error:', err.message)});

db.once('open', function callback () {log.info("Connected to DB!")});

var Spot = new mongoose.Schema({
	name:         { type: String, required: true  },
	desc:         { type: String, required: false },
	coords:       { type: Object, required: true  },

	pic:          { type: String, required: false }, // for future
	rating:       { type: Number, required: false }  // for future
});

Spot.path('name').validate(function (str) {

    return str.length > 5 && str.length < 70;

}, 'invalid name');

module.exports.SpotModel = mongoose.model('Spot', Spot);