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


function create(l, b, r, t) {
    var out = [l, b, r, t, false];
    normalize(out, out);
    return out;
}

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

function fromRectangle(rect) {
    var out = [rect[0][0], rect[0][1], rect[1][0], rect[1][1], false];
    normalize(out, out);
    return out;
}

function zero() {
    return [0, 0, 0, 0, true];
}

function clone(bb2) {
    return [bb2[0], bb2[1], bb2[2], bb2[3], bb2[4]];
}

function copy(out, bb2) {
    out[0] = bb2[0];
    out[1] = bb2[1];
    out[2] = bb2[2];
    out[3] = bb2[3];
    out[4] = bb2[4];

    return out;
}

function merge(out, bb2_1, bb2_2) {
    out[0] = min(bb2_1[0], bb2_2[0]);
    out[1] = min(bb2_1[1], bb2_2[1]);
    out[2] = max(bb2_1[2], bb2_2[2]);
    out[3] = max(bb2_1[3], bb2_2[3]);

    return out;
}

function offsetMerge(out, bb2_1, bb2_2, vec2_offset) {
    out[0] = min(bb2_1[0], bb2_2[0] + vec2_offset[0]);
    out[1] = min(bb2_1[1], bb2_2[1] + vec2_offset[1]);
    out[2] = max(bb2_1[2], bb2_2[2] + vec2_offset[0]);
    out[3] = max(bb2_1[3], bb2_2[3] + vec2_offset[1]);

    return out;
}

// offset & scale merge
function osMerge(out, bb2_1, bb2_2, vec2_offset, vec2_scale) {
    out[0] = min(bb2_1[0], (bb2_2[0] * vec2_scale[0]) + vec2_offset[0]);
    out[1] = min(bb2_1[1], (bb2_2[1] * vec2_scale[1]) + vec2_offset[1]);
    out[2] = max(bb2_1[2], (bb2_2[2] * vec2_scale[0]) + vec2_offset[0]);
    out[3] = max(bb2_1[3], (bb2_2[3] * vec2_scale[1]) + vec2_offset[1]);

    return out;
}

function area(bb2) {
    return (bb2.r - bb2.l) * (bb2.t - bb2.b);
}

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

function translate(out, bb2, vec2) {
    x = vec2[0];
    y = vec2[1];

    out[0] = bb2[0] + x;
    out[1] = bb2[1] + y;
    out[2] = bb2[2] + x;
    out[3] = bb2[3] + y;

    return out;
}

function clampVec(out, bb2, vec2) {
    out[0] = min(max(bb2.l, vec2[0]), bb2.r);
    out[1] = min(max(bb2.b, vec2[1]), bb2.t);

    return out;
}

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

var BB2 =  {
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