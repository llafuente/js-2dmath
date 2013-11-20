var exp;
(exp = function () {
    "use strict";


    var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
        Rectangle,
        max = Math.max,
        min = Math.min,
        aux_vec2_1 = [0, 0],
        aux_vec2_2 = [0, 0],
        a = 0,
        b = 0;

    /**
     * @class Rectangle
     */
    Rectangle = {};

    Rectangle.create = function (x1, y1, x2, y2) {
        var out = [[x1, y1], [x2, y2], false];
        Rectangle.normalize(out, out);
        return out;
    };

    Rectangle.fromBB = function (bb) {
        return Rectangle.create(bb[0], bb[1], bb[2], bb[3]);
    };

    Rectangle.zero = function () {
        return [[0, 0], [0, 0], true];
    };

    Rectangle.clone = function (rec1) {
        return [[rec1[0][0], rec1[0][1]], [rec1[1][0], rec1[1][1]], rec1[2]];
    };

    Rectangle.copy = function (out, rec1) {
        out[0][0] = rec1[0][0];
        out[0][1] = rec1[0][1];

        out[1][0] = rec1[1][0];
        out[1][1] = rec1[1][1];

        out[2] = rec1[2];

        return out;
    };

    /**
     * a, b, normlize
     * a -> bottom-left
     * a -> top-right
     */
    Rectangle.normalize = function (out, rec1, force) {
        force = force || rec1[2] === false || false;

        if (!force) {
            Rectangle.copy(out, rec1);
            return out;
        }

        a = min(rec1[0][0], rec1[1][0]);
        b = max(rec1[0][0], rec1[1][0]);

        out[0][0] = a;
        out[1][0] = b;

        a = min(rec1[0][1], rec1[1][1]);
        b = max(rec1[0][1], rec1[1][1]);

        out[0][1] = a;
        out[1][1] = b;

        out[2] = true;

        return out;
    };

    Rectangle.center = function (out_vec2, rec1) {
        out_vec2[0] = (rec1[0][0] + rec1[1][0]) * 0.5;
        out_vec2[1] = (rec1[0][1] + rec1[1][1]) * 0.5;

        return out_vec2;
    };

    Rectangle.translate = function (out, rec1, vec2) {
        out[0][0] = rec1[0][0] + vec2[0];
        out[0][1] = rec1[0][1] + vec2[1];

        out[1][0] = rec1[1][0] + vec2[0];
        out[1][1] = rec1[1][1] + vec2[1];

        return out;
    };

    Rectangle.distance = function (rect1, rect2) {
        Rectangle.center(aux_vec2_1, rect1);
        Rectangle.center(aux_vec2_2, rect2);

        return Vec2.distance(aux_vec2_2, aux_vec2_1);
    };

    Rectangle.area = function (rect1) {
        a = rect1[0][0] - rect1[1][0];
        b = rect1[0][1] - rect1[1][1];
        a *= b;

        return a < 0 ? -a : a; //needed id normalized ?
    };

    return Rectangle;

}());


if ("undefined" === typeof module) {
    window.Rectangle = exp;
} else {
    module.exports = exp;
}