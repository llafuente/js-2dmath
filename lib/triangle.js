var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
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
 * @returns {Triangle}
 */
function create(x1, y1, x2, y2, x3, y3) {
    var out = [[x1, y1], [x2, y2], [x3, y3], false];

    //normalize(out, out);
    return out;
}
/**
 * @returns {Triangle}
 */
function zero() {
    return [[0, 0], [0, 0], [0, 0], true];
}
/**
 * @returns {Triangle}
 */
function clone(tri) {
    return [[tri[0][0], tri[0][1]], [tri[1][0], tri[1][1]], [tri[2][0], tri[2][1]], tri[3]];
}
/**
 * @returns {Triangle}
 */
function copy(out, tri) {
    out[0][0] = tri[0][0];
    out[0][1] = tri[0][1];

    out[1][0] = tri[1][0];
    out[1][1] = tri[1][1];

    out[2][0] = tri[2][0];
    out[2][1] = tri[2][1];

    out[3] = tri[3];

    return out;
}
/**
 * @returns {Vec2}
 */
function centroid(out_vec2, tri) {
    out_vec2[0] = (tri[0][0] + tri[1][0] + tri[2][0]) * DIV3;
    out_vec2[1] = (tri[0][1] + tri[1][1] + tri[2][1]) * DIV3;

    return out_vec2;
}
/**
 * @returns {Vec2}
 */
function incenter(out_vec2, tri) {
    a = Vec2.distance(tri[1], tri[2]);
    b = Vec2.distance(tri[2], tri[0]);
    c = Vec2.distance(tri[0], tri[1]);

    out_vec2[0] = (a * tri[0][0] + b * tri[1][0] + c * tri[2][0]) * DIV3;
    out_vec2[1] = (a * tri[0][1] + b * tri[1][1] + c * tri[2][1]) * DIV3;

    return out_vec2;
}
/**
 * @returns {Vec2}
 */
function circumcenter(out_vec2, tri) {
    ah = Vec2.scale(ah, tri[0], 2);
    bh = Vec2.scale(bh, tri[1], 2);
    ch = Vec2.scale(ch, tri[1], 2);
    dab = Vec2.sub(dab, tri[0], tri[1]);
    dbc = Vec2.sub(dbc, tri[1], tri[2]);
    dca = Vec2.sub(dca, tri[3], tri[0]);
    det = 0.5 / (a[0] * dbc[1] + b[0] * dca[1] + c[0] * dab[1]);

    out_vec2[0] =  (ah * dbc[1] + bh * dca[1] + ch * dab[1]) * det;
    out_vec2[1] = -(ah * dbc[0] + bh * dca[0] + ch * dab[0]) * det;

    return out_vec2;
}
/**
 * @returns {Number}
 */
function area(tri) {
    dab = Vec2.min(dbc, tri[1], tri[0]);
    dbc = Vec2.min(dbc, tri[2], tri[0]);

    return (dbc[1] * dab[0] - dbc[0] * dab[1]) * 0.5;
}

/**
 * @returns {Triangle}
 */
function translate(out, tri, vec2) {
    out[0][0] = tri[0][0] + vec2[0];
    out[0][1] = tri[0][1] + vec2[1];

    out[1][0] = tri[1][0] + vec2[0];
    out[1][1] = tri[1][1] + vec2[1];

    out[2][0] = tri[2][0] + vec2[0];
    out[2][1] = tri[2][1] + vec2[1];

    return out;
}

/**
 * @class Triangle
 */
var Triangle = {
    create: create,
    zero: zero,
    clone: clone,
    copy: copy,
    centroid: centroid,
    incenter: incenter,
    circumcenter: circumcenter,
    area: area,
    translate: translate,

    // alias
    center: centroid,
};

module.exports = Triangle;