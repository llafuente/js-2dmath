var exp;
(exp = function () {
    "use strict";

    var browser = "undefined" === typeof module,
        Vec2 = browser ? window.Vec2 : require("./vec2.js"),
        within = Vec2.$.within,
        EPS = Math.EPS,
        sqrt = Math.sqrt,
        clamp01 = Math.clamp01,
        __x,
        __y,
        aux_vec2 = [0, 0],
        aux_vec2b = [0, 0],
        t = 0,
        Segment2,

        //cache
        $collinear;


    /**
     * @class Segment2
     */
    Segment2 = {};

    Segment2.create = function (x1, y1, x2, y2) {
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

    Segment2.collinear = function(seg2, vec2) {
        return (seg2[2] - seg2[0]) * (vec2[1] - seg2[1]) === (vec2[0] - seg2[0]) * (seg2[3] - seg2[1]);
    };

    Segment2.$ = {};
    $collinear = Segment2.$.collinear = function (x1, y1, x2, y2, x3, y3) {
        return (x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1);
    }
    Segment2.$.inside = function(x1, x2, y1, y2, x3, y3) {
        console.log(arguments, $collinear(x1, x2, y1, y2, x3, y3), within(x1, x2, x3, y3, y1, y2));

        return $collinear(x1, x2, y1, y2, x3, y3) && within(x1, x2, x3, y3, y1, y2);
    }
    Segment2.inside = function(seg2, vec2) {
        return Segment2.collinear(seg2, vec2) && Vec2.within([seg2[0], seg2[1]], vec2, [seg2[2], seg2[3]])
    };

    Segment2.closestPoint = function (out, seg2, v1) {
        // cache
        __x = seg2[2];
        __y = seg2[3];
        // a-b
        out[0] = seg2[0] - __x;
        out[1] = seg2[1] - __y;
        //b Vec2
        aux_vec2b[0] = __x;
        aux_vec2b[1] = __y;
        // v1 - b
        Vec2.sub(aux_vec2, v1, aux_vec2b);
        // t = clamp01( (a-b) . (b) / lengthSq(a-b) )
        t = clamp01(Vec2.dot(out, aux_vec2) / Vec2.lengthSq(aux_vec2));
        // add(b, scale (a-b, t))
        Vec2.scale(out, t);
        return Vec2.add(out, out, aux_vec2b);
    };

    return Segment2;

}());


if ("undefined" === typeof module) {
    window.Segment2 = exp;
} else {
    module.exports = exp;
}