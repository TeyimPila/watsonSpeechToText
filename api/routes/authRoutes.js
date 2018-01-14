module.exports = function (app) {
    const authController = require('../controllers/authController');

    app.get('/getToken', authController.getToken);
}
