/*
 * (C) 2014 SoftwareCo-oP
 */

(function(COMPOSITE) {

    /*
     * Advances the buffer stack by removing buffers prior to coordinates
     *
     * @param {array} buffers contains buffers in order in which they are received.
     * @param {number} coordinates.row is the current buffer.
     * @param {number} coordinates.col is the current position in the buffer.
     * @return the new buffer stack with coordinates modified.
     */
    COMPOSITE.advance = function(buffers, coordinates) {
        buffers = buffers.slice(coordinates.row, coordinates.length);
        coordinates.row = 0;
        return buffers;
    }

    COMPOSITE.NoSuchElementException = function(message) {
        this.name = "NoSuchElementException";
        this.message = message;
    }

    COMPOSITE.hasNext = function(buffers, coordinates) {
        if (coordinates.row >= buffers.length) {
            return false;
        }

        if ((coordinates.col >= buffers[coordinates.row].length) && (coordinates.row >= buffers.length-1) ) {
            return false;
        }

        return true;
    }

    COMPOSITE.next = function(buffers, coordinates) {
        if (!COMPOSITE.hasNext(buffers, coordinates)) {
            throw new NoSuchElementException();
        }

        var val = buffers[coordinates.row][coordinates.col];

        coordinates.col += 1;

        if (coordinates.col >= buffers[coordinates.row].length) {
            coordinates.row += 1;
            coordinates.col = 0;
        }

        return val;
    }


})(COMPOSITE)
