var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

const APP_TOKEN = 'EAAMIF56YPUwBAE1S8D1ahMnyyuk8LPq73Dl8wTMBujdEskUSsGa9JNhkf79r0mxFC29leDB5cfSWZCqYWrpQFWPVFLwNMDWYQUjHsuKAFpsmoQEWMBbTTVAgy1jvxmCnJIAStYm6Vb9zhPuQhirCEH8JWvtO2ZBppE471XJ18eZB0t63Yie';

var app = express();
app.use(bodyParser.json());

app.listen(3001, function  () {
	console.log('Servidor port:3001');
})

app.get('/', function  (req, res) {
	res.send('Bienvenido');
})

app.get('/webhook', function  (req, res) {
	
	if (req.query['hub.verify_token'] == 'test_token') {
		res.send(req.query['hub.challenge']);

	}else{
		res.send('Vete');
	}
})

app.post('/webhook', function  (req, res) {
	
	var data = req.body;

	if (data.object == 'page') {

		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if (messagingEvent.message) {
					receiveMessage(messagingEvent);
				}

			});
		});
		res.sendStatus(200);
		console.log(data.object);
	}
});

function receiveMessage (event) {
	
	var senderID = event.sender.id;
	var messageText = event.message.text;

	evaluateMessage(senderID, messageText);
}

function evaluateMessage (recipientId, message) {
	
	var finalMessage = '';

	if (isContain(message.toLowerCase(), 'ayuda'.toLowerCase())) {
		finalMessage = "No te atendere ";

	}else{
		finalMessage = 'Solo vete ' + message;
	}
	if (isContain(message.toLowerCase(), 'Bildo'.toLowerCase())) {
		finalMessage = "Tu alma gemela";

	}
	if (isContain(message.toLowerCase(), 'Hola'.toLowerCase())) {
		finalMessage = "Hola como estas";

	}
	sendMessageText(recipientId, finalMessage);

}

function sendMessageText (recipientId, message) {
	
	var messageData = {
		recipient : {
			id : recipientId
		},
		message : {
			text : message
		}
	}
	callSendAPI(messageData);
}

function callSendAPI (messageData) {
	
	request({
		uri : 'https://graph.facebook.com/v2.6/me/messages',
		qs : { access_token : APP_TOKEN},
		method : 'POST',
		json : messageData
	}, function (error, response, data){

		if (error) {
			console.log('No se envio');
		} else{
			console.log('Enviado');
		}
	})
}

function isContain (setence, word) {
	return setence.indexOf(word) > -1;
}