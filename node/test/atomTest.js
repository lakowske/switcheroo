/*
 * (C) 2014 SoftwareCo-oP
 */

require('./UnitTest');
require('../src/atomParser');
var chai = require('chai');

(function(chai) {
    var assert = chai.assert;

    var Readable = require('stream').Readable;

    var buildStack = function() {
        var a = new Buffer(3);
        var b = new Buffer(3);
        var c = new Buffer(3);

        a.write('(');
        b.write('hi2');
        c.write(')');

        var stack = [a,  b,  c]
        return stack;
    }

    var buildTestSteam = function() {
        var rs = new Readable;
        rs.push('(');
        rs.push('hi');
        rs.push(')');
        return rs;
    }

    describe('AtomParser', function() {

        it('can receive data', function(done) {

            var atomParser = new COMPOSITE.AtomParser();

            var testInputStream = buildTestSteam();

            testInputStream.pipe(atomParser);

            done();

        })

    })

})(chai)
