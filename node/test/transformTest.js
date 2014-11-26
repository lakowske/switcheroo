require('./UnitTest');
var Transform = require('stream').Transform;
var util = require('util');
var chai = require('chai');

var testChunks = ['hi', 'there'];
var pos = 0;

function PassThrough(options) {
    if (!(this instanceof PassThrough)) {
        return  new PassThrough(options);
    }

    //init PassThrough
    Transform.call(this, options);
}
util.inherits(PassThrough, Transform);

PassThrough.prototype._transform = function(chunk, encoding, done) {
    this.push(chunk, encoding);
    done();
}

function ReadTest(options) {
    if (!(this instanceof ReadTest)) {
        return new ReadTest(options);
    }

    Transform.call(this, options);
}
util.inherits(ReadTest, Transform);

ReadTest.prototype._read = function(chunk) {
    chai.assertStrictEqual(chunk, testChunks[pos], 'chunks did not match');
    pos += 1;
}

describe('Transform', function() {

    it('simple pass through', function(done) {
        var passThrough = new PassThrough();
        var readTest = new ReadTest();
        passThrough.pipe(readTest);
        passThrough.write(testChunks[0]);
        passThrough.write(testChunks[1]);
        passThrough.end();


    })

})
