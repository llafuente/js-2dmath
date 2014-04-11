var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    max = Math.max,
    TWOPI = Math.TWOPI,
    PI = Math.PI;

function create(x, y, radius) {
    return [[x, y], radius];
}

function clone(circle) {
    return [[circle[0][0], circle[0][1]], circle[1]];
}

function copy(out, circle) {
    out[0][0] = circle[0][0];
    out[0][1] = circle[0][1];
    out[1] = circle[1];

    return out;
}

function translate(out, circle, vec2) {
    out[0][0] = circle[0][0] + vec2[0];
    out[0][1] = circle[0][1] + vec2[1];
    out[1] = circle[1];

    return out;
}

function distance(circle, circle_2) {
    return max(0, Vec2.distance(circle[0], circle_2[0]) - circle[1] - circle_2[1]);
}

function length(circle) {
    return TWOPI * circle[1];
}

function area(circle) {
    return PI * circle[1] * circle[1];
}

var Circle = {
    create: create,
    clone: clone,
    copy: copy,
    translate: translate,
    distance: distance,
    length: length,
    area: area
};


if ("undefined" !== typeof module) {
    module.exports = Circle;
}