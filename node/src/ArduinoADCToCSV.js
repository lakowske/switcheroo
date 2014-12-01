/*
 * (C) 2014 SoftwareCo-oP
 */

var Transform = require('stream').Transform
var util = require('util');

/*
 * @param options.writeHeader is true if the header should be written before the next chunk.  Defaults
 * to true, which puts the header at the top of the stream.
 */
function ArduinoADCToCSV(options) {
    this.writeHeader = true;

    if (options)
        this.writeHeader = options.writeHeader || true;

    Transform.call(this, options);
}
util.inherits(ArduinoADCToCSV, Transform);

/*
 * Takes JSON aligned chunks that describe csv, converts to JSON, and transforms chunks to csv
 * data.
 *
 * adc chunks should have the following form:
 *
 * @param format - contains the packing format and names
 * @param data - contains sequence formatted blocks of data described by format.  Users may have
 * n columns worth of data.
 */
ArduinoADCToCSV.prototype._transform = function(chunk, encoding, callback) {
    var arduinoADC = JSON.parse(chunk);
    var format = arduinoADC.format;
    var data = arduinoADC.data;
    var components = arduinoADC.format;

    if (this.writeHeader) {
        var header = '';
        for (var i = 0 ; i < components.length ; i++) {
            header += components[i];
            if (i < components.length - 1) {
                header += ','
            }
        }

        this.push(header, 'utf8');
        this.writeHeader = false;
        callback();
    } else {
        callback();
    }
}

module.exports = ArduinoADCToCSV;
