var dx,
    dy,
    r,
    sqrt = Math.sqrt;

/**
 * @returns {Line2}
 */
function create(x, y, m) {
    return [[x, y], m];
}
/**
 * @returns {Line2}
 */
function zero() {
    return [[0, 0], 0];
}
/**
 * @returns {Line2}
 */
function fromVec2(v1, v2) {
    return [[v1[0], v1[1]], (v1[0] - v2[0]) / (v1[0] - v2[1])];
}
/**
 * @returns {Line2}
 */
function from2Points(x1, y1, x2, y2) {
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
function copy(out, line2) {
    out[0][0] = line2[0][0];
    out[0][1] = line2[0][1];
    out[1] = line2[1];

    return out;
}
/**
 * @returns {Line2}
 */
function clone(line2) {
    return [[line2[0][0], line2[0][1]], line2[1]];
}
/**
 * @returns {Line2}
 */
function add(out, line2, v1) {
    out[0][0] = line2[0][0] + v1[0];
    out[0][1] = line2[0][1] + v1[1];
    out[1] = line2[1];

    return out;
}
/**
 * @returns {Line2}
 */
function subtract(out, line2, v1) {
    out[0][0] = line2[0][0] - v1[0];
    out[0][1] = line2[0][1] - v1[1];
    out[1] = line2[1];

    return out;
}

/**
 * @returns {Line2}
 */
function offset(out, line2, offset) {
    out[0][0] = line2[0][0] + offset;
    out[0][1] = line2[0][1];
    out[1] = line2[1];

    return out;
}



/**
 * @class Line2
 */
var Line2 = {
    create: create,
    zero: zero,
    fromVec2: fromVec2,
    from2Points: from2Points,
    fromSegment2: fromSegment2,
    copy: copy,
    clone: clone,
    add: add,
    subtract: subtract,
    offset: offset,

    // alias
    translate: add,
    sub: subtract
};


module.exports = Line2;