var exp;
(exp = function () {
    "use strict";

    var Polygon;

    /**
     * @name Polygon
     * @class Polygon
     */
    Polygon = function() {
        var i,
            out = new Array(arguments.length);

        for (i = 0; i < arguments.length; ++i) {
            out[i] = arguments[i];
        }
        return out;
    };

    }());


if ("undefined" === typeof module) {
    window.Polygon = exp;
} else {
    module.exports = exp;
}