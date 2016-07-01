var email = require('emailjs').server.connect({
		user     :     'admin@whereis.fish',
		password :      process.env.WIF_SECRET,
		host     :     'smtp.yandex.com',
		ssl      :      true
	}),
	fs = require('fs');

exports.SendEmail = function(lang, ID, address){

	fs.readFile('./public/i18n/' + (lang || 'en') + '.json', 'utf8', function (err, data) {

		if(err){

			console.log('Error: Load i18n');

		} else {

			var i18n = JSON.parse(data).emailContent,
				template = i18n.greet + '<br><br>' + i18n.topic + '<br><br> <strong>' + ID + '</strong> <br><br>' + i18n.desc + '<br><br>' + i18n.bye;

			email.send({
				text:    template,
				from:    i18n.from + ' <admin@whereis.fish>',
				to:      address,
				subject: i18n.subject,
				attachment: [{data: template, alternative:true}]
			}, function(err, msg) {

				if(err){

					console.log('Error: Send email');

				} else {

					console.log('Success: Send email to "' + msg.header.to + '"');

				}

			});

		}

	});

};