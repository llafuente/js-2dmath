var exp;
(exp = function () {
    "use strict";

    var Line2;

     /**
     * @name Line2
     * @class Line2
     */
    Line2 = function(x, y, m) {
        return [[x,y], m];
    };

    Line2.fromPoints = function(x1, y1, x2, y2) {
        return [[x1, y1], (x1 - x2) / (y1 - y2)];
    };

    Line2.copy = function(out, l1) {
        out[0][0] = l1[0][0];
        out[0][1] = l1[0][1];
        out[1] = l1[1];

        return out;
    };

    Line2.clone = function(l1) {
        return [[l1[0][0],l1[0][1]],l1[1]];
    };

    Line2.add = function(out, l1, v1) {
        out[0][0] = l1[0][0] + v1[0];
        out[0][1] = l1[0][1] + v1[1];
        out[1] = l1[1];

        return out;
    };

    Line2.translate = Line2.add;

    Line2.subtract = function(out, l1, v1) {
        out[0][0] = l1[0][0] - v1[0];
        out[0][1] = l1[0][1] - v1[1];
        out[1] = l1[1];

        return out;
    };

    Line2.sub = Line2.subtract;

    Line2.parallel = function(out, l1) {
        out[0][0] = l1[0][0];
        out[0][1] = l1[0][1];
        out[1] = 1 / l1[1];

        return out;
    };

    return Line2;




        /**
         * @return {Intersection}
         *
        intersect: function (whoknows) {
            return Math.intersection(this, whoknows);
        }
        */

}());


if ("undefined" === typeof module) {
    window.Line2 = exp;
} else {
    module.exports = exp;
}