/**
 * Stability: 0 (Anything could happen)
 *
 * 2x2 matrix used for rotations 2D represented as a 5 coordinates array
 * [m11:Number, m12:Number, m21:Number, m22:Number, angle:Number]
 * Can be used to solve 2x2 matrices problems.
 */

var cos = Math.cos,
    sin = Math.sin,
    acos = Math.acos;

/**
 * @returns {Matrix22}
 */
function create(angle) {
    return [1, 0, 0, 1, 0];
}
/**
 * @returns {Matrix22}
 */
function fromAngle(angle) {
    angle = angle || 0;
    var c = cos(angle),
        s = sin(angle);

    return [c, -s, s, c, angle];
}
/**
 * @returns {Matrix22}
 */
function fromNumbers(m11, m12, m21, m22) {
    return [m11, m12, m21, m22, acos(m11)];
}
/**
 * @returns {Matrix22}
 */
function zero() {
    return [0, 0, 0, 0, 0];
}
/**
 * @returns {Matrix22}
 */
function identity() {
    return [1, 0, 0, 1, 0];
}
/**
 * @returns {Matrix22}
 */
function copy(out, mat22) {
    out[0] = mat22[0];
    out[1] = mat22[1];
    out[2] = mat22[2];
    out[3] = mat22[3];

    out[4] = mat22[4];

    return out;
}

/**
 * Solve A * x = b
 * @returns {Vec2}
 */
function solve(out_vec2, mat22, vec2) {
    var x = vec2[0],
        y = vec2[1];

    var a11 = mat22[0],
        a12 = mat22[2],
        a21 = mat22[1],
        a22 = mat22[3],
        det = 1 / (a11 * a22 - a12 * a21);

    out_vec2[0] = det * (a22 * x - a12 * y);
    out_vec2[1] = det * (a11 * y - a21 * x);

    return out_vec2;
}
/**
 * @returns {Number}
 */
function determinant(mat22) {
    return mat22[0] * mat22[3] - mat22[1] * mat22[2];
}
/**
 * @returns {Matrix22}
 */
function setRotation(out, angle) {
    var c = cos(angle),
        s = sin(angle);

    out[0] = c;
    out[1] = -s;
    out[2] = s;
    out[3] = c;

    return out;
}
/**
 * @returns {Vec2}
 */
function rotate(out_vec2, mat22, vec2) {
    out_vec2[0] = vec2[0] * mat22[0] - vec2[1] * mat22[3];
    out_vec2[1] = vec2[0] * mat22[3] + vec2[1] * mat22[0];

    return out_vec2;
}
/**
 * @returns {Vec2}
 */
function unrotate(out_vec2, mat22, vec2) {
    out_vec2[0] = vec2[0] * mat22[0] + vec2[1] * mat22[3];
    out_vec2[1] = -vec2[0] * mat22[3] + vec2[1] * mat22[0];

    return out_vec2;
}
/**
 * @returns {Matrix22}
 */
function invert(out, mat22) {
    var a = mat22[0],
        b = mat22[2],
        c = mat22[1],
        d = mat22[3],

        det = 1 / (a * d - b * c);

    out[0] = det * d;
    out[2] = -det * b;
    out[1] = -det * c;
    out[3] = det * a;

    return out;
}

var Matrix22 = {
    create: create,
    fromAngle: fromAngle,
    fromNumbers: fromNumbers,
    zero: zero,
    identity: identity,
    copy: copy,
    solve: solve,
    determinant: determinant,
    setRotation: setRotation,
    rotate: rotate,
    unrotate: unrotate,
    invert: invert
};

module.exports = Matrix22;