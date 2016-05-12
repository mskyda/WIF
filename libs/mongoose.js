var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas

/*var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});*/
var Mate = new Schema({
	name:      { type: String, required: true  },
	desc:      { type: String, required: false },
	coords:    { type: Object, required: true  },
	pic:       { type: String, required: false },
	contact:   { type: Object, required: true  },
	expireAt:  { type: Date,   required: true, select: false },
	sid:       { type: String, required: true/*, select: false */}
});

Mate.index({expireAt:1},{expireAfterSeconds:0}); // expire by 'expireAt'

// validation
Mate.path('name').validate(function (v) {
    return v.length > 5 && v.length < 70;
},'invalid name');

Mate.path('expireAt').validate(function (v) { // in the future and less than hour
	var diff = (v - new Date());
	return diff > 0 && diff <= 1000 * 60 * 60;
}, 'invalid expiration date');

var MateModel = mongoose.model('Mate', Mate);

module.exports.MateModel = MateModel;