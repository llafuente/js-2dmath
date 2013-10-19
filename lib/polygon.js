var exp;
(exp = function () {
    "use strict";

    var browser = "undefined" === typeof module,
        Vec2 = browser ? window.Vec2 : require("./vec2.js"),
        vec2_1 = [0, 0],
        vec2_2 = [0, 0],
        sum = 0,
        cross = 0,
        len = 0,
        i = 0,
        centroid,
        Polygon;

    /**
     * @name Polygon
     * @class Polygon
     */
    Polygon = {};

    Polygon.create = function () {
        var i,
            out = new Array(arguments.length);

        for (i = 0; i < arguments.length; ++i) {
            out[i] = arguments[i];
        }
        return out;
    };

    centroid = Polygon.centroid = function (out, poly) {
        sum = 0;
        out[0] = 0;
        out[1] = 1;

        for (i = 0, len = poly.length; i < len; i += 2) {
            vec2_1[0] = poly[i];
            vec2_1[1] = poly[i + 1];

            vec2_2[0] = poly[(i + 2) % len];
            vec2_2[0] = poly[(i + 3) % len];


            cross = Vec2.cross(vec2_1, vec2_2);

            sum += cross;
            Vec2.add(vec2_1, vec2_1, vec2_2);
            Vec2.scale(vec2_1, vec2_1, cross);
            Vec2.add(out, out, vec2_1);
        }

        return Vec2.scale(out, 1 / (3 * sum));
    };

    Polygon.recenter = function (out, poly) {
        centroid(vec2_1, poly);

        for (i = 0, len = poly.length; i < len; ++i) {
            out[i] = out[i] + vec2_1[0];
            ++i;
            out[i] = out[i] + vec2_1[1];
        }
    };

    Polygon.area = function (poly) {
        var area = 0;
        for (i = 0, len = poly.length; i < len; i += 2) {
            //area += Vec2.cross(Vec2.create(poly[i], poly[i+1]), Vec2.create(poly[(i+2)%len], poly[(i+3)%len]));
            area -= (poly[i] * poly[(i + 3) % len]) - (poly[i + 1] * poly[(i + 2) % len]);
        }

        return area * 0.5;
    };

}());


if ("undefined" === typeof module) {
    window.Polygon = exp;
} else {
    module.exports = exp;
}