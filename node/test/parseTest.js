/*
 * (C) 2014 SoftwareCo-oP
 */

require('./UnitTest');
require('../src/node/parse');

var chai = require('chai');
var sinon = require('sinon');

(function(chai, sinon) {

    var assert = chai.assert;

    var buildStack = function() {
        var a = new Buffer(3);
        var b = new Buffer(3);
        var c = new Buffer(3);

        a.write('hi1');
        b.write('hi2');
        c.write('hi3');

        var stack = [a,  b,  c]
        return stack;
    }

    describe('Parser', function() {

        it('advances', function(done) {
            var stack = buildStack();
            var coordinates = {row:1, col:2};
            assert.equal(stack.length, 3);
            var stack = COMPOSITE.advance(stack, coordinates);

            assert.equal(stack.length, 2);
            assert.equal(coordinates.row, 0);

            assert.equal(0.0, 0.0);
            done();
        })

        it('hasNext', function(done) {
            var stack = buildStack();

            var coordinates = {row:0, col:0};
            assert.isTrue(COMPOSITE.hasNext(stack, coordinates));

            var coordinates = {row:2, col:2};
            assert.isTrue(COMPOSITE.hasNext(stack, coordinates));

            var coordinates = {row:2, col:3};
            assert.isFalse(COMPOSITE.hasNext(stack, coordinates));

            done();
        })

        it('next', function(done) {
            var stack = buildStack();

            var coordinates = {row:0, col:0};
            COMPOSITE.hasNext(stack, coordinates);

            while(COMPOSITE.hasNext(stack, coordinates)) {

                var val = COMPOSITE.next(stack, coordinates);
                console.log(val);

            }

            done();
        })

    })

})(chai, sinon)
