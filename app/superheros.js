let fs = require('fs');
let nodeCache = require('node-cache');
let cache = new nodeCache();
const KEY = 'superHeroAppendix';
let error = {
    "statusCode": 400,
    "message": "You have sent an invalid code. Please type 0 <space> <code> and press send to call for a super hero"
};
let resolveSuperHero = function (code, superheros, next) {
    if (typeof superheros === 'string') {
        try {
            superheros = JSON.parse(superheros)
        }
        catch (e) {
            throw e;
        }
    }
    if (!superheros[code]) {
        error.statusCode = 404;
        return next(error);
    }
    let response = {
        "statusCode": 200,
        "message": "Keep Calm! " + superheros[code] + " is on the way!"
    };
    next(null, response);
};
let sendDistressSignal = function (req, res, next) {
    let code = req && req.query && req.query.code;
    if (!(code && code.length)) {
        return next(error);
    }
    code = decodeURIComponent(code);
    let codeParts = code.split(' ');
    if(!(codeParts && codeParts.length && codeParts[0] === '0' && codeParts[1].length)) {
        return next(error);
    }
    code = codeParts[1];
    cache.get(KEY, (error, data) => {
        if (error) throw error;
        if (data) {
            return resolveSuperHero(code, data, next);
        }
        fs.readFile('app/superheros.json', 'utf8', (error, data) => {
            if (error) throw error;
            cache.set(KEY, data);
            resolveSuperHero(code, data, next);
        });
    });
};
module.exports.sendDistressSignal = sendDistressSignal;