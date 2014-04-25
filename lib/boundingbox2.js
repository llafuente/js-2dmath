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
 * @returns {BB2}
 */
function create(l, b, r, t) {
    var out = [l, b, r, t, false];
    normalize(out, out);
    return out;
}
function fromSegment2(seg2) {
    var out = [seg2[0], seg2[1], seg2[2], seg2[3], false];
    normalize(out, out);
    return out;
}
/**
 * @returns {BB2}
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
 * @returns {BB2}
 */
function fromRectangle(rect) {
    var out = [rect[0][0], rect[0][1], rect[1][0], rect[1][1], false];
    normalize(out, out);
    return out;
}
/**
 * inspired on: http://jsfiddle.net/4VCVX/3/
 * @todo implement a more robust / fast algorithm http://stackoverflow.com/questions/2587751/an-algorithm-to-find-bounding-box-of-closed-bezier-curves Timo answer
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
 * @returns {BB2}
 */
function zero() {
    return [0, 0, 0, 0, true];
}
/**
 * @returns {BB2}
 */
function clone(bb2) {
    return [bb2[0], bb2[1], bb2[2], bb2[3], bb2[4]];
}
/**
 * @returns {BB2}
 */
function copy(out, bb2) {
    out[0] = bb2[0];
    out[1] = bb2[1];
    out[2] = bb2[2];
    out[3] = bb2[3];
    out[4] = bb2[4];

    return out;
}
/**
 * @returns {BB2}
 */
function merge(out, bb2_1, bb2_2) {
    out[0] = min(bb2_1[0], bb2_2[0]);
    out[1] = min(bb2_1[1], bb2_2[1]);
    out[2] = max(bb2_1[2], bb2_2[2]);
    out[3] = max(bb2_1[3], bb2_2[3]);

    return out;
}
/**
 * @returns {BB2}
 */
function offsetMerge(out, bb2_1, bb2_2, vec2_offset) {
    out[0] = min(bb2_1[0], bb2_2[0] + vec2_offset[0]);
    out[1] = min(bb2_1[1], bb2_2[1] + vec2_offset[1]);
    out[2] = max(bb2_1[2], bb2_2[2] + vec2_offset[0]);
    out[3] = max(bb2_1[3], bb2_2[3] + vec2_offset[1]);

    return out;
}
/**
 * offset & scale merge
 * @returns {BB2}
 */
function osMerge(out, bb2_1, bb2_2, vec2_offset, vec2_scale) {
    out[0] = min(bb2_1[0], (bb2_2[0] * vec2_scale[0]) + vec2_offset[0]);
    out[1] = min(bb2_1[1], (bb2_2[1] * vec2_scale[1]) + vec2_offset[1]);
    out[2] = max(bb2_1[2], (bb2_2[2] * vec2_scale[0]) + vec2_offset[0]);
    out[3] = max(bb2_1[3], (bb2_2[3] * vec2_scale[1]) + vec2_offset[1]);

    return out;
}
/**
 * @returns {Number}
 */
function area(bb2) {
    return (bb2.r - bb2.l) * (bb2.t - bb2.b);
}
/**
 * @returns {BB2}
 */
function normalize(out, bb2) {
    min_x = bb2[0] > bb2[2] ? bb2[2] : bb2[0];
    max_x = bb2[0] > bb2[2] ? bb2[0] : bb2[2];
    min_y = bb2[1] > bb2[3] ? bb2[3] : bb2[1];
    max_y = bb2[1] > bb2[3] ? bb2[1] : bb2[3];

    out[0] = min_x;
    out[1] = min_y;

    out[2] = max_x;
    out[3] = max_y;

    out[4] = true;

}
/**
 * @returns {BB2}
 */
function translate(out, bb2, vec2) {
    x = vec2[0];
    y = vec2[1];

    out[0] = bb2[0] + x;
    out[1] = bb2[1] + y;
    out[2] = bb2[2] + x;
    out[3] = bb2[3] + y;

    return out;
}
/**
 * @returns {Vec2}
 */
function clampVec(out_vec2, bb2, vec2) {
    out_vec2[0] = min(max(bb2.l, vec2[0]), bb2.r);
    out_vec2[1] = min(max(bb2.b, vec2[1]), bb2.t);

    return out_vec2;
}

/**
 * alignament values: BB2.TOPLEFT, BB2.TOPMIDDLE, BB2.TOPRIGHT, BB2.CENTERLEFT, BB2.CENTER, BB2.CENTERRIGHT, BB2.BOTTOMLEFT, BB2.BOTTOM, BB2.BOTTOMRIGH
 * @returns {Vec2}
 */
function align(out_vec2, bb2, alignament) {
    switch (alignament) {
    case TOPLEFT:
        // do nothing!
        out_vec2[0] = bb2[0];
        out_vec2[1] = bb2[1];
        break;
    case TOPMIDDLE:
        out_vec2[0] = (bb2[2] - bb2[0]) * 0.5 + bb2[0];
        out_vec2[1] = bb2[1];
        break;
    case TOPRIGHT:
        out_vec2[0] = bb2[2];
        out_vec2[1] = bb2[1];
        break;

    case CENTERLEFT:
        out_vec2[0] = bb2[0];
        out_vec2[1] = (bb2[3] - bb2[1]) * 0.5 + bb2[1];
        break;
    case CENTER:
        out_vec2[0] = (bb2[2] - bb2[0]) * 0.5 + bb2[0];
        out_vec2[1] = (bb2[3] - bb2[1]) * 0.5 + bb2[1];
        break;
    case CENTERRIGHT:
        out_vec2[0] = bb2[2];
        out_vec2[1] = (bb2[3] - bb2[1]) * 0.5 + bb2[1];
        break;

    case BOTTOMLEFT:
        out_vec2[0] = bb2[0];
        out_vec2[1] = bb2[3];
        break;
    case BOTTOM:
        out_vec2[0] = (bb2[2] - bb2[0]) * 0.5 + bb2[0];
        out_vec2[1] = bb2[3];
        break;
    case BOTTOMRIGHT:
        out_vec2[0] = bb2[2];
        out_vec2[1] = bb2[3];
        break;
    }

    return out_vec2;
}

/**
 * @class BB2
 */
var BB2 =  {
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
    merge: merge,
    offsetMerge: offsetMerge,
    osMerge: osMerge,
    area: area,
    normalize: normalize,
    translate: translate,
    clampVec: clampVec,
    align: align,
};


if ("undefined" !== typeof module) {
    module.exports = BB2;
}