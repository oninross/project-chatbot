var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    router = express.Router(),
    apiai = require('apiai'),
    apiAI = apiai('2fbd7449c74748c49a3c94c42427de39'),
    uuidv1 = require('uuid/v1'),
    TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1'),
    text_to_speech = new TextToSpeechV1({
        username: 'a03cdd30-d6b9-44e3-9669-7be1002d367c',
        password: 'M5GxwdtBvKpK'
    }),
    fs = require('fs'),
    params = {
        voice: 'en-US_MichaelVoice',
        accept: 'audio/wav'
    },
    UUID = '',
    givenName = '';

app.use(router);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', '1000');
    res.setHeader('Content-Range', 'bytes 0-999/123456');

    next();
});

router.get('/', function (req, res) {
    UUID = uuidv1();
    console.log(UUID)
    res.sendFile(__dirname + '/client/index.html');

    req.connection.addListener('close', function () {
        fs.stat(__dirname + '/client/assets/chatbot/media/' + UUID + '.wav', function (err, stats) {
            // console.log(stats);//here we got all information of file in stats variable

            if (err) {
                return console.error(err);
            }

            fs.unlink(__dirname + '/client/assets/chatbot/media/' + UUID + '.wav', function (err) {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        });
    });
});

app.post('/sendRequest', function (req, res) {
    var response = res,
        request = apiAI.textRequest(req.body.message, {
            sessionId: UUID
        }),
        msg = '';

    request.on('response', function (res) {
        console.log("\x1b[32m", 'RESPONSE');

        let wa = fs.createWriteStream(__dirname + '/client/assets/chatbot/media/' + UUID + '.wav');

        msg = res.result.fulfillment.messages[0].speech;

        params.text = msg;

        // Pipe the synthesized text to a file.
        text_to_speech.synthesize(params).on('error', function (error) {
            console.log("\x1b[31m", 'ERROR: ' + error);
        }).pipe(wa);

        wa.on('finish', function () {
            response.json({
                UUID: UUID,
                message: msg
            });
        });
    });

    request.on('error', function (err) {
        console.log("\x1b[31m", 'ERROR');
        console.log("\x1b[37m", JSON.stringify(err));
    });

    request.end();
});

app.post('/sendToSpeak', function (req, res) {
    var response = res,
        msg = req.body.message,
        wa = fs.createWriteStream(__dirname + '/client/assets/chatbot/media/' + UUID + '.wav');

    params.text = msg;

    // Pipe the synthesized text to a file.
    text_to_speech.synthesize(params).on('error', function (error) {
        console.log("\x1b[31m", 'ERROR: ' + error);
    }).pipe(wa);

    wa.on('finish', function () {
        response.json({
            UUID: UUID,
            message: msg
        });
    });
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