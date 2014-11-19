var express = require('express');
var events = require('events');
var SerialPort = require("serialport").SerialPort;

var app = express();

var bus = new events.EventEmitter();

var serialPort = new SerialPort('/dev/ttyUSB0', {
    baudrate: 115200
})

var lines = [];
var stack = [];
var sentence = '';

serialPort.on('open', function() {
    console.log('open serial port');

    serialPort.on('data', function(data) {
        if (data.length === 0) {
            return;
        }

        console.log('received ' + data);
        //index to start or continue parsing at.
        var position = sentence.length;

        sentence = sentence + data;
        console.log(sentence);
        for (var i = position ; i < sentence.length ; i++) {
            if (data.charAt(i) === '(') {
               stack.push(i);
            }

            if (data.charAt(i) === ')') {
                var start = stack.pop();
                var end = i;
            }
        }

        lines.push(data);
        console.log('received ' + data);
    });
});

app.get('/', function(req, res) {
    //reset parser
    //listen for sentence
    //reply to requestor
    serialPort.write('s200\n', function(error, results) {
        if (error !== undefined) {
            console.log('error ' + error);
        } else {
            setTimeout(function() {
                var response = '';
                for (var i = 0 ; i < lines.length ; i++) {
                    response = response + lines[i] + '\n';
                }

                res.send(response);
                lines = [];
            }, 1000);
        }
    });
})

app.get('/on/:pin', function(req, res) {
    var pin = req.params.pin;

    var command = 'o' + pin + '\n';
    console.log('sending ' + command);
    serialPort.write(command, function(error, results) {
        if (error !== undefined) {
            console.log('error ' + error);
        } else {
            setTimeout(function() {
                var response = '';
                for (var i = 0 ; i < lines.length ; i++) {
                    response = response + lines[i] + '\n';
                }

                res.send(response);
                lines = [];
            }, 1000);
        }
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('ampster listening at http://%s:%s', host, port);
})
