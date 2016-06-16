var email = require('emailjs').server.connect({
	user     :     'info@whereis.fish',
	password :      process.env.WIF_SECRET,
	host     :     'smtp.yandex.com',
	ssl      :      true
});

exports.SendEmail = function(address, msg){

	var emailMsgEn = 'Hello, <br><br> Your User ID is: <br><br> <strong>' + msg + '</strong> <br><br> Use it with combination of you email-address for managing your Spots. <br><br> Cheers :)';

	email.send({
		text:    emailMsgEn,
		from:    'info@whereis.fish',
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