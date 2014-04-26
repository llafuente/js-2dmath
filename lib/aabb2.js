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
 * BoundingBox2 is an array [left: Number, bottom: Number, right: Number, top: Number, nomalized: Boolean]
 * @returns {AABB}
 */
function create(l, b, r, t) {
    var out = [l, b, r, t, false];
    normalize(out, out);
    return out;
}
/**
 * @returns {AABB}
 */
function fromSegment2(seg2) {
    var out = [seg2[0], seg2[1], seg2[2], seg2[3], false];
    normalize(out, out);
    return out;
}
/**
 * @returns {AABB}
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
 * @returns {AABB}
 */
function fromRectangle(rect) {
    var out = [rect[0][0], rect[0][1], rect[1][0], rect[1][1], false];
    normalize(out, out);
    return out;
}
/**
 * inspired on: http://jsfiddle.net/4VCVX/3/
 * @todo implement a more robust / fast algorithm http://stackoverflow.com/questions/2587751/an-algorithm-to-find-bounding-box-of-closed-bezier-curves Timo answer
 * @returns {AABB}
 */
function fromBeizer(beizer, npoints) {
    npoints = npoints || 40;
    var vec2_list = Beizer.get(beizer, npoints),
        i,
        l = Infinite,
        b = Infinite,
        r = -Infinite,
        t = -Infinite,
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
 * @returns {AABB}
 */
function zero() {
    return [0, 0, 0, 0, true];
}
/**
 * @returns {AABB}
 */
function clone(aabb2) {
    return [aabb2[0], aabb2[1], aabb2[2], aabb2[3], aabb2[4]];
}
/**
 * @returns {AABB}
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
 * @returns {AABB}
 */
function expand(out, aabb2, margin) {
    out[0] = aabb2[0] - margin;
    out[1] = aabb2[1] - margin;
    out[2] = aabb2[2] + margin;
    out[3] = aabb2[3] + margin;

    return out;
}
/**
 * @returns {AABB}
 */
function merge(out, aabb2_1, aabb2_2) {
    out[0] = min(aabb2_1[0], aabb2_2[0]);
    out[1] = min(aabb2_1[1], aabb2_2[1]);
    out[2] = max(aabb2_1[2], aabb2_2[2]);
    out[3] = max(aabb2_1[3], aabb2_2[3]);

    return out;
}
/**
 * @returns {AABB}
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
 * @returns {AABB}
 */
function osMerge(out, aabb2_1, aabb2_2, vec2_offset, vec2_scale) {
    out[0] = min(aabb2_1[0], (aabb2_2[0] * vec2_scale[0]) + vec2_offset[0]);
    out[1] = min(aabb2_1[1], (aabb2_2[1] * vec2_scale[1]) + vec2_offset[1]);
    out[2] = max(aabb2_1[2], (aabb2_2[2] * vec2_scale[0]) + vec2_offset[0]);
    out[3] = max(aabb2_1[3], (aabb2_2[3] * vec2_scale[1]) + vec2_offset[1]);

    return out;
}
/**
 * @returns {Number}
 */
function area(aabb2) {
    return (aabb2.r - aabb2.l) * (aabb2.t - aabb2.b);
}
/**
 * @returns {AABB}
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
 * @returns {AABB}
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
 * @returns {Vec2}
 */
function clampVec(out_vec2, aabb2, vec2) {
    out_vec2[0] = min(max(aabb2.l, vec2[0]), aabb2.r);
    out_vec2[1] = min(max(aabb2.b, vec2[1]), aabb2.t);

    return out_vec2;
}

function center(out_vec2, aabb2) {
    out_vec2[0] = (aabb2[0] + aabb2[1]) * 0.5;
    out_vec2[1] = (aabb2[3] + aabb2[2]) * 0.5;

    return out_vec2;
}

/**
 * alignament values: AABB2.TOPLEFT, AABB2.TOPMIDDLE, AABB2.TOPRIGHT, AABB2.CENTERLEFT, AABB2.CENTER, AABB2.CENTERRIGHT, AABB2.BOTTOMLEFT, AABB2.BOTTOM, AABB2.BOTTOMRIGH
 * @returns {Vec2}
 */
function align(out_vec2, aabb2, alignament) {
    switch (alignament) {
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
 * @return {Boolean}
 */
function isVec2Inside(aabb2, vec2) {
    return aabb2[0] < vec2[0] && aabb2[2] > vec2[0] && aabb2[1] < vec2[1] && aabb2[3] > vec2[1];
}
/**
 * @return {Boolean}
 */
function isAABB2Inside(aabb2, aabb2_2) {
    return aabb2[0] <= aabb2_2[0] &&
        aabb2[1] <= aabb2_2[1] &&
        aabb2_2[2] <= aabb2[2] &&
        aabb2_2[3] <= aabb2[3];
}
/**
 * @returns {Number}
 */
function perimeter(aabb2) {
    return (aabb2[2] - aabb2[0]) * 2 + (aabb2[3] - aabb2[1]) * 2 ;
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

    // alias
    contains: isAABB2Inside
};

module.exports = AABB2;