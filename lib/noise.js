var exp;
(exp = function () {
    "use strict";

    var browser = "undefined" === typeof module,
        object = require("object-enhancements"),
        Xorshift = browser ? window.Xorshift : require("./xorshift.js"),
        GRAD3 = [
            [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
        ],

        GRAD4 = [
            [0, 1, 1, 1],  [0, 1, 1, -1],  [0, 1, -1, 1],  [0, 1, -1, -1],
            [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1],
            [1, 0, 1, 1],  [1, 0, 1, -1],  [1, 0, -1, 1],  [1, 0, -1, -1],
            [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1],
            [1, 1, 0, 1],  [1, 1, 0, -1],  [1, -1, 0, 1],  [1, -1, 0, -1],
            [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1],
            [1, 1, 1, 0],  [1, 1, -1, 0],  [1, -1, 1, 0],  [1, -1, -1, 0],
            [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]
        ],

        SIMPLEX = [
            [0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0],
            [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0],
            [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
            [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0],
            [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0],
            [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
            [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0],
            [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]
        ],
        sqrt = Math.sqrt,
        floor = Math.floor,
        random = Math.random,
        sqrt_of_3 = sqrt(3),

        Noise = {};

    // from: http://jsdo.it/akm2/fhMC/js
    // don't know the author, if you are contact me.
    // I just lint the code (a little)... and adapt it to the lib philosophy (that means remove 3d noises)
    // TODO optimize, there is performance gain everywhere!


    // Common helpers

    function dot2d(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    function dot3d(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }

    // Simplex helper

    function dot4d(g, x, y, z, w) {
        return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
    }

    // Classic helpers

    function mix(a, b, t) {
        return (1 - t) * a + t * b;
    }

    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }



    /**
     * @see http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
     *
     * Tiling Example (heavy...)
     *
     * var perlinNoise = new PerlinNoise();
     *
     * function tilingNoise2d(x, y, w, h) {
     *     return (perlinNoise.noise(x, y) * (w - x) * (h - y) +
     *         perlinNoise.noise(x - w, y) * x * (h - y) +
     *         perlinNoise.noise(x - w, y - h) * x * y +
     *         perlinNoise.noise(x, y - h) * (w - x) * y) / (w * h);
     */


    /**
     * ClassicNoise
     */
    function ClassicNoise(seed) {
        this.seed(seed);
    }

    ClassicNoise.prototype = {
        _octaves: 4,
        _fallout: 0.5,

        seed: function (seed) {
            var random = Xorshift.create(seed || new Date().getTime()).random,
                i,
                p = [],
                perm = [];

            for (i = 0; i < 256; i++) {
                p[i] = floor(random() * 256);
            }

            for (i = 0; i < 512; i++) {
                perm[i] = p[i & 255];
            }

            this._perm = perm;
        },

        octaves: function (octaves) {
            if (!arguments.length) {
                return this._octaves;
            }
            return this._octaves = octaves;
        },

        fallout: function (fallout) {
            if (!arguments.length) {
                return this._fallout;
            }
            return this._fallout = fallout;
        },

        noise: function (x, y) {
            var result = 0,
                noise,
                f = 1,
                oct = this._octaves,
                amp = 0.5,
                fallout = this._fallout,
                i;

            for (i = 0; i < oct; ++i) {
                result += (1 + this.noise2d(x * f, y * f)) * amp * 0.5;
                amp *= fallout;
                f *= 2;
            }

            return result;
        },

        noise2d: function (x, y) {
            var X = floor(x),
                Y = floor(y),
                perm = this._perm;

            x = x - X;
            y = y - Y;

            X = X & 255;
            Y = Y & 255;


            var gi00 = perm[X + perm[Y]] % 12,
                gi01 = perm[X + perm[Y + 1]] % 12,
                gi10 = perm[X + 1 + perm[Y]] % 12,
                gi11 = perm[X + 1 + perm[Y + 1]] % 12,

                n00 = dot2d(GRAD3[gi00], x, y),
                n10 = dot2d(GRAD3[gi10], x - 1, y),
                n01 = dot2d(GRAD3[gi01], x, y - 1),
                n11 = dot2d(GRAD3[gi11], x - 1, y - 1),

                u = fade(x),
                v = fade(y),

                nx0 = mix(n00, n10, u),
                nx1 = mix(n01, n11, u),

                nxy = mix(nx0, nx1, v);

            return nxy;
        }
    };


    /**
     * SimplexNoise
     *
     * @super ClassicNoise
     */
    function SimplexNoise(seed) {
        this.seed(seed);
    }

    SimplexNoise.prototype = object.extend({}, ClassicNoise.prototype, {
        noise: function (x, y, z, w) {
            var result = 0,
                noise,
                f = 1,
                oct = this._octaves,
                amp = 0.5,
                fallout = this._fallout,
                i;

            for (i = 0; i < oct; ++i) {
                result += (1 + this.noise2d(x * f, y * f)) * amp * 0.5;
                amp *= fallout;
                f *= 2;
            }

            return result;
        },

        noise2d: function (x, y) {
            var n0,
                n1,
                n2,

                F2 = 0.5 * (sqrt_of_3 - 1),
                s = (x + y) * F2,
                i = floor(x + s),
                j = floor(y + s),

                G2 = (3 - sqrt_of_3) / 6,
                t = (i + j) * G2,
                X0 = i - t,
                Y0 = j - t,
                x0 = x - X0,
                y0 = y - Y0,

                i1,
                j1,

                perm = this._perm;

            if (x0 > y0) {
                i1 = 1;
                j1 = 0;
            } else {
                i1 = 0;
                j1 = 1;
            }

            var x1 = x0 - i1 + G2,
                y1 = y0 - j1 + G2,

                x2 = x0 - 1 + 2 * G2,
                y2 = y0 - 1 + 2 * G2,

                ii = i & 255,
                jj = j & 255,

                gi0 = perm[ii + perm[jj]] % 12,
                gi1 = perm[ii + i1 + perm[jj + j1]] % 12,
                gi2 = perm[ii + 1 + perm[jj + 1]] % 12,

                t0 = 0.5 - x0 * x0 - y0 * y0;

            if (t0 < 0) {
                n0 = 0;
            } else {
                t0 *= t0;
                n0 = t0 * t0 * dot2d(GRAD3[gi0], x0, y0);
            }

            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) {
                n1 = 0;
            } else {
                t1 *= t1;
                n1 = t1 * t1 * dot2d(GRAD3[gi1], x1, y1);
            }

            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) {
                n2 = 0;
            } else {
                t2 *= t2;
                n2 = t2 * t2 * dot2d(GRAD3[gi2], x2, y2);
            }

            return 70 * (n0 + n1 + n2);
        }
    });

    Noise.GRAD3 = GRAD3;
    Noise.GRAD4 = GRAD4;
    Noise.SIMPLEX = SIMPLEX;

    Noise.createClassic = function (seed) {
        return new ClassicNoise(seed);
    };

    Noise.createSimpleX = function (seed) {
        return new SimplexNoise(seed);
    };


    return Noise;

}());


if ("undefined" === typeof module) {
    window.Noise = exp;
} else {
    module.exports = exp;
}