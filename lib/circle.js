/**
 * Stability: 1 (Only additions & fixes)
 *
 * Circle is represented as a two coordinates array
 * [c:Vec2, r:Number]
 */

var Vec2 = require("./vec2.js"),
    vec2_sub = Vec2.sub,
    vec2_distance = Vec2.distance,
    vec2_distance_sq = Vec2.distanceSq,
    vec2_midpoint = Vec2.midPoint,

    Rectangle = require("./rectangle.js"),
    rectangle_center = Rectangle.center,

    Triangle = require("./triangle.js"),
    triangle_circumcenter = Triangle.circumcenter,
    triangle_center = Triangle.center,
    triangle_abmidpoint = Triangle.abMidPoint,
    triangle_bcmidpoint = Triangle.bcMidPoint,
    triangle_camidpoint = Triangle.caMidPoint,

    max = Math.max,
    TWOPI = Math.TWOPI,
    PI = Math.PI,
    sqrt = Math.sqrt,
    aux_vec2 = [0, 0],
    aux_num,
    aux_num2;
/**
 * @returns {Circle}
 */
function create(x, y, radius) {
    return [[x, y], radius];
}
/**
 * @returns {Circle}
 */
function fromVec2(vec2, radius) {
    return [[vec2[0], vec2[1]], radius];
}
/**
 * Create a Circle with seg2 as diameter
 * @returns {Circle}
 */
function fromSegment2(seg2) {
    var out = [[0, 0], 0];

    out[0][0] = (seg2[0] + seg2[2]) * 0.5;
    out[0][1] = (seg2[1] + seg2[3]) * 0.5;

    //subtract
    aux_num = out[0][0] - seg2[0];
    aux_num2 = out[0][1] - seg2[1];
    //sqrLength
    out[1] = sqrt(aux_num * aux_num + aux_num2 * aux_num2);

    return out;
}
/**
 * @returns {Circle}
 */
function fromRectangle(rect, inside) {
    var out = [[0, 0], 0];
    rectangle_center(out[0], rect);

    if (inside) {
        aux_vec2[0] = rect[0][0] + (rect[1][0] - rect[0][0]) * 0.5;
        aux_vec2[1] = rect[0][1];

        out[1] = vec2_distance(out[0], aux_vec2);
    } else {
        out[1] = vec2_distance(out[0], rect[0]);
    }

    return out;
}
/**
 * @todo review inside cases
 * @returns {Circle}
 */
function fromTriangle(tri, inside, circumcenter) {
    var out = [[0, 0], 0];

    if (circumcenter && !inside) {
        triangle_circumcenter(out[0], tri);

        // use distance^2 for comparison
        out[1] = vec2_distance_sq(out[0], tri[0]);
        aux_num = vec2_distance_sq(out[0], tri[1]);
        if (aux_num > out[1]) {
            out[1] = aux_num;
        }
        out[1] = vec2_distance_sq(out[0], tri[2]);
        if (aux_num > out[1]) {
            out[1] = aux_num;
        }
        // and now return the good one :)
        out[1] = sqrt(out[1]);

        return out;
    }

    triangle_center(out[0], tri);

    // use distance^2 for comparison
    triangle_abmidpoint(aux_vec2, tri);
    out[1] = vec2_distance_sq(out[0], aux_vec2);

    triangle_bcmidpoint(aux_vec2, tri);
    aux_num = vec2_distance_sq(out[0], aux_vec2);
    if (aux_num < out[1]) {
        out[1] = aux_num;
    }

    triangle_camidpoint(aux_vec2, tri);
    aux_num = vec2_distance_sq(out[0], aux_vec2);
    if (aux_num < out[1]) {
        out[1] = aux_num;
    }

    // and now return the good one :)
    out[1] = sqrt(out[1]);

    return out;
}

/**
 * @returns {Circle}
 */
function clone(circle) {
    return [[circle[0][0], circle[0][1]], circle[1]];
}
/**
 * @returns {Circle}
 */
function copy(out, circle) {
    out[0][0] = circle[0][0];
    out[0][1] = circle[0][1];
    out[1] = circle[1];

    return out;
}
/**
 * @returns {Circle}
 */
function translate(out, circle, vec2) {
    out[0][0] = circle[0][0] + vec2[0];
    out[0][1] = circle[0][1] + vec2[1];
    out[1] = circle[1];

    return out;
}
/**
 * @returns {Circle}
 */
function moveTo(out, circle, vec2) {
    out[0][0] = vec2[0];
    out[0][1] = vec2[1];
    out[1] = circle[1];

    return out;
}
/**
 * @returns {Number}
 */
function distance(circle, circle_2) {
    return max(0, vec2_distance(circle[0], circle_2[0]) - circle[1] - circle_2[1]);
}
/**
 * @returns {Number}
 */
function length(circle) {
    return TWOPI * circle[1];
}
/**
 * @returns {Number}
 */
function area(circle) {
    return PI * circle[1] * circle[1];
}
/**
 * @returns {Boolean}
 */
function isVec2Inside(circle, vec2) {
    return vec2_distance(circle[0], vec2) < circle[1];
}
/**
 * @returns {Vec2}
 */
function closestPoint(out_vec2, circle, vec2) {
    //const Vector& P, const Vector& Centre, float radius, bool* inside)
    vec2_sub(out_vec2, vec2 - cirlce[0]);

    var dist2 = vec2_length(out_vec2);

    // is inside? (dist2 <= radius * radius);

    //if(dist2 > EPS) Delta /= sqrt(dist2);

    vec2_scale(out_vec2, out_vec2, scale);
    vec2_add(out_vec2, cirlce[0], scale);

    return out_vec2;
}
/**
 * @class Circle
 */
var Circle = {
    create: create,
    fromVec2: fromVec2,
    fromSegment2: fromSegment2,
    fromRectangle: fromRectangle,
    fromTriangle: fromTriangle,
    clone: clone,
    copy: copy,
    translate: translate,
    moveTo: moveTo,
    distance: distance,
    length: length,
    area: area,
    isVec2Inside: isVec2Inside,

    // alias
    perimeter: length,
    move: moveTo
};


module.exports = Circle;