/**!
* @source https://github.com/jriecken/sat-js
* @reference http://physics2d.com/content/separation-axis
*
* Version 0.4.1 - Copyright 2014 -  Jim Riecken <jimr@jimr.ca>
* Released under the MIT License
* Adapted to js-2dmath by Luis Lafuente <llafuente@noboxout.com>
*
* A simple library for determining intersections of circles and polygons using the Separating Axis Theorem.
*/

var Vec2 = require("../vec2.js"),
    Polygon = require("../polygon.js"),
    vec2_dot = Vec2.dot,
    vec2_sub = Vec2.sub,
    vec2_length = Vec2.length,
    vec2_lengthSq = Vec2.lengthSq,
    vec2_copy = Vec2.copy,
    vec2_normalize = Vec2.normalize,
    vec2_negate = Vec2.negate,
    vec2_scale = Vec2.scale,
    vec2_perp = Vec2.perp,

    abs = Math.abs,
    sqrt = Math.sqrt;

/**
 * ## Response
 *
 * An object representing the result of an intersection. Contains:
 *  * The two objects participating in the intersection
 *  * The Vec2 representing the minimum change necessary to extract the first object from the second one (as well as a unit Vec2 in that direction and the magnitude of the overlap)
 *  * Whether the first object is entirely inside the second, and vice versa.
 *
 * @constructor
 */
function Response() {
    this.penetrationN = [0, 0];
    this.penetrationV = [0, 0];
}

Response.prototype.a = null;
Response.prototype.b = null;
Response.prototype.aInB = true;
Response.prototype.bInA = true;
Response.prototype.penetration = Number.MAX_VALUE;
Response.prototype.penetrationN = null;
Response.prototype.penetrationV = null;


/**
 * Set some values of the response back to their defaults.  Call this between tests if
 * you are going to reuse a single Response object for multiple intersection tests (recommented
 * as it will avoid allcating extra memory)
 *
 * @return {Response} This for chaining
 */
Response.prototype.clear = function () {
    this.aInB = true;
    this.bInA = true;
    this.penetration = Number.MAX_VALUE;

    return this;
};

// Unit square polygon used for polygon hit detection.
/**
 * @type {Polygon}
 */
var UNIT_SQUARE = [[1, 0], [1, 1], [0, 1], [0, 0]],
    UNIT_SQUARE_MOVED = [[1, 0], [1, 1], [0, 1], [0, 0]];

// ## Helper Functions

/**
 * Flattens the specified array of points onto a unit vector axis,
 * resulting in a one dimensional range of the minimum and
 * maximum value on that axis.
 *
 * @param {Array.<Vec2>} points The points to flatten.
 * @param {Vec2} normal The unit vector axis to flatten on.
 * @param {Array.<number>} result An array. After calling this function, result[0] will be the minimum value, result[1] will be the maximum value.
 */
function _flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE,
        max = -Number.MAX_VALUE,
        len = points.length,
        i = 0,
        dot;

    for (; i < len; ++i) {
        // The magnitude of the projection of the point onto the normal
        dot = vec2_dot(points[i], normal);
        if (dot < min) { min = dot; }
        if (dot > max) { max = dot; }
    }

    result[0] = min;
    result[1] = max;
}

var rangeA = [0, 0],
    rangeB = [0, 0],
    offsetV = [0, 0];

/**
 * Check whether two convex polygons are separated by the specified
 * axis (must be a unit vector).
 *
 * @param {Vec2} a_pos The position of the first polygon.
 * @param {Vec2} b_pos The position of the second polygon.
 * @param {Array.<Vec2>} a_points The points in the first polygon.
 * @param {Array.<Vec2>} b_points The points in the second polygon.
 * @param {Vec2} axis The axis (unit sized) to test against.  The points of both polygons will be projected onto this axis.
 * @param {Response=} response A Response object (optional) which will be populated if the axis is not a separating axis.
 * @return {Boolean} true if it is a separating axis, false otherwise.  If false, and a response is passed in, information about how much overlap and the direction of the overlap will be populated.
 */
