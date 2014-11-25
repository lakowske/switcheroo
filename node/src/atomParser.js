var util = require('util');
var Transform = require('stream').Transform;

COMPOSITE = COMPOSITE || {};

COMPOSITE.AtomParser = function(options) {
    if (!(this instanceof AtomParser))
        return new AtomParser(options);

    Transform.call(this, options);
    this._inBody = false;
    this._sawOpenParen = false;
    this._sawCloseParen = false;
    this._rawAtom = [];
}
util.inherits(COMPOSITE.AtomParser, Transform);

COMPOSITE.AtomParser.prototype._transform = function(chunk, encoding, done) {

    if (!this._inBody) {

        var start = -1;
        var end = -1;

        for (var i = 0 ; i < chunk.length ; i++) {
            if(chunk[i] === '(') {
                if (this._sawOpenParen) {
                    throw "nested open paren";
                } else {
                    this._sawOpenParen = true;
                    this._inBody = true;
                    start = i;
                }
            }

            if(chunk[i] === ')') {
                if (this._sawOpenParen) {
                    end = i;
                } else {
                    throw "missing open paren"
                }
            }

            if (this._sawOpenParen && !this._sawCloseParen) {
                this._rawAtom.push(chunk.slice(start));
            }

            if (start >= 0 && end >= 0) {
                var atom = chunk.slice(start, end);
                this.emit('atom', atom);
                this.push(chunk.slice(end));
            }

        }
    }
}
