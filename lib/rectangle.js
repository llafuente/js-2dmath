var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
    vec2_distance = Vec2.distance,
    max = Math.max,
    min = Math.min,
    aux_vec2_1 = [0, 0],
    aux_vec2_2 = [0, 0],
    a = 0,
    b = 0;
/**
 * Rectangle is an array with [a: Vec2, b: Vec2, normalized: Boolean]
 * @returns {Rectangle}
 */
function create(x1, y1, x2, y2) {
    var out = [[x1, y1], [x2, y2], false];
    normalize(out, out);
    return out;
}
/**
 * @returns {Rectangle}
 */
function fromBB(bb2) {
    return create(bb2[0], bb2[1], bb2[2], bb2[3]);
}
/**
 * @returns {Rectangle}
 */
function zero() {
    return [[0, 0], [0, 0], true];
}
/**
 * @returns {Rectangle}
 */
function clone(rect) {
    return [[rect[0][0], rect[0][1]], [rect[1][0], rect[1][1]], rect[2]];
}
/**
 * @returns {Rectangle}
 */
function copy(out, rect) {
    out[0][0] = rect[0][0];
    out[0][1] = rect[0][1];

    out[1][0] = rect[1][0];
    out[1][1] = rect[1][1];

    out[2] = rect[2];

    return out;
}

/**
 * a -> bottom-left
 * a -> top-right
 * @returns {Rectangle}
 */
function normalize(out, rect, force) {
    force = force || rect[2] === false || false;

    if (!force) {
        copy(out, rect);
        return out;
    }

    a = min(rect[0][0], rect[1][0]);
    b = max(rect[0][0], rect[1][0]);

    out[0][0] = a;
    out[1][0] = b;

    a = min(rect[0][1], rect[1][1]);
    b = max(rect[0][1], rect[1][1]);

    out[0][1] = a;
    out[1][1] = b;

    out[2] = true;

    return out;
}
/**
 * @returns {Vec2}
 */
function center(out_vec2, rect) {
    out_vec2[0] = (rect[0][0] + rect[1][0]) * 0.5;
    out_vec2[1] = (rect[0][1] + rect[1][1]) * 0.5;

    return out_vec2;
}
/**
 * @returns {Rectangle}
 */
function translate(out, rect, vec2) {
    out[0][0] = rect[0][0] + vec2[0];
    out[0][1] = rect[0][1] + vec2[1];

    out[1][0] = rect[1][0] + vec2[0];
    out[1][1] = rect[1][1] + vec2[1];

    return out;
}
/**
 * @returns {Number}
 */
function distance(rect, rect2) {
    center(aux_vec2_1, rect);
    center(aux_vec2_2, rect2);

    return vec2_distance(aux_vec2_2, aux_vec2_1);
}
/**
 * @returns {Number}
 */
function area(rect) {
    a = rect[0][0] - rect[1][0];
    b = rect[0][1] - rect[1][1];
    a *= b;

    return a < 0 ? -a : a; //needed id normalized ?
}
/**
 * @returns {Boolean}
 */
function isInside(rect, vec2) {
    return rect[0][0] < vec2[0] && rect[1][0] > vec2[0] && rect[0][1] < vec2[1] && rect[1][1] > vec2[1];
}

/**
 * @class Rectangle
 */
var Rectangle = {
    fromBB: fromBB,
    create: create,
    zero: zero,
    clone: clone,
    copy: copy,
    normalize: normalize,
    center: center,
    translate: translate,
    distance: distance,
    area: area,
    isInside: isInside
};


module.exports = Rectangle;