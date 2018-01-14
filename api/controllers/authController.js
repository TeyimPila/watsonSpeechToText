require('dotenv').load();

const watson = require('watson-developer-cloud');

const authorization = new watson.AuthorizationV1({
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    url: watson.SpeechToTextV1.URL
});

exports.getToken = (request, response) => {

    authorization.getToken((error, token) => {
        if (error) {
            response.send(error)
        } else {
            response.send(token)
        }
    });
}