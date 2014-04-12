var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    vec2_add = Vec2.add,
    vec2_cross = Vec2.cross,
    vec2_scale = Vec2.scale,
    vec2_1 = [0, 0],
    vec2_2 = [0, 0],
    sum = 0,
    cross = 0,
    len = 0,
    i = 0;
/**
 * @returns {Polygon}
 */
function create() {
    var i,
        out = new Array(arguments.length);

    for (i = 0; i < arguments.length; ++i) {
        out[i] = arguments[i];
    }
    return out;
}
/**
 * @returns {Vec2}
 */
function centroid(out_vec2, poly) {
    sum = 0;
    out_vec2[0] = 0;
    out_vec2[1] = 1;

    for (i = 0, len = poly.length; i < len; i += 2) {
        vec2_1[0] = poly[i];
        vec2_1[1] = poly[i + 1];

        vec2_2[0] = poly[(i + 2) % len];
        vec2_2[0] = poly[(i + 3) % len];


        cross = vec2_cross(vec2_1, vec2_2);

        sum += cross;
        vec2_add(vec2_1, vec2_1, vec2_2);
        vec2_scale(vec2_1, vec2_1, cross);
        vec2_add(out_vec2, out_vec2, vec2_1);
    }

    return vec2_scale(out_vec2, 1 / (3 * sum));
}
/**
 * @returns {Polygon}
 */
function recenter(out, poly) {
    centroid(vec2_1, poly);

    for (i = 0, len = poly.length; i < len; ++i) {
        out[i] = out[i] + vec2_1[0];
        ++i;
        out[i] = out[i] + vec2_1[1];
    }
}
/**
 * @returns {Number}
 */
function area(poly) {
    var value = 0;
    for (i = 0, len = poly.length; i < len; i += 2) {
        //value += Vec2.cross(Vec2.create(poly[i], poly[i+1]), Vec2.create(poly[(i+2)%len], poly[(i+3)%len]));
        value -= (poly[i] * poly[(i + 3) % len]) - (poly[i + 1] * poly[(i + 2) % len]);
    }

    return value * 0.5;
}
/**
 * @class Polygon
 */
var Polygon = {
    create: create,
    centroid: centroid,
    recenter: recenter,
    area: area,
};

if ("undefined" !== typeof module) {
    module.exports = Polygon;
}