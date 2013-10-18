(function () {
    "use strict";

    var clamp;

    Math.QUATER_PI = 0.25 * Math.PI;
    Math.HALF_PI = 0.5 * Math.PI;
    Math.TWO_PI = 2 * Math.PI;
    Math.TWO_HALF_PI = (2 * Math.PI) + Math.HALF_PI;
    Math.EPS = 10e-3;
    Math.INV_PI = 1 / Math.PI;
    Math.RAD_TO_DEG = 180 / Math.PI;
    Math.DEG_TO_RAD = Math.PI / 180;

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

}());