function _isSeparatingAxis(out_response, a_pos, b_pos, a_points, b_points, axis) {
    // The magnitude of the offset between the two polygons
    vec2_sub(offsetV, b_pos, a_pos);
    var projectedOffset = vec2_dot(offsetV, axis);
    // Project the polygons onto the axis.
    _flattenPointsOn(a_points, axis, rangeA);
    _flattenPointsOn(b_points, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.

    var overlap = 0,
        option1,
        option2;
    // A starts further left than B
    if (rangeA[0] < rangeB[0]) {
        out_response.aInB = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) {
            overlap = rangeA[1] - rangeB[0];
            out_response.bInA = false;
        // B is fully inside A.  Pick the shortest way out.
        } else {
            option1 = rangeA[1] - rangeB[0];
            option2 = rangeB[1] - rangeA[0];
            overlap = option1 < option2 ? option1 : -option2;
        }
    // B starts further left than A
    } else {
        out_response.bInA = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) {
            overlap = rangeA[0] - rangeB[1];
            out_response.aInB = false;
        // A is fully inside B.  Pick the shortest way out.
        } else {
            option1 = rangeA[1] - rangeB[0];
            option2 = rangeB[1] - rangeA[0];
            overlap = option1 < option2 ? option1 : -option2;
        }
    }
    // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
    var absOverlap = abs(overlap);

    if (absOverlap < out_response.penetration) {
        out_response.penetration = absOverlap;
        vec2_copy(out_response.penetrationN, axis);
        if (overlap < 0) {
            vec2_negate(out_response.penetrationN, out_response.penetrationN);
        }
    }

    return false;
}

// Calculates which Vornoi region a point is on a line segment.
// It is assumed that both the line and the point are relative to `(0,0)`
//
//            |       (0)      |
//     (-1)  [S]--------------[E]  (1)
//            |       (0)      |
/**
 * @param {Vec2} line The line segment.
 * @param {Vec2} point The point.
 * @return  {Number} LEFT_VORNOI_REGION (-1) if it is the left region, MIDDLE_VORNOI_REGION (0) if it is the middle region, RIGHT_VORNOI_REGION (1) if it is the right region.
 */
function _vornoiRegion(line, point) {
    var len2 = vec2_lengthSq(line),
        dp = vec2_dot(point, line);
    // If the point is beyond the start of the line, it is in the
    // left vornoi region.
    if (dp < 0) { return LEFT_VORNOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right vornoi region.
    else if (dp > len2) { return RIGHT_VORNOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORNOI_REGION; }
}
// Constants for Vornoi regions
/**
 * @const
 */
var LEFT_VORNOI_REGION = -1;
/**
 * @const
 */
var MIDDLE_VORNOI_REGION = 0;
/**
 * @const
 */
var RIGHT_VORNOI_REGION = 1;

// ## Collision Tests

var pic_differenceV = [0, 0];
/**
 * Check if a point is inside a circle.
 *
 * @param {Vec2} vec2 The point to test.
 * @param {Circle} circle The circle to test.
 * @return {Boolean} true if the point is inside the circle, false if it is not.
 */
function getPointInCircle(vec2, circle) {
    vec2_sub(pic_differenceV, vec2, circle[0]);

    // If the distance between is smaller than the radius then the point is inside the circle.
    return vec2_lengthSq(pic_differenceV) <= (circle[1] * circle[1]);
}

/**
 * Check if a point is inside a convex polygon.
 *
 * @param {Vec2} p The point to test.
 * @param {Polygon} poly The polygon to test.
 * @return {Boolean} true if the point is inside the polygon, false if it is not.
 */
function getPointInPolygon(out_response, vec2, poly) {
    Polygon.translate(UNIT_SQUARE_MOVED, UNIT_SQUARE, vec2);
    out_response.clear();

    var result = getPolygonPolygon(out_response, UNIT_SQUARE_MOVED, poly);
    if (result) {
        result = out_response.aInB;
    }
    return result;
}

var cic_differenceV = [0, 0];
/**
 * Check if two circles collide.
 *
 * @param {Response=} out_response Response object that will be populated if the circles intersect.
 * @param {Circle} a The first circle.
 * @param {Circle} b The second circle.
 * @return {Boolean} true if the circles intersect, false if they don't.
 */
function getCircleCircle(out_response, a_circle, b_circle) {
    out_response.clear();

    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    vec2_sub(cic_differenceV, b_circle[0], a_circle[0]);
    var totalRadius = a_circle[1] + b_circle[1],
        totalRadiusSq = totalRadius * totalRadius,
        distanceSq = vec2_lengthSq(cic_differenceV),
        dist;

    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
        return false;
    }

    // They intersect.  If we're calculating a response, calculate the overlap.
    dist = sqrt(distanceSq);
    out_response.a = a_circle;
    out_response.b = b_circle;
    out_response.penetration = totalRadius - dist;

    vec2_normalize(cic_differenceV, cic_differenceV);
    vec2_copy(out_response.penetrationN, cic_differenceV);
    vec2_scale(out_response.penetrationV, cic_differenceV, out_response.penetration);

    out_response.aInB = a_circle[1] <= b_circle[1] && dist <= b_circle[1] - a_circle[1];
    out_response.bInA = b_circle[1] <= a_circle[1] && dist <= a_circle[1] - b_circle[1];

    return true;
}

