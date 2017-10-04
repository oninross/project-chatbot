var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    ssl = require('express-ssl'),
    router = express.Router(),
    ssl = require('express-ssl'),
    apiai = require('apiai'),
    apiAI = apiai('2fbd7449c74748c49a3c94c42427de39'),
    uuidv1 = require('uuid/v1'),
    UUID = '';

app.use(ssl());

app.use(function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.use(router);
app.use(express.static(__dirname + '/client'));

router.get('/', function (req, res) {
    UUID = uuidv1();
    res.sendFile(__dirname + '/client/index.html');
});

app.post('/sendRequest', function (req, res) {
    var request = apiAI.textRequest(req.body.query, {
        sessionId: UUID
    });

    request.on('response', function(res) {
        console.log(res);
    });

    request.on('error', function(err) {
        console.log(err);
    });

    request.end();
});




http.listen(process.env.PORT || 8888, function () {
    console.log('listening on *:8888');
});

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"