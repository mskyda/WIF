var email = require('emailjs').server.connect({
	user:     'bot.wif@yandex.com',
	password: 'wif.bot',
	host:     'smtp.yandex.com',
	ssl:      true
});

module.exports.send = function(address, msg){

	var emailMsgEn = 'Hello, <br><br> Your User ID is <strong>' + msg + '</strong>. Use it with combination of you email-address for creating and managing your Spots. <br><br> Cheers :)';

	email.send({
		text:    emailMsgEn,
		from:    'Where is fish <bot.wif@yandex.com>',
		to:      address,
		subject: 'Your User ID at "Where is fish"',
		attachment: [{data: emailMsgEn, alternative:true}]
	}, function(err, msg) {
		if(err){
			console.log('Error: Send email');
		} else {
			console.log('Success: Send email to "' + msg.header.to + '"');
		}
	});

};