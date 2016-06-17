var express         = require('express'),
	api             = require('./private/routes'),
	bodyParser      = require('body-parser'),
	fs              = require('fs'),
	https           = require('https'),
	credentials     = {
		key: fs.readFileSync('ssl.key', 'utf8'),
		cert: fs.readFileSync('ssl.crt', 'utf8'),
		ca: [
			fs.readFileSync('ssl_intermediate.crt', 'utf8')
		]
	},
	app             = express(),
	server          = https.createServer(credentials, app);

// Todo: config.js

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/api/spots', api.Spots.get);
app.get('/api/spots/:id', api.Spots.get);
app.post('/api/spots', api.Spots.post);
app.put('/api/spots/:id', api.Spots.put);
app.delete('/api/spots/:id', api.Spots.delete);
app.post('/api/auth', api.Auth.init);

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

server.listen(port, function(){
	console.log('Success: server listening on port ' + port);
});