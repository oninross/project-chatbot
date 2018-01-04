const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    router = express.Router(),
    apiai = require('apiai'),
    apiAI = apiai('2fbd7449c74748c49a3c94c42427de39'),
    uuidv1 = require('uuid/v1');

let UUID = '',
    givenName = '';

app.use(router);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

router.get('/', function (req, res) {
    UUID = uuidv1();
    res.sendFile(__dirname + '/client/index.html');
});

app.post('/sendRequest', function (req, res) {
    let response = res,
        request = apiAI.textRequest(req.body.message, {
            sessionId: UUID
        });

    request.on('response', function (res) {
        console.log("\x1b[32m", 'RESPONSE');

        response.json({ message: res.result.fulfillment.messages[0].speech });
    });

    request.on('error', function (err) {
        console.log("\x1b[31m", 'ERROR');
        // console.log("\x1b[37m", JSON.stringify(err));
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
