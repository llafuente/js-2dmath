/*
 * Stability: 1 (Only additions & fixes)
 *
 * Rectangle is represented as a three coordinates array
 * [a: Vec2, b: Vec2, normalized: Boolean]
 */

var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
    vec2_distance = Vec2.distance,
    max = Math.max,
    min = Math.min,
    aux_vec2_1 = [0, 0],
    aux_vec2_2 = [0, 0],
    a = 0,
    b = 0;
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Rectangle}
 */
function create(x1, y1, x2, y2) {
    var out = [[x1, y1], [x2, y2], false];
    normalize(out, out);
    return out;
}
/**
 * @param {AABB2} aabb2
 * @return {Rectangle}
 */
function fromBB(aabb2) {
    return create(aabb2[0], aabb2[1], aabb2[2], aabb2[3]);
}
/**
 * @return {Rectangle}
 */
function zero() {
    return [[0, 0], [0, 0], true];
}
/**
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function clone(rect) {
    return [[rect[0][0], rect[0][1]], [rect[1][0], rect[1][1]], rect[2]];
}
/**
 * @param {Rectangle} out
 * @param {Rectangle} rect
 * @return {Rectangle}
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
 *
 * @param {Rectangle} out
 * @param {Rectangle} rect
 * @param {Boolean=} force
 * @return {Rectangle}
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
 * @param {Vec2} out_vec2
 * @param {Rectangle} rect
 * @return {Vec2}
 */
function center(out_vec2, rect) {
    out_vec2[0] = (rect[0][0] + rect[1][0]) * 0.5;
    out_vec2[1] = (rect[0][1] + rect[1][1]) * 0.5;

    return out_vec2;
}
/**
 * @param {Rectangle} out
 * @param {Rectangle} rect
 * @param {Vec2} vec2
 * @return {Rectangle}
 */
function translate(out, rect, vec2) {
    out[0][0] = rect[0][0] + vec2[0];
    out[0][1] = rect[0][1] + vec2[1];

    out[1][0] = rect[1][0] + vec2[0];
    out[1][1] = rect[1][1] + vec2[1];

    return out;
}
/**
 * @param {Rectangle} rect
 * @param {Rectangle} rect2
 * @return {Number}
 */
function distance(rect, rect2) {
    center(aux_vec2_1, rect);
    center(aux_vec2_2, rect2);

    return vec2_distance(aux_vec2_2, aux_vec2_1);
}
/**
 * @param {Rectangle} rect
 * @return {Number}
 */
function area(rect) {
    a = rect[0][0] - rect[1][0];
    b = rect[0][1] - rect[1][1];
    a *= b;

    return a < 0 ? -a : a; //needed id normalized ?
}
/**
 * @param {Rectangle} rect
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(rect, vec2) {
    return rect[0][0] < vec2[0] && rect[1][0] > vec2[0] && rect[0][1] < vec2[1] && rect[1][1] > vec2[1];
}
/**
 * @param {Rectangle} rect
 * @return {Number}
 */
function perimeter(rect) {
    return (rect[1][0] - rect[0][0]) * 2 + (rect[1][1] - rect[0][1]) * 2 ;
}
/**
 * @param {Rectangle} rect
 * @param {Number} mass
 */
function momentOfInertia(rect, mass) {
    var w = rect[1][0] - rect[0][0],
        h = rect[1][1] - rect[0][1];

    // X/12
    return mass * (h*h + w*w) * 0.08333333333333333;
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
    isVec2Inside: isVec2Inside,
    perimeter: perimeter,

    //physics
    momentOfInertia: momentOfInertia,
};


module.exports = Rectangle;