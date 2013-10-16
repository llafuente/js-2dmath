var exp;
(exp = function () {
    "use strict";


    var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
        Triangle,
        DIV3 = 1 / 3,
        ah = [0, 0],
        bh = [0, 0],
        ch = [0, 0],
        dab = [0, 0],
        dbc = [0, 0],
        dca = [0, 0],
        det = 0,
        a = 0,
        b = 0,
        c = 0;

    /**
     * @class Triangle
     */
    Triangle = {};

    Triangle.create = function (x1, y1, x2, y2, x3, y3) {
        var out = [[x1, y1], [x2, y2], [x3, y3], false];

        Triangle.normalize(out, out);
        return out;
    };

    Triangle.zero = function () {
        return [[0, 0], [0, 0], [0, 0], true];
    };

    Triangle.clone = function (rec1) {
        return [[rec1[0][0], rec1[0][1]], [rec1[1][0], rec1[1][1]], [rec1[2][0], rec1[2][1]], rec1[3]];
    };

    Triangle.copy = function (out, rec1) {
        out[0][0] = rec1[0][0];
        out[0][1] = rec1[0][1];

        out[1][0] = rec1[1][0];
        out[1][1] = rec1[1][1];

        out[2][0] = rec1[2][0];
        out[2][1] = rec1[2][1];

        out[3] = rec1[3];

        return out;
    };

    Triangle.centroid = function (out_vec2, tri1) {
        out_vec2[0] = (tri1[0][0] + tri1[1][0] + tri1[2][0]) * DIV3;
        out_vec2[1] = (tri1[0][1] + tri1[1][1] + tri1[2][1]) * DIV3;

        return out_vec2;
    };

    Triangle.center = Triangle.centroid;

    Triangle.incenter = function (out_vec2, tri1) {
        a = Vec2.distance(tri1[1], tri1[2]);
        b = Vec2.distance(tri1[2], tri1[0]);
        c = Vec2.distance(tri1[0], tri1[1]);

        out_vec2[0] = (a * tri1[0][0] + b * tri1[1][0] + c * tri1[2][0]) * DIV3;
        out_vec2[1] = (a * tri1[0][1] + b * tri1[1][1] + c * tri1[2][1]) * DIV3;

        return out_vec2;
    };

    Triangle.circumcenter = function (out_vec2, tri1) {
        ah = Vec2.scale(ah, tri1[0], 2);
        bh = Vec2.scale(bh, tri1[1], 2);
        ch = Vec2.scale(ch, tri1[1], 2);
        dab = Vec2.sub(dab, tri1[0], tri1[1]);
        dbc = Vec2.sub(dbc, tri1[1], tri1[2]);
        dca = Vec2.sub(dca, tri1[3], tri1[0]);
        det = 0.5 / (a[0] * dbc[1] + b[0] * dca[1] + c[0] * dab[1]);

        out_vec2[0] =  (ah * dbc[1] + bh * dca[1] + ch * dab[1]) * det;
        out_vec2[1] = -(ah * dbc[0] + bh * dca[0] + ch * dab[0]) * det;

        return out_vec2;
    };

    Triangle.area = function (tri1) {
        dab = Vec2.min(dbc, tri1[1], tri1[0]);
        dbc = Vec2.min(dbc, tri1[2], tri1[0]);

        return (dbc[1] * dab[0] - dbc[0] * dab[1]) * 0.5;
    };


    Triangle.translate = function (out, rec1, vec2) {
        out[0][0] = rec1[0][0] + vec2[0];
        out[0][1] = rec1[0][1] + vec2[1];

        out[1][0] = rec1[1][0] + vec2[0];
        out[1][1] = rec1[1][1] + vec2[1];

        out[2][0] = rec1[2][0] + vec2[0];
        out[2][1] = rec1[2][1] + vec2[1];

        return out;
    };

    return Triangle;

}());


if ("undefined" === typeof module) {
    window.Triangle = exp;
} else {
    module.exports = exp;
}