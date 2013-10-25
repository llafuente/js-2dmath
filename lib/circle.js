var exp;
(exp = function () {
    "use strict";

    var browser = "undefined" === typeof module,
        Vec2 = browser ? window.Vec2 : require("./vec2.js"),
        max = Math.max,
        TWOPI = Math.TWOPI,
        PI = Math.PI,
        Circle;

    /**
     * @class Circle
     */
    Circle = {};

    Circle.create = function (x, y, r) {
        return [[x, y], r];
    };

    Circle.clone = function (circle) {
        return [[circle[0][0], circle[0][1]], circle[1]];
    };

    Circle.copy = function (out, circle) {
        out[0][0] = circle[0][0];
        out[0][1] = circle[0][1];
        out[1] = circle[1];

        return out;
    };

    Circle.translate = function (out, circle, v1) {
        out[0][0] = circle[0][0] + v1[0];
        out[0][1] = circle[0][1] + v1[1];
        out[1] = circle[1];

        return out;
    };

    Circle.distance = function (acircle, bcircle) {
        return max(0, Vec2.distance(acircle[0], bcircle[0]) - acircle[1] - bcircle[1]);
    };

    Circle.length = function (circle) {
        return TWOPI * circle[1];
    };

    Circle.area = function (circle) {
        return PI * circle[1] * circle[1];
    };

    return Circle;

}());


if ("undefined" === typeof module) {
    window.Circle = exp;
} else {
    module.exports = exp;
}