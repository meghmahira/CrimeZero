let superheros = require('./superheros');
module.exports = function (app) {
    app.get('/sos', (req, res) => {
        superheros.sendDistressSignal(req, res, (error, response)=>{
            if(error) {
                return res.status(error.statusCode)
                    .send({"message": error.message});
            }
            res.status(response.statusCode)
                .send({"message": response.message});
        });
    });
};