var pc_circlePos = [0, 0],
    edge =  [0, 0],
    point =  [0, 0],
    point2 =  [0, 0],
    normal = [0, 0];

/**
 * Check if a polygon and a circle collide.
 *
 * @param {Polygon} polygon The polygon.
 * @param {Circle} circle The circle.
 * @param {Response=} response Response object (optional) that will be populated if they interset.
 * @return {Boolean} true if they intersect, false if they don't.
 */
function getPolygonCircle(out_response, poly_points, poly_edges, poly_pos, circle) {
    out_response.clear();

    // Get the position of the circle relative to the polygon.
    vec2_sub(pc_circlePos, circle[0], poly_pos);

    var radius = circle[1],
        radius2 = radius * radius,
        len = poly_points.length,
        dist,
        i = 0;

    // For each edge in the polygon:
    for (; i < len; i++) {
        var next = i === len - 1 ? 0 : i + 1;
        var prev = i === 0 ? len - 1 : i - 1;
        var overlap = 0;
        var overlapN = null;

        // Get the edge.
        vec2_copy(edge, poly_edges[i]);
        // Calculate the center of the circle relative to the starting point of the edge.
        vec2_sub(point, pc_circlePos, poly_points[i]);

        // If the distance between the center of the circle and the point
        // is bigger than the radius, the polygon is definitely not fully in
        // the circle.
        if (vec2_lengthSq(point) > radius2) {
            out_response.aInB = false;
        }

        // Calculate which Vornoi region the center of the circle is in.
        var region = _vornoiRegion(edge, point);
        // If it's the left region:
        if (region === LEFT_VORNOI_REGION) {
            // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
            vec2_copy(edge, poly_edges[prev]);
            // Calculate the center of the circle relative the starting point of the previous edge
            vec2_sub(point2, pc_circlePos, poly_points[prev]);
            region = _vornoiRegion(edge, point2);
            if (region === RIGHT_VORNOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                dist = vec2_length(point);
                if (dist > radius) {
                    // No intersection
                    return false;
                } else {
                    // It intersects, calculate the overlap.
                    out_response.bInA = false;
                    overlapN = [0, 0];
                    vec2_normalize(overlapN, point);
                    overlap = radius - dist;
                }
            }
        // If it's the right region:
        } else if (region === RIGHT_VORNOI_REGION) {
            // We need to make sure we're in the left region on the next edge
            vec2_copy(edge, poly_edges[next]);
            // Calculate the center of the circle relative to the starting point of the next edge.
            vec2_sub(point, pc_circlePos, poly_points[next]);
            region = _vornoiRegion(edge, point);
            if (region === LEFT_VORNOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                dist = vec2_length(point);
                if (dist > radius) {
                    // No intersection
                    return false;
                } else {
                    // It intersects, calculate the overlap.
                    out_response.bInA = false;
                    overlapN = [0, 0];
                    vec2_normalize(overlapN, point);
                    overlap = radius - dist;
                }
            }
        // Otherwise, it's the middle region:
        } else {
            // Need to check if the circle is intersecting the edge,
            // Change the edge into its "edge normal".
            vec2_normalize(normal, vec2_perp(edge, edge));
            // Find the perpendicular distance between the center of the
            // circle and the edge.
            dist = vec2_dot(point, normal);
            var distAbs = abs(dist);
            // If the circle is on the outside of the edge, there is no intersection.
            if (dist > 0 && distAbs > radius) {
                // No intersection
                return false;
            } else {
                // It intersects, calculate the overlap.
                overlapN = normal;
                overlap = radius - dist;
                // If the center of the circle is on the outside of the edge, or part of the
                // circle is on the outside, the circle is not fully inside the polygon.
                if (dist >= 0 || overlap < 2 * radius) {
                    out_response.bInA = false;
                }
            }
        }

        // If this is the smallest overlap we've seen, keep it.
        // (overlapN may be null if the circle was in the wrong Vornoi region).
        if (overlapN && abs(overlap) < abs(out_response.penetration)) {
            out_response.penetration = overlap;
            vec2_copy(out_response.penetrationN, overlapN);
        }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
    out_response.a = poly_points;
    out_response.b = circle;
    vec2_scale(out_response.penetrationV, out_response.penetrationN, out_response.penetration);

    return true;
}

/**
 * Check if a circle and a polygon collide.
 * *NOTE:** This is slightly less efficient than polygonCircle as it just
 * runs polygonCircle and reverses everything at the end.
 *
 * @param {Circle} circle The circle.
 * @param {Polygon} polygon The polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {Boolean} true if they intersect, false if they don't.
 */
function getCirclePolygon(out_response, circle, poly) {
    out_response.clear();

    // Test the polygon against the circle.
    var result = getPolygonCircle(out_response, poly, circle);

    if (result) {
        // Swap A and B in the response.
        var a = out_response.a;
        var aInB = out_response.aInB;
        vec2_negate(out_response.penetrationN, out_response.penetrationN);
        vec2_negate(out_response.penetrationV, out_response.penetrationV);
        out_response.a = out_response.b;
        out_response.b = a;
        out_response.aInB = out_response.bInA;
        out_response.bInA = aInB;
    }
    return result;
}

/**
 * Checks whether polygons collide.
 *
 * @param {Polygon} a_points The first polygon points
 * @param {Polygon<normals>} a_normals
 * @param {Polygon<position>} a_pos
 * @param {Polygon} b The second polygon.
 * @param {Response=} response Response object (optional) that will be populated if they interset.
 * @return {Boolean} true if they intersect, false if they don't.
 */
function getPolygonPolygon(out_response, a_points, a_normals, a_pos, b_points, b_normals, b_pos) {
    out_response.clear();

    var aLen = a_points.length,
        bLen = b_points.length,
        i;

    // If any of the edge normals of A is a separating axis, no intersection.
    for (i = 0; i < aLen; ++i) {
        if (_isSeparatingAxis(out_response, a_pos, b_pos, a_points, b_points, a_normals[i])) {
            return false;
        }
        console.log(JSON.stringify(out_response));
    }

    // If any of the edge normals of B is a separating axis, no intersection.
    for (i = 0;i < bLen; ++i) {
        if (_isSeparatingAxis(out_response, a_pos, b_pos, a_points, b_points, b_normals[i])) {
            return false;
        }
        console.log(JSON.stringify(out_response));
    }

    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap vector.
    vec2_scale(out_response.penetrationV, out_response.penetrationN, out_response.penetration);

    return true;
}

var SAT = {
    Response: Response,
    getPointInCircle: getPointInCircle,
    getPointInPolygon: getPointInPolygon,
    getCircleCircle: getCircleCircle,
    getPolygonCircle: getPolygonCircle,
    getCirclePolygon: getCirclePolygon,
    getPolygonPolygon: getPolygonPolygon
};

module.exports = SAT;
