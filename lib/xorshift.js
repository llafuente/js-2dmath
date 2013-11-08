var exp;
(exp = function () {
    "use strict";

    // from: http://jsdo.it/akm2/fhMC/js
    // don't know the author, if you are contact me.
    // I just lint the code... and adapt it to the lib philosophy

    // Helper

    function mash(data) {
        data = data.toString();
        var n = 0xefc8249d,
            i,
            len,
            h;

        for (i = 0, len = data.length; i < len; i++) {
            n += data.charCodeAt(i);
            h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000;
        }
        return (n >>> 0) * 2.3283064365386963e-10;
    }

    var Xorshift = {};

    /**
     * Random numbers generator
     *
     * @see http://baagoe.com/en/RandomMusings/javascript/
     * @see http://en.wikipedia.org/wiki/Xorshift
     */
    Xorshift.create = function () {
        var self = this,
            seeds = (arguments.length) ? Array.prototype.slice.call(arguments) : [new Date().getTime()],

            x = 123456789,
            y = 362436069,
            z = 521288629,
            w = 88675123,
            v = 886756453,
            i,
            len,
            seed,
            t;

        for (i = 0, len = seeds.length; i < len; i++) {
            seed = seeds[i];
            x ^= mash(seed) * 0x100000000;
            y ^= mash(seed) * 0x100000000;
            z ^= mash(seed) * 0x100000000;
            v ^= mash(seed) * 0x100000000;
            w ^= mash(seed) * 0x100000000;
        }

        return {
            uint32: function () {
                t = (x ^ (x >>> 7)) >>> 0;
                x = y;
                y = z;
                z = w;
                w = v;
                v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
                return ((y + y + 1) * v) >>> 0;
            },

            random: function () {
                return self.uint32() * 2.3283064365386963e-10;
            },

            fract53: function () {
                return self.random() + (self.uint32() & 0x1fffff) * 1.1102230246251565e-16;
            }
        };
    };

    return Xorshift;

}());


if ("undefined" === typeof module) {
    window.Xorshift = exp;
} else {
    module.exports = exp;
}