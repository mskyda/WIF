var mongoose    = require('mongoose');
/*var uri = 'mongodb://8739ce8925a02561abee68067be1da8a:mishgun_fdafe@eu-1.evennode.com/8739ce8925a02561abee68067be1da8a?replicaSet=rs0';*/
var uri = 'mongodb://mskyda:password123@ds011412.mlab.com:11412/wif';

mongoose.connect(uri);

var db = mongoose.connection;

db.on('error', function (err) {console.log('Error: ', err.message)});

db.once('open', function callback () {console.log("Success: connected to DB!")});

var Spot = new mongoose.Schema({
	name:         { type: String, required: true  },
	desc:         { type: String, required: false },
	coords:       { type: Object, required: true  },
	owner:        { type: String, required: true, select: false  },

	pic:          { type: String, required: false }, // for future
	rating:       { type: Number, required: false }  // for future
});

Spot.path('name').validate(function (str) {

    return str.length > 5 && str.length < 70;

}, 'invalid name');

Spot.path('owner').validate(function (str) {

	return str.length = 60;

}, 'invalid owner id');

exports.SpotModel = mongoose.model('Spot', Spot);