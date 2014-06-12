/**
 * Segment2 is represented by a 4 coordinates array
 * [x1:Number, y1:Number, x2:Number, y2:Number] normalized so x1 < x2
 */

var Vec2 = require("./vec2.js"),
    vec2_rotate = Vec2.rotate,
    aux_vec2 = [0, 0],
    aux,
    within = Vec2.$within,
    sqrt = Math.sqrt,
    atan2 = Math.atan2,
    PI = Math.PI,
    near = Math.near,
    __x,
    __y,
    u = 0;
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Segment2}
 */
function create(x1, y1, x2, y2) {
    if (x1 < x2) {
        return [x1, y1, x2, y2];
    }

    return [x2, y2, x1, y1];
}
/**
 * @param {Segment2} out
 * @param {Segment2} seg2
 * @return {Segment2}
 */
function normalize(out, seg2) {
    if (seg2[0] < seg2[1]) {
        out[0] = seg2[0];
        out[1] = seg2[1];
        out[2] = seg2[2];
        out[3] = seg2[3];
    } else {
        var x = seg2[0],
            y = seg2[1];

        out[0] = seg2[2];
        out[1] = seg2[3];
        out[2] = x;
        out[3] = y;
    }

    return out;
}
/**
 * @param {Segment2} seg2
 * @return {Segment2}
 */
function clone(seg2) {
    return [seg2[0], seg2[1], seg2[2], seg2[3]];
}
/**
 * @param {Segment2} out
 * @param {Segment2} seg2
 * @return {Segment2}
 */
function copy(out, seg2) {
    out[0] = seg2[0];
    out[1] = seg2[1];
    out[2] = seg2[2];
    out[3] = seg2[3];

    return out;
}
/**
 * @param {Segment2} out
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Segment2}
 */
function translate(out, seg2, vec2) {
    out[0] = seg2[0] + vec2[0];
    out[1] = seg2[1] + vec2[1];
    out[2] = seg2[2] + vec2[0];
    out[3] = seg2[3] + vec2[1];

    return out;
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function length(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return sqrt(__x * __x + __y * __y);
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function sqrLength(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return __x * __x + __y * __y;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @return {Vec2}
 */
function midPoint(out_vec2, seg2) {
    out_vec2[0] = (seg2[0] + seg2[2]) * 0.5;
    out_vec2[1] = (seg2[1] + seg2[3]) * 0.5;

    return out_vec2;
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function slope(seg2) {
    return (seg2[0] - seg2[2]) / (seg2[1] - seg2[3]);
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function angle(seg2) {
    return atan2(seg2[3] - seg2[1], seg2[2] - seg2[0]);
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Number}
 */
function cross(seg2, vec2) {
    return (seg2[0] - vec2[0]) * (seg2[3] - vec2[1]) - (seg2[1] - vec2[1]) * (seg2[2] - vec2[0]);
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isCollinear(seg2, vec2) {
    return near((seg2[2] - seg2[0]) * (vec2[1] - vec2[1]), (vec2[0] - seg2[0]) * (seg2[3] - seg2[1]));
}
/**
 * @todo do it!
 * @return {Boolean}
 * @param {Segment2} seg2
 * @param {Segment2} seg2_2
 */
function isParallel(seg2, seg2_2) {
    throw new Error("todo");
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(seg2, vec2) {
    return isCollinear(seg2, vec2) && within(seg2[0], seg2[1], vec2[0], vec2[1], seg2[2], seg2[3]);
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @param {Number=} cached_seg2_min_angle
 * @return {Boolean}
 */
function isAbove(seg2, vec2, cached_seg2_min_angle) {
    aux_vec2[0] = seg2[0];
    aux_vec2[1] = seg2[1];
    angle = Vec2.angleTo(vec2, aux_vec2);

    cached_seg2_min_angle = cached_seg2_min_angle || Segment2.angle(seg2);

    if (cached_seg2_min_angle >= 0) {
        aux = cached_seg2_min_angle;
        cached_seg2_min_angle = cached_seg2_min_angle - PI;
        cache_seg2_angle_max = aux;
        return angle > cached_seg2_min_angle && angle < cache_seg2_angle_max;
    }

    cache_seg2_angle_max = cached_seg2_min_angle + PI;

    return angle < cached_seg2_min_angle || angle > cache_seg2_angle_max;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @return {Vec2}
 */
function leftNormal(out_vec2, seg2) {
    out_vec2[0] = seg2[2] - seg2[0];
    out_vec2[1] = seg2[3] - seg2[1];

    vec2_rotate(out_vec2, out_vec2, -Math.HALF_PI);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @return {Vec2}
 */
function rightNormal(out_vec2, seg2) {
    out_vec2[0] = seg2[2] - seg2[0];
    out_vec2[1] = seg2[3] - seg2[1];

    vec2_rotate(out_vec2, out_vec2, Math.HALF_PI);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function closestPoint(out_vec2, seg2, vec2) {
    return $closestPoint(out_vec2, seg2[0], seg2[1], seg2[2], seg2[3], vec2[0], vec2[1]);
}

/**
 * @todo optimize, "inline the if/else"
 * @param {Vec2} out_vec2
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Vec2}
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
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Boolean}
 */
function $collinear(x1, y1, x2, y2, x3, y3) {
    //strict return (x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1);
    return near((x2 - x1) * (y3 - y1), (x3 - x1) * (y2 - y1));
}
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Boolean}
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
    normalize: normalize,
    translate: translate,
    length: length,
    sqrLength: sqrLength,
    midPoint: midPoint,
    slope: slope,
    angle: angle,
    cross: cross,
    closestPoint: closestPoint,
    isCollinear: isCollinear,
    isParallel: isParallel,
    isVec2Inside: isVec2Inside,
    isAbove: isAbove,
    leftNormal: leftNormal,
    rightNormal: rightNormal,

    // alias
    lengthSq: sqrLength,
    contains: isVec2Inside,

    $inside: $inside,
    $collinear: $collinear,
    $closestPoint: $closestPoint
};


module.exports = Segment2;