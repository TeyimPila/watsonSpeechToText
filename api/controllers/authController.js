require('dotenv').load();

const watson = require('watson-developer-cloud');

const authorization = new watson.AuthorizationV1({
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    url: watson.SpeechToTextV1.URL
});

exports.getToken = (req, res) => {

    authorization.getToken((error, token) => {
        if (error) {
            res.send(error)
        } else {
            res.send(token)
        }
    })
}