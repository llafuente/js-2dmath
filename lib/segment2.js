var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    within = Vec2.$.within,
    sqrt = Math.sqrt,
    __x,
    __y,
    u = 0;
/**
 * @returns {Segment2}
 */
function create(x1, y1, x2, y2) {
    return [x1, y1, x2, y2];
}
/**
 * @returns {Segment2}
 */
function clone(seg2) {
    return [seg2[0], seg2[1], seg2[2], seg2[3]];
}
/**
 * @returns {Segment2}
 */
function copy(out, seg2) {
    out[0] = seg2[0];
    out[1] = seg2[1];
    out[2] = seg2[2];
    out[3] = seg2[3];

    return out;
}
/**
 * @returns {Segment2}
 */
function translate(out, seg2, vec2) {
    out[0] = seg2[0] + vec2[0];
    out[1] = seg2[1] + vec2[1];
    out[2] = seg2[2] + vec2[0];
    out[3] = seg2[3] + vec2[1];

    return out;
}
/**
 * @returns {Number}
 */
function length(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return sqrt(__x * __x + __y * __y);
}
/**
 * @returns {Number}
 */
function sqrLength(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return __x * __x + __y * __y;
}


/**
 * @returns {Number}
 */
function cross(seg2, vec2) {
    return (seg2[0] - vec2[0]) * (seg2[3] - vec2[1]) - (seg2[1] - vec2[1]) * (seg2[2] - vec2[0]);
}
/**
 * @returns {Boolean}
 */
function collinear(seg2, vec2) {
    return (seg2[2] - seg2[0]) * (vec2[1] - vec2[1]) === (vec2[0] - seg2[0]) * (seg2[3] - seg2[1]);
}

/**
 * @returns {Boolean}
 */
function inside(seg2, vec2) {
    return collinear(seg2, vec2) && Vec2.within([seg2[0], seg2[1]], vec2, [seg2[2], seg2[3]]);
}
/**
 * @returns {Vec2}
 */
function closestPoint(out_vec2, seg2, vec2) {
    return $closestPoint(out_vec2, seg2[0], seg2[1], seg2[2], seg2[3], vec2[0], vec2[1]);
}

/**
 * @returns {Vec2}
 */
function $closestPoint(out_vec2, x1, y1, x2, y2, x3, y3) {
    __x = x2 - x1;
    __y = y2 - y1;

    u = ((x3 - x1) * __x + (y3 - y1) * __y) / (__x * __x + __y * __y);

    if (u > 1) {
        u = 1;
    } else if (u < 0) {
        u = 0;
    }

    out_vec2[0] = (x1 + u * __x);
    out_vec2[1] = (y1 + u * __y);

    return out_vec2;
}

/**
 * @returns {Boolean}
 */
function $collinear(x1, y1, x2, y2, x3, y3) {
    return (x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1);
}
/**
 * @returns {Boolean}
 */
function $inside(x1, x2, y1, y2, x3, y3) {
    return $collinear(x1, x2, y1, y2, x3, y3) && within(x1, x2, x3, y3, y1, y2);
}

/**
 * @class Segment2
 */
var Segment2 =  {
    create: create,
    clone: clone,
    copy: copy,
    translate: translate,
    length: length,
    sqrLength: sqrLength,
    cross: cross,
    collinear: collinear,
    closestPoint: closestPoint,
    inside: inside,
    $: {
        inside: $inside,
        collinear: $collinear,
        closestPoint: $closestPoint
    },
};


module.exports = Segment2;