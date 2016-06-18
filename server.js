var express         = require('express'),
	api             = require('./private/routes'),
	bodyParser      = require('body-parser'),
	fs              = require('fs'),
	http            = require('http'),
	https           = require('https'),
	forceSSL        = require('express-force-ssl'),
	credentials     = {
		key: fs.readFileSync('ssl.key', 'utf8'),
		cert: fs.readFileSync('ssl.crt', 'utf8'),
		ca: [fs.readFileSync('ssl_intermediate.crt', 'utf8')]
	},
	app             = express(),
	httpServer      = http.createServer(app);
	httpsServer     = https.createServer(credentials, app);

// Todo: config.js

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(forceSSL);
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

var portHTTP = process.env.PORT_HTTP || 8080,
	portHTTPS = process.env.PORT_HTTPS || 8443;

httpServer.listen(portHTTP, function(){
	console.log('Success: HTTP listening on port ' + portHTTP);
});
httpsServer.listen(portHTTPS, function(){
	console.log('Success: HTTPS listening on port ' + portHTTPS);
});