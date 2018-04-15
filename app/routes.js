let superheros = require('./superheros');
module.exports = function (app) {
    app.get('/sos', (req, res) => {
        superheros.sendDistressSignal(req, res, (error, response) => {
            if (error && error.statusCode) {
                res.status(error.statusCode)
                    .send({"message": error.message});
            }
            else if (response && response.statusCode) {
                res.status(response.statusCode)
                    .send({"message": response.message});
            }
            else {
                res.status(406)
                    .send({"message": "Unhandled Response"});
            }
        });
    });
};