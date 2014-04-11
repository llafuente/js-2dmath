var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    within = Vec2.$.within,
    sqrt = Math.sqrt,
    __x,
    __y,
    u = 0;

function create(x1, y1, x2, y2) {
    return [x1, y1, x2, y2];
}

function clone(seg2) {
    return [seg2[0], seg2[1], seg2[2], seg2[3]];
}

function copy(out, seg2) {
    out[0] = seg2[0];
    out[1] = seg2[1];
    out[2] = seg2[2];
    out[3] = seg2[3];

    return out;
}

function translate(out, seg2, vec2) {
    out[0] = seg2[0] + vec2[0];
    out[1] = seg2[1] + vec2[1];
    out[2] = seg2[2] + vec2[0];
    out[3] = seg2[3] + vec2[1];

    return out;
}

function length(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return sqrt(__x * __x + __y * __y);
}

function sqrLength(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return __x * __x + __y * __y;
}



function cross(seg2, vec2) {
    return (seg2[0] - vec2[0]) * (seg2[3] - vec2[1]) - (seg2[1] - vec2[1]) * (seg2[2] - vec2[0]);
}

function collinear(seg2, vec2) {
    return (seg2[2] - seg2[0]) * (vec2[1] - vec2[1]) === (vec2[0] - seg2[0]) * (seg2[3] - seg2[1]);
}


function inside(seg2, vec2) {
    return collinear(seg2, vec2) && Vec2.within([seg2[0], seg2[1]], vec2, [seg2[2], seg2[3]]);
}

function closestPoint(out, seg2, vec2) {
    return $closestPoint(out, seg2[0], seg2[1], seg2[2], seg2[3], vec2[0], vec2[1]);
}


function $closestPoint(out, x1, y1, x2, y2, x3, y3) {
    __x = x2 - x1;
    __y = y2 - y1;

    u = ((x3 - x1) * __x + (y3 - y1) * __y) / (__x * __x + __y * __y);

    if (u > 1) {
        u = 1;
    } else if (u < 0) {
        u = 0;
    }

    out[0] = (x1 + u * __x);
    out[1] = (y1 + u * __y);

    return out;
}

function $collinear(x1, y1, x2, y2, x3, y3) {
    return (x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1);
}

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


if ("undefined" !== typeof module) {
    module.exports = Segment2;
}