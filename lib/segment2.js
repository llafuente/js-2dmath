var exp;
(exp = function () {
    "use strict";

    var EPS = Math.EPS,
        sqrt = Math.sqrt,
        __x,
        __y,
        Segment2;


    /**
     * @class Segment2
     */
    Segment2 = function (x1, y1, x2, y2) {
        return [x1, y1, x2, y2];
    };

    Segment2.clone = function (seg2) {
        return [seg2[0], seg2[1], seg2[2], seg2[3]];
    };

    Segment2.copy = function (out, seg2) {
        out[0] = seg2[0];
        out[1] = seg2[1];
        out[2] = seg2[2];
        out[3] = seg2[3];

        return out;
    };

    Segment2.translate = function (out, seg2, v1) {
        out[0] = seg2[0] + v1[0];
        out[1] = seg2[1] + v1[1];
        out[2] = seg2[2] + v1[0];
        out[3] = seg2[3] + v1[1];

        return out;
    };

    Segment2.length = function (seg2) {
        __x = seg2[2] - seg2[0];
        __y = seg2[3] - seg2[1];

        return sqrt(__x * __x + __y * __y);
    };

    Segment2.sqrLength = function (seg2) {
        __x = seg2[2] - seg2[0];
        __y = seg2[3] - seg2[1];

        return __x * __x + __y * __y;
    };

    Segment2.lengthSq = Segment2.sqrLength;

    Segment2.cross = function (seg2, v1) {
        return (seg2[0] - v1[0]) * (seg2[3] - v1[1]) - (seg2[1] - v1[1]) * (seg2[2] - v1[0]);
    };

    return Segment2;

}());


if ("undefined" === typeof module) {
    window.Segment2 = exp;
} else {
    module.exports = exp;
}