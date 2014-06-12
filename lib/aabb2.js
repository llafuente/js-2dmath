/**
 * Stability: 1 (Only additions & fixes)
 *
 * BoundingBox2 is represented as a 5 coordinates array
 * [left: Number, bottom: Number, right: Number, top: Number, normalized: Boolean]
 */

var min = Math.min,
    max = Math.max,
    TOPLEFT = 1,
    TOPMIDDLE = 2,
    TOPRIGHT = 3,

    CENTERLEFT = 4,
    CENTER = 5,
    CENTERRIGHT = 6,

    BOTTOMLEFT = 7,
    BOTTOM = 8,
    BOTTOMRIGHT = 9,

    r = 0,
    x = 0,
    y = 0,

    min_x = 0,
    max_x = 0,
    min_y = 0,
    max_y = 0;

/**
 * @param {Number} l
 * @param {Number} b
 * @param {Number} r
 * @param {Number} t
 * @return {AABB2}
 */
function create(l, b, r, t) {
    var out = [l, b, r, t, false];
    normalize(out, out);
    return out;
}
/**
 * @param {AABB2} aabb2
 * @param {Number} x
 * @param {Number} y
 * @return {Array<AABB2>}
 */
function fromAABB2Division(aabb2, x, y) {
    var out = [],
        i,
        j,
        l = aabb2[0],
        b = aabb2[1],
        r = aabb2[2],
        t = aabb2[3],
        w = (r - l) / x,
        h = (t - b) / y;

    for (i = 0; i < x; ++i) {
        for (j = 0; j < y; ++j) {
            out.push([l + i * w, b + j * h, l + (i + 1) * w, b + (j + 1) * h]);
        }
    }

    return out;
}
/**
 * @param {Segment2} seg2
 * @return {AABB2}
 */
function fromSegment2(seg2) {
    var out = [seg2[0], seg2[1], seg2[2], seg2[3], false];
    normalize(out, out);
    return out;
}
/**
 * @param {Circle} circle
 * @return {AABB2}
 */
function fromCircle(circle) {
    r = circle[1];
    x = circle[0][0];
    y = circle[0][1];
    return create(
        x - r,
        y - r,
        x + r,
        y + r
    );
}
/**
 * @param {Rectangle} rect
 * @return {AABB2}
 */
function fromRectangle(rect) {
    var out = [rect[0][0], rect[0][1], rect[1][0], rect[1][1], false];
    normalize(out, out);
    return out;
}
/**
 * @todo implement a more robust / fast algorithm http://stackoverflow.com/questions/2587751/an-algorithm-to-find-bounding-box-of-closed-bezier-curves (Timo answer)
 *
 * @reference http://jsfiddle.net/4VCVX/3/
 *
 * @param {Beizer} beizer
 * @param {Number} npoints
 * @return {AABB2}
 */
function fromBeizer(beizer, npoints) {
    npoints = npoints || 40;
    var vec2_list = Beizer.get(beizer, npoints),
        i,
        l = Infinity,
        b = Infinity,
        r = -Infinity,
        t = -Infinity,
        v,
        x,
        y;

    // loop min, max
    for (i = 0; i < npoints; ++i) {
        v = vec2_list[i];

        x = v[0];
        y = v[1];

        if (x > r) {
            r = x;
        } else if (x < l) {
            l = x;
        }

        if (y < b) {
            b = y;
        } else if (y > t) {
            t = y;
        }
    }

    return [l, b, r, t, true];

}

/**
 * @return {AABB2}
 */
function zero() {
    return [0, 0, 0, 0, true];
}
/**
 * @param {AABB2} aabb2
 * @return {AABB2}
 */
