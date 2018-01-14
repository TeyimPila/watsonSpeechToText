module.exports = function (app) {
    const authController = require('../controllers/authController');

    app.get('/v1/api/getToken', authController.getToken);
}
