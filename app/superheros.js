let fs = require('fs');
let nodeCache = require('node-cache');
let cache = new nodeCache();

const CACHE_KEY = 'superHeroAppendix';
const DIGIT_CHAR_MAP = [
    ["0"],
    ["@", ".", "?"],
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"],
    ["J", "K", "L"],
    ["M", "N", "O"],
    ["P", "Q", "R", "S"],
    ["T", "U", "V"],
    ["W", "X", "Y", "Z"]
];

function Trie() {
    this.head = {
        "key": "",
        "children": {}
    }
}

Trie.prototype.add = function (key) {
    let curNode = this.head;
    let newNode = null;
    let curChar = key.slice(0, 1);

    key = key.slice(1);

    while (typeof curNode.children[curChar] !== "undefined" && curChar.length > 0) {
        curNode = curNode.children[curChar];
        curChar = key.slice(0, 1);
        key = key.slice(1);
    }
    while (curChar.length > 0) {
        newNode = {
            "key": curChar,
            "value": key.length === 0 ? null : undefined,
            "children": {}
        };
        curNode.children[curChar] = newNode;
        curNode = newNode;
        curChar = key.slice(0, 1);
        key = key.slice(1);
    }
};
Trie.prototype.search = function (key) {
    let curNode = this.head;
    let curChar = key.slice(0, 1);
    let d = 0;

    key = key.slice(1);

    while (typeof curNode.children[curChar] !== "undefined" && curChar.length > 0) {
        curNode = curNode.children[curChar];
        curChar = key.slice(0, 1);
        key = key.slice(1);
        d += 1;
    }
    if (curNode.value === null && key.length === 0) {
        return d;
    }
    else {
        return -1;
    }
};

function Error(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
}

function Response(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
}

let generateAllPossibleWords = function (code, currentDigit, outputString, allPossibleWords) {
    let i;
    if (currentDigit === code.length) {
        allPossibleWords.push(outputString.join(''));
        return;
    }
    for (i = 0; i < DIGIT_CHAR_MAP[code[currentDigit]].length; i++) {
        outputString[currentDigit] = DIGIT_CHAR_MAP[code[currentDigit]][i];
        generateAllPossibleWords(code, currentDigit + 1, outputString, allPossibleWords);
        if (code[currentDigit] == 0 || code[currentDigit] == 1)
            return;
    }
};
let createTrie = function (words) {
    let trieMap = new Trie();
    words.forEach((word) => {
        trieMap.add(word);
    });
    return trieMap;
};
let resolveSuperHero = function (trieMap, superheros, code, next) {
    if (typeof superheros === 'string') {
        try {
            superheros = JSON.parse(superheros)
        }
        catch (e) {
            throw e;
        }
    }
    let i, superhero;
    for (i = 0; i < superheros.length; i++) {
        if (superheros[i].length === code.length) {
            let search = trieMap.search(superheros[i]);
            if (search > -1) {
                superhero = superheros[i];
                break;
            }
        }
    }
    if (!superhero) {
        return next(new Error(404, "The given code does not match any super hero. Please type 0 <space> <code> and press send to call for a super hero"))
    }
    next(null, new Response(200, "Keep Calm! " + superhero + " is on the way!"));
};
let sendDistressSignal = function (req, res, next) {
    let code = req && req.query && req.query.code;
    if (!(code && code.length)) {
        return next(new Error(400, "You have sent an invalid code. Please type 0 <space> <code> and press send to call for a super hero"));
    }
    code = decodeURIComponent(code);
    let codeParts = code.split(' '); //Extracting the "0 " prefix of the code and checking for validation
    if (!(codeParts && codeParts.length && codeParts[0] && codeParts[0] === '0' &&
        codeParts[1] && codeParts[1].length)) {
        return next(new Error(400, "You have sent an invalid code. Please type 0 <space> <code> and press send to call for a super hero"));
    }
    code = codeParts[1]; //Extracting the second part of the code for resolving into super hero names
    code = code.split(""); //Splitting the code into an array of characters
    let allPossibleWords = [];
    generateAllPossibleWords(code, 0, [], allPossibleWords); //Generate all possible combination
    let trieMap = createTrie(allPossibleWords); //Generate a trie
    cache.get(CACHE_KEY, (error, data) => {
        if (error) throw error;
        if (data) {
            return resolveSuperHero(trieMap, data, code, next);
        }
        fs.readFile('resources/superheros.json', 'utf8', (error, data) => {
            if (error) throw error;
            cache.set(CACHE_KEY, data);
            resolveSuperHero(trieMap, data, code, next);
        });
    });
};
module.exports.sendDistressSignal = sendDistressSignal;