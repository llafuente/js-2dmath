/**
 * @returns {Line2}
 */
function create(x, y, m) {
    return [[x, y], m];
}
/**
 * @returns {Line2}
 */
function fromPoints(x1, y1, x2, y2) {
    return [[x1, y1], (x1 - x2) / (y1 - y2)];
}
/**
 * @returns {Line2}
 */
function fromSegment2(seg2) {
    return [[seg2[0], seg2[1]], (seg2[0] - seg2[2]) / (seg2[1] - seg2[3])];
}
/**
 * @returns {Line2}
 */
function copy(out, l1) {
    out[0][0] = l1[0][0];
    out[0][1] = l1[0][1];
    out[1] = l1[1];

    return out;
}
/**
 * @returns {Line2}
 */
function clone(l1) {
    return [[l1[0][0], l1[0][1]], l1[1]];
}
/**
 * @returns {Line2}
 */
function add(out, l1, v1) {
    out[0][0] = l1[0][0] + v1[0];
    out[0][1] = l1[0][1] + v1[1];
    out[1] = l1[1];

    return out;
}
/**
 * @returns {Line2}
 */
function subtract(out, l1, v1) {
    out[0][0] = l1[0][0] - v1[0];
    out[0][1] = l1[0][1] - v1[1];
    out[1] = l1[1];

    return out;
}
/**
 * @returns {Line2}
 */
function parallel(out, l1) {
    out[0][0] = l1[0][0];
    out[0][1] = l1[0][1];
    out[1] = 1 / l1[1];

    return out;
}

/**
 * @class Line2
 */
var Line2 = {
    create: create,
    fromPoints: fromPoints,
    fromSegment2: fromSegment2,
    copy: copy,
    clone: clone,
    add: add,
    subtract: subtract,
    parallel: parallel,

    // alias
    translate: add,
    sub: subtract
};


module.exports = Line2;