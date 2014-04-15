(function () {
    "use strict";

    var clamp,
        sqrt = Math.sqrt,
        random = Math.random,
        ceil = Math.ceil,
        floor = Math.floor,
        PI,
        QUATER_PI,
        HALF_PI,
        TWO_PI,
        TWO_HALF_PI,
        NPI,
        NQUATER_PI,
        NHALF_PI,
        NTWO_PI,
        NTWO_HALF_PI;

    PI = Math.PI;
    QUATER_PI = Math.QUATER_PI = 0.25 * Math.PI;
    HALF_PI = Math.HALF_PI = 0.5 * Math.PI;
    TWO_PI = Math.TWO_PI = 2 * Math.PI;
    TWO_HALF_PI = Math.TWO_HALF_PI = (2 * Math.PI) + Math.HALF_PI;
    NPI = Math.NPI = -Math.PI;
    NQUATER_PI = Math.NQUATER_PI = 0.25 * Math.NPI;
    NHALF_PI = Math.NHALF_PI = 0.5 * Math.NPI;
    NTWO_PI = Math.NTWO_PI = 2 * Math.NPI;
    NTWO_HALF_PI = Math.NTWO_HALF_PI = (2 * Math.NPI) + Math.HALF_PI;

    Math.INV_PI = 1 / Math.PI;

    Math.RAD_TO_DEG = 180 / Math.PI;
    Math.DEG_TO_RAD = Math.PI / 180;

    // this could be useful to tweak in your app, depends on your world resolution
    Math.EPS = 10e-3;


    Math.cross = function (x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    };

    Math.dot = function (x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    };

    /// Clamp @c f to be between @c min and @c max.
    Math.clamp = clamp = function (f, minv, maxv) {
        return f < minv ? minv : (f > maxv ? maxv : f);
    };

    /// Clamp @c f to be between 0 and 1.
    Math.clamp01 = function (f) {
        return f < 0 ? 0 : (f > 1 ? 1 : f);
    };

    /// Linearly interpolate (or extrapolate) between @c f1 and @c f2 by @c t percent.
    Math.lerp = function (f1, f2, t) {
        return f1 * (1 - t) + f2 * t;
    };

    /// Linearly interpolate from @c f1 to @c f2 by no more than @c d.
    Math.lerpconst = function (f1, f2, d) {
        return f1 + clamp(f2 - f1, -d, d);
    };

    Math.length = function (x, y) {
        return sqrt(x * x + y * y);
    };

    Math.lengthSq = function (x, y) {
        return x * x + y * y;
    };
    Math.sqrLength = Math.lengthSq;


    Math.randRange = function (max, min) {
        if (max === undefined) {
            return random();
        }
        min = min || 0;

        return random() * (max - min) + min;
    };

    Math.randInt = function (max, min) {
        min = min || 0;

        return floor(random() * (max - min + 1) + min);
    };


    Math.snap = function (value, snapSize) {
        return Math.floor(value / snapSize) * snapSize;
    };

    Math.snapRound = function (value, snapSize) {
        var steps = value / snapSize | 0,
            remain = value - (steps * snapSize),
            rounder = remain > (snapSize / 2) ? ceil : floor;

        return rounder(value / snapSize) * snapSize;
    };

    Math.normalizeRadians = function (angle) {
        if( angle > NPI && angle < PI) {
            return angle;
        }

        angle = angle % (TWO_PI);
        if( angle < NPI )
            angle += TWO_PI;
        else if( angle > PI )
            angle -= TWO_PI;
        return angle;

    };

    Math.deltaRotation = function (angle, target) {
      return normalizeRotation(angle - target);
    }

}());