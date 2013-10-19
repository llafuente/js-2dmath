var exp;
(exp = function () {
    "use strict";


    var browser = "undefined" === typeof module,
        Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
        min = Math.min,
        max = Math.max,
        BB2,
        aux_vec2_1 = [0, 0],
        aux_vec2_2 = [0, 0],
        a = 0,
        b = 0,
        r = 0,
        x = 0,
        y = 0;

    /**
     * @class BB2
     */
    BB2 = {};

    BB2.create = function (l, b, r, t) {
        var out = [l, b, r, t, false];
        BB2.normalize(out, out);
        return out;
    };

    BB2.fromCircle = function (circle) {
        r = circle[1];
        x = circle[0][0];
        y = circle[0][1];
        return BB2.create(
            x - r,
            y - r,
            x + r,
            y + r
        );
    };

    BB2.zero = function () {
        return [0, 0, 0, 0, true];
    };

    BB2.clone = function (bb) {
        return [bb[0], bb[1], bb[2], bb[3], bb[4]];
    };

    BB2.copy = function (out, bb) {
        out[0] = bb[0];
        out[1] = bb[1];
        out[2] = bb[2];
        out[3] = bb[3];
        out[4] = bb[4];

        return out;
    };

    BB2.merge = function (out, bb1, bb2) {
        out[0] = min(bb1[0], bb2[0]);
        Vec2.min(out[1], bb1[1], bb2[1]);

        Vec2.max(out[2], bb1[2], bb2[2]);
        Vec2.max(out[3], bb1[3], bb2[3]);

        return out;
    };

    BB2.area = function (bb) {
        return (bb.r - bb.l) * (bb.t - bb.b);
    };

    // TODO
    BB2.normalize = function (out, rec1, force) {

    };

    BB2.translate = function (out, rec1, vec2) {
        x = vec2[0];
        y = vec2[1];

        out[0] = rec1[0] + x;
        out[1] = rec1[1] + y;
        out[2] = rec1[2] + x;
        out[3] = rec1[3] + y;

        return out;
    };

    BB2.clampVec = function(out, bb, vec2) {
        out[0] = min(max(bb.l, vec2[0]), bb.r);
        out[1] = min(max(bb.b, vec2[1]), bb.t);

        return out;
    };



    return BB2;

}());


if ("undefined" === typeof module) {
    window.BB2 = exp;
} else {
    module.exports = exp;
}