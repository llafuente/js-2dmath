var exp;
(exp = function () {
    "use strict";

    var Circle;

    /**
     * @class Circle
     */
    Circle = function (x, y, r) {
        return [[x,y], r];
    };

    Circle.clone = function (circle) {
        return [[circle[0][0], circle[0][1]],circle[1]];
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

    return Circle;

}());


if ("undefined" === typeof module) {
    window.Circle = exp;
} else {
    module.exports = exp;
}