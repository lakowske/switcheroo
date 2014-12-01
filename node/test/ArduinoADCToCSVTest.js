/*
 * (C) 2014 SoftwareCo-oP
 */

var test = require('tape');
var ArduinoADCToCSV = require('../src/ArduinoADCToCSV');
var WriteTest = require('stream-write-test');

test('show ArduinoADCToCSV behaves as expected', function(t) {
    var expectedChunks = ['x,y\n', '0,1\n', '1,2\n', '2,3\n'];
    var tests = expectedChunks.length;
    t.plan(tests)

    var arduinoADC = new ArduinoADCToCSV();
    var writeTest = new WriteTest({testChunks:expectedChunks, test:t});

    arduinoADC.pipe(writeTest);

    var adcChunk = {
        format:['x', 'y'],
        data:  [0,1,
                1,2,
                2,3]
    }

    var json = JSON.stringify(adcChunk);
    arduinoADC.write(json)
    arduinoADC.end();
})