function clone(aabb2) {
    return [aabb2[0], aabb2[1], aabb2[2], aabb2[3], aabb2[4]];
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @return {AABB2}
 */
function copy(out, aabb2) {
    out[0] = aabb2[0];
    out[1] = aabb2[1];
    out[2] = aabb2[2];
    out[3] = aabb2[3];
    out[4] = aabb2[4];

    return out;
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @param {Number} margin
 * @return {AABB2}
 */
function expand(out, aabb2, margin) {
    out[0] = aabb2[0] - margin;
    out[1] = aabb2[1] - margin;
    out[2] = aabb2[2] + margin;
    out[3] = aabb2[3] + margin;

    return out;
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2_1
 * @param {AABB2} aabb2_2
 * @return {AABB2}
 */
function merge(out, aabb2_1, aabb2_2) {
    out[0] = min(aabb2_1[0], aabb2_2[0]);
    out[1] = min(aabb2_1[1], aabb2_2[1]);
    out[2] = max(aabb2_1[2], aabb2_2[2]);
    out[3] = max(aabb2_1[3], aabb2_2[3]);

    return out;
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2_1
 * @param {AABB2} aabb2_2
 * @param {Vec2} vec2_offset
 * @return {AABB2}
 */
function offsetMerge(out, aabb2_1, aabb2_2, vec2_offset) {
    out[0] = min(aabb2_1[0], aabb2_2[0] + vec2_offset[0]);
    out[1] = min(aabb2_1[1], aabb2_2[1] + vec2_offset[1]);
    out[2] = max(aabb2_1[2], aabb2_2[2] + vec2_offset[0]);
    out[3] = max(aabb2_1[3], aabb2_2[3] + vec2_offset[1]);

    return out;
}
/**
 * offset & scale merge
 * @param {AABB2} out
 * @param {AABB2} aabb2_1
 * @param {AABB2} aabb2_2
 * @param {Vec2} vec2_offset
 * @param {Vec2} vec2_scale
 * @return {AABB2}
 */
function osMerge(out, aabb2_1, aabb2_2, vec2_offset, vec2_scale) {
    out[0] = min(aabb2_1[0], (aabb2_2[0] * vec2_scale[0]) + vec2_offset[0]);
    out[1] = min(aabb2_1[1], (aabb2_2[1] * vec2_scale[1]) + vec2_offset[1]);
    out[2] = max(aabb2_1[2], (aabb2_2[2] * vec2_scale[0]) + vec2_offset[0]);
    out[3] = max(aabb2_1[3], (aabb2_2[3] * vec2_scale[1]) + vec2_offset[1]);

    return out;
}
/**
 * offset & scale merge
 * @param {AABB2} aabb2
 * @return {Number}
 */
function area(aabb2) {
    return (aabb2[2] - aabb2[0]) * (aabb2[3] - aabb2[1]);
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @return {AABB2}
 */
function normalize(out, aabb2) {
    min_x = aabb2[0] > aabb2[2] ? aabb2[2] : aabb2[0];
    max_x = aabb2[0] > aabb2[2] ? aabb2[0] : aabb2[2];
    min_y = aabb2[1] > aabb2[3] ? aabb2[3] : aabb2[1];
    max_y = aabb2[1] > aabb2[3] ? aabb2[1] : aabb2[3];

    out[0] = min_x;
    out[1] = min_y;

    out[2] = max_x;
    out[3] = max_y;

    out[4] = true;

}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @param {Vec2} vec2
 * @return {AABB2}
 */
function translate(out, aabb2, vec2) {
    x = vec2[0];
    y = vec2[1];

    out[0] = aabb2[0] + x;
    out[1] = aabb2[1] + y;
    out[2] = aabb2[2] + x;
    out[3] = aabb2[3] + y;

    return out;
}
/**
 * @param {Vec2} out_vec2
 * @param {AABB2} aabb2
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function clampVec(out_vec2, aabb2, vec2) {
    out_vec2[0] = min(max(aabb2[0], vec2[0]), aabb2[2]);
    out_vec2[1] = min(max(aabb2[1], vec2[1]), aabb2[3]);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {AABB2} aabb2
 */
function center(out_vec2, aabb2) {
    out_vec2[0] = (aabb2[0] + aabb2[1]) * 0.5;
    out_vec2[1] = (aabb2[3] + aabb2[2]) * 0.5;

    return out_vec2;
}

/**
 * alignment values: AABB2.TOPLEFT, AABB2.TOPMIDDLE, AABB2.TOPRIGHT, AABB2.CENTERLEFT, AABB2.CENTER, AABB2.CENTERRIGHT, AABB2.BOTTOMLEFT, AABB2.BOTTOM, AABB2.BOTTOMRIGH
 *
 * @param {Vec2} out_vec2
 * @param {AABB2} aabb2
 * @param {Number} alignment
 * @return {Vec2}
 */
function align(out_vec2, aabb2, alignment) {
    switch (alignment) {
    case TOPLEFT:
        // do nothing!
        out_vec2[0] = aabb2[0];
        out_vec2[1] = aabb2[1];
        break;
    case TOPMIDDLE:
        out_vec2[0] = (aabb2[2] - aabb2[0]) * 0.5 + aabb2[0];
        out_vec2[1] = aabb2[1];
        break;
    case TOPRIGHT:
        out_vec2[0] = aabb2[2];
        out_vec2[1] = aabb2[1];
        break;

    case CENTERLEFT:
        out_vec2[0] = aabb2[0];
        out_vec2[1] = (aabb2[3] - aabb2[1]) * 0.5 + aabb2[1];
        break;
    case CENTER:
        out_vec2[0] = (aabb2[2] - aabb2[0]) * 0.5 + aabb2[0];
        out_vec2[1] = (aabb2[3] - aabb2[1]) * 0.5 + aabb2[1];
        break;
    case CENTERRIGHT:
        out_vec2[0] = aabb2[2];
        out_vec2[1] = (aabb2[3] - aabb2[1]) * 0.5 + aabb2[1];
        break;

    case BOTTOMLEFT:
        out_vec2[0] = aabb2[0];
        out_vec2[1] = aabb2[3];
        break;
    case BOTTOM:
        out_vec2[0] = (aabb2[2] - aabb2[0]) * 0.5 + aabb2[0];
        out_vec2[1] = aabb2[3];
        break;
    case BOTTOMRIGHT:
        out_vec2[0] = aabb2[2];
        out_vec2[1] = aabb2[3];
        break;
    }

    return out_vec2;
}
/**
 * @param {AABB2} aabb2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(aabb2, vec2) {
    return aabb2[0] < vec2[0] && aabb2[2] > vec2[0] && aabb2[1] < vec2[1] && aabb2[3] > vec2[1];
}
/**
 * @param {AABB2} aabb2
 * @param {AABB2} aabb2_2
 * @return {Boolean}
 */
function isAABB2Inside(aabb2, aabb2_2) {
    return aabb2[0] <= aabb2_2[0] &&
        aabb2[1] <= aabb2_2[1] &&
        aabb2_2[2] <= aabb2[2] &&
        aabb2_2[3] <= aabb2[3];
}
/**
 * @param {AABB2} aabb2
 * @return {Number}
 */
function perimeter(aabb2) {
    return (aabb2[2] - aabb2[0]) * 2 + (aabb2[3] - aabb2[1]) * 2;
}

/**
 * @class AABB2
 */
var AABB2 =  {
    // defines
    TOPLEFT: TOPLEFT,
    TOPMIDDLE: TOPMIDDLE,
    TOPRIGHT: TOPRIGHT,
    CENTERLEFT: CENTERLEFT,
    CENTER: CENTER,
    CENTERRIGHT: CENTERRIGHT,
    BOTTOMLEFT: BOTTOMLEFT,
    BOTTOM: BOTTOM,
    BOTTOMRIGHT: BOTTOMRIGHT,

    create: create,
    fromAABB2Division: fromAABB2Division,
    fromSegment2: fromSegment2,
    fromCircle: fromCircle,
    fromRectangle: fromRectangle,
    zero: zero,
    clone: clone,
    copy: copy,
    expand: expand,
    merge: merge,
    offsetMerge: offsetMerge,
    osMerge: osMerge,
    area: area,
    normalize: normalize,
    translate: translate,
    clampVec: clampVec,
    center: center,
    align: align,
    isVec2Inside: isVec2Inside,
    isAABB2Inside: isAABB2Inside,
    perimeter: perimeter,

    // alias
    contains: isAABB2Inside
};

module.exports = AABB2;