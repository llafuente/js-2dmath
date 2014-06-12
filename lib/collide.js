/**
 * Stability: 0 (Anything could happen)
 *
 * This need revision.
 * **inside:Boolean** param must be added to all functions
 * *Note** this not return the contact points, use intersections for that.
 *
 * @source http://members.gamedev.net/oliii/satpost/SpherePolygonCollision.cpp
 */

var Vec2 = require("./vec2.js"),
    vec2_distance = Vec2.distance,
    vec2_distance_sq = Vec2.distanceSq,
    vec2_midpoint = Vec2.midPoint,
    vec2_$near = Vec2.$near,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,

    Segment2 = require("./segment2.js"),
    Segment2_$closestPoint = Segment2.$closestPoint,

    aux_vec2 = [0, 0],
    ca = [0, 0],
    ba = [0, 0],
    pa = [0, 0],

    EPS = Math.EPS = 0.001;

/**
 * @param {Number} num
 * @param {Number} num2
 * @param {Number} dist
 */
function _near(num, num2, dist) {
    return num > num2 - dist && num < num2 + dist;
}

/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 */
function _rectangle_vec2(x1, y1, x2, y2, x3, y3) {
    return (x1 > x3 || x2 < x3 || y1 > y3 || y2 < y3) ? false : true;
}
/**
 * @param {AABB2} bb2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function bb2_vec2(bb2, vec2) {
    return _rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1]);
}
/**
 * @param {Vec2} vec2
 * @param {AABB2} bb2
 * @return {Boolean}
 */
function vec2_bb2(vec2, bb2) {
    return _rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1]);
}
/**
 * @param {Rectangle} rect
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function rectangle_vec2(rect, vec2) {
    var tl = rect[0], br = rect[1];
    return _rectangle_vec2(tl[0], tl[1], br[0], br[1], vec2[0], vec2[1]);
}
/**
 * @param {Vec2} vec2
 * @param {Rectangle} rect
 * @return {Boolean}
 */
function vec2_rectangle(vec2, rect) {
    var tl = rect[0], br = rect[1];
    return _rectangle_vec2(tl[0], tl[1], br[0], br[1], vec2[0], vec2[1]);
}

/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @benchmark
 * @return {Boolean}
 */
function segment2_vec2(seg2, vec2) {
    var x = vec2[0],
        y = vec2[1];

    Segment2_$closestPoint(aux_vec2, seg2[0], seg2[1], seg2[2], seg2[3], x, y);

    return vec2_$near(aux_vec2[0], aux_vec2[1], x, y);
}
/**
 * @param {Vec2} vec2
 * @param {Segment2} seg2
 * @return {Boolean}
 */
function vec2_segment2(vec2, seg2) {
    return segment2_vec2(seg2, vec2);
}
/**
 * @param {Vec2} vec2
 * @param {Line2} line2
 * @return {Boolean}
 */
function vec2_line2(vec2, line2) {
    //return _near(vec2[1], line2[1] * vec2[0] - line2[0][1]);
    var p = line2[0];
    return _near(line2[1], (vec2[1] - p[1]) / (vec2[0] - p[0]), EPS);
}

/**
 * @param {Line2} line2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function line2_vec2(line2, vec2) {
    //return _near(vec2[1], line2[1] * vec2[0] - line2[0][1]);
    var p = line2[0];
    return _near(line2[1], (vec2[1] - p[1]) / (vec2[0] - p[0]), EPS);
}



/**
 * @param {Circle} circle_1
 * @param {Circle} circle_2
 * @return {Boolean}
 */
function circle_circle(circle_1, circle_2) {
    strict = strict || false;

    var // Determine minimum and maximum radius where circles can intersect
        r_max = circle_1[1] + circle_2[1],
        // Determine actual distance between circle circles
        c_dist_sq = Vec2.distanceSq(circle_1[0], circle_2[0]);

    if (c_dist_sq > r_max * r_max) {
        return false;
    }

    return true;
}

/**
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function circle_vec2(circle, vec2) {
    var distance_to_center = vec2_distance_sq(circle[0], vec2),
        r = circle[1],
        r2 = r * r;

    return distance_to_center <= r2;
}
/**
 * @param {Vec2} vec2
 * @param {Circle} circle
 * @return {Boolean}
 */
function vec2_circle(vec2, circle) {
    circle_vec2(circle, vec2);
}
/**
 * @param {Triangle} tri
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function triangle_vec2(tri, vec2) {
    // Compute vectors
    ca = vec2_sub(tri[2], tri[0]); // v0 = C - A
    ba = vec2_sub(tri[1], tri[0]); // v1 = B - A
    pa = vec2_sub(vec2, tri[0]); // v2 = P - A

    // Compute dot products
    var dot00 = vec2_dot(ca, ca); //dot00 = dot(v0, v0)
    var dot01 = vec2_dot(ca, ba); //dot01 = dot(v0, v1)
    var dot02 = vec2_dot(ca, pa); //dot02 = dot(v0, v2)
    var dot11 = vec2_dot(ba, ba); //dot11 = dot(v1, v1)
    var dot12 = vec2_dot(ba, pa); //dot12 = dot(v1, v2)

    // Compute barycentric coordinates
    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);

}
/**
 * @param {Vec2} vec2
 * @param {Triangle} tri
 * @return {Boolean}
 */
function vec2_triangle(vec2, tri) {
    return triangle_vec2(tri, vec2)
}

/**
 * @param {Vec2} vec2
 * @param {Vec2} vec2_2
 * @return {Boolean}
 */
function vec2_vec2(vec2, vec2_2) {
    return _near(vec2[0], vec2_2[0], EPS) &&
        _near(vec2[1], vec2_2[1], EPS);
}

var Collide = {
    circle_circle: circle_circle,

    //
    // vec2 against the world!
    //
    bb2_vec2: bb2_vec2,
    vec2_bb2: vec2_bb2,

    rectangle_vec2: rectangle_vec2,
    vec2_rectangle: vec2_rectangle,

    segment2_vec2: segment2_vec2,
    vec2_segment2: vec2_segment2,

    circle_vec2: circle_vec2,
    vec2_circle: vec2_circle,

    vec2_line2: vec2_line2,
    line2_vec2: line2_vec2,

    triangle_vec2: triangle_vec2,
    vec2_triangle: vec2_triangle,

    vec2_vec2: vec2_vec2,
};

module.exports = Collide;

/*
var primitives = ["circle", "rectangle", "vec2", "line2", "segment2", "bb2", "triangle"],
    i,
    j,
    fn;
for (i = 0; i < primitives.length; ++i) {
    for (j = 0; j < primitives.length; ++j) {
        fn = primitives[i] + "_" + primitives[j];
        if (!Collisions[fn]) {
            console.log("todo: Collisions.", fn);
        }
    }

}

console.log(vec2_line2([1, 1], [[0,0], 1]));
console.log(vec2_line2([1, 2], [[0,0], 2]));

*/