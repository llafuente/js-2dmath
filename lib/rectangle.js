var exp;
(exp = function () {
    "use strict";


    var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
        Rectangle;

    /**
     * @class Rectangle
     */
    Rectangle = function(x1, y1, x2, y2) {
        var out = [[x1, y1], [x2, y2], false];
        Rectangle.normalize(out, out);
        return out;
    };

    Rectangle.zero = function() {
        return [[0, 0], [0, 0], true];
    };

    Rectangle.clone = function(rec1) {
        return [[rec1[0][0], rec1[0][1]],[rec1[1][0], rec1[1][1]],rec1[2]];
    };

    Rectangle.copy = function(out, rec1) {
        out[0][0] = rec1[0][0];
        out[0][1] = rec1[0][1];

        out[1][0] = rec1[1][0];
        out[1][1] = rec1[1][1];

        out[2] = rec1[2];

        return out;
    };

    var aux1 = [0,0],
        aux2 = [0,0];

    Rectangle.normalize = function(out, rec1, force) {
        force = force || rec1[2] === false || false;

        if (!force) { Rectangle.copy(out, rec1); return out; }

        Vec2.min(aux1, rec1[0], rec1[1]);
        Vec2.max(aux2, rec1[0], rec1[1]);

        out[0][0] = aux1[0];
        out[0][1] = aux2[0];

        out[1][0] = aux2[0];
        out[1][1] = aux1[0];

        out[2] = false;

        return out;
    };

    Rectangle.center = function(out_vec2, rec1) {
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

    return Rectangle;

}());


if ("undefined" === typeof module) {
    window.Rectangle = exp;
} else {
    module.exports = exp;
}