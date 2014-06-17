/**
* @source https://github.com/jriecken/sat-js
* Version 0.4.1 - Copyright 2014 -  Jim Riecken <jimr@jimr.ca>
* Released under the MIT License
* Adapted to js-2dmath Luis Lafuente <llafuente@noboxout.com>
*
* A simple library for determining intersections of circles and
* polygons using the Separating Axis Theorem.
*/

/** @preserve SAT.js - Version 0.4.1 - Copyright 2014 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

var Vec2 = require("../vec2.js");

/**
 * ## Response
 *
 * An object representing the result of an intersection. Contains:
 *  - The two objects participating in the intersection
 *  - The vector representing the minimum change necessary to extract the first object
 *    from the second one (as well as a unit vector in that direction and the magnitude
 *    of the overlap)
 *  - Whether the first object is entirely inside the second, and vice versa.
 *
 * @constructor
 */  
function Response() {
  this['overlapN'] = [0, 0];
  this['overlapV'] = [0, 0];
}

Response.prototype.a = null;
Response.prototype.b = null;
Response.prototype.aInB = true;
Response.prototype.bInA = true;
Response.prototype.overlap = Number.MAX_VALUE;
Response.prototype.overlapN = null;
Response.prototype.overlapV = null;


// Set some values of the response back to their defaults.  Call this between tests if
// you are going to reuse a single Response object for multiple intersection tests (recommented
// as it will avoid allcating extra memory)
/**
 * @return {Response} This for chaining
 */
Response.prototype['clear'] = Response.prototype.clear = function() {
  this['aInB'] = true;
  this['bInA'] = true;
  this['overlap'] = Number.MAX_VALUE;
  return this;
};

// ## Object Pools

// A pool of `Vector` objects that are used in calculations to avoid
// allocating memory.
/**
 * @type {Array.<Vector>}
 */
var T_VECTORS = [];
for (var i = 0; i < 10; i++) { T_VECTORS.push(Vec2.zero()); }

// A pool of arrays of numbers used in calculations to avoid allocating
// memory.
/**
 * @type {Array.<Array.<number>>}
 */
var T_ARRAYS = [];
for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }

// Temporary response used for polygon hit detection.
/**
 * @type {Response}
 */
var T_RESPONSE = new Response();

// Unit square polygon used for polygon hit detection.
/**
 * @type {Polygon}
 */
var UNIT_SQUARE = [[1, 0], [1, 1], [0, 1], [0, 0]];

// ## Helper Functions

// Flattens the specified array of points onto a unit vector axis,
// resulting in a one dimensional range of the minimum and
// maximum value on that axis.
/**
 * @param {Array.<Vector>} points The points to flatten.
 * @param {Vector} normal The unit vector axis to flatten on.
 * @param {Array.<number>} result An array.  After calling this function,
 *   result[0] will be the minimum value,
 *   result[1] will be the maximum value.
 */
function _flattenPointsOn(points, normal, result) {
  var min = Number.MAX_VALUE;
  var max = -Number.MAX_VALUE;
  var len = points.length;
  for (var i = 0; i < len; i++ ) {
    // The magnitude of the projection of the point onto the normal
    var dot = Vec2.dot(points[i], normal);
    if (dot < min) { min = dot; }
    if (dot > max) { max = dot; }
  }
  result[0] = min; result[1] = max;
}

// Check whether two convex polygons are separated by the specified
// axis (must be a unit vector).
/**
 * @param {Vector} aPos The position of the first polygon.
 * @param {Vector} bPos The position of the second polygon.
 * @param {Array.<Vector>} aPoints The points in the first polygon.
 * @param {Array.<Vector>} bPoints The points in the second polygon.
 * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
 *   will be projected onto this axis.
 * @param {Response=} response A Response object (optional) which will be populated
 *   if the axis is not a separating axis.
 * @return {boolean} true if it is a separating axis, false otherwise.  If false,
 *   and a response is passed in, information about how much overlap and
 *   the direction of the overlap will be populated.
 */
function _isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
  var rangeA = T_ARRAYS.pop();
  var rangeB = T_ARRAYS.pop();
  // The magnitude of the offset between the two polygons
  var offsetV = Vec2.sub(T_VECTORS.pop(), bPos, aPos);
  var projectedOffset = Vec2.dot(offsetV, axis);
  // Project the polygons onto the axis.
  _flattenPointsOn(aPoints, axis, rangeA);
  _flattenPointsOn(bPoints, axis, rangeB);
  // Move B's range to its position relative to A.
  rangeB[0] += projectedOffset;
  rangeB[1] += projectedOffset;
  // Check if there is a gap. If there is, this is a separating axis and we can stop
  if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
    T_VECTORS.push(offsetV); 
    T_ARRAYS.push(rangeA); 
    T_ARRAYS.push(rangeB);
    return true;
  }
  // This is not a separating axis. If we're calculating a response, calculate the overlap.
  if (response) {
    var overlap = 0;
    // A starts further left than B
    if (rangeA[0] < rangeB[0]) {
      response['aInB'] = false;
      // A ends before B does. We have to pull A out of B
      if (rangeA[1] < rangeB[1]) { 
        overlap = rangeA[1] - rangeB[0];
        response['bInA'] = false;
      // B is fully inside A.  Pick the shortest way out.
      } else {
        var option1 = rangeA[1] - rangeB[0];
        var option2 = rangeB[1] - rangeA[0];
        overlap = option1 < option2 ? option1 : -option2;
      }
    // B starts further left than A
    } else {
      response['bInA'] = false;
      // B ends before A ends. We have to push A out of B
      if (rangeA[1] > rangeB[1]) { 
        overlap = rangeA[0] - rangeB[1];
        response['aInB'] = false;
      // A is fully inside B.  Pick the shortest way out.
      } else {
        var option1 = rangeA[1] - rangeB[0];
        var option2 = rangeB[1] - rangeA[0];
        overlap = option1 < option2 ? option1 : -option2;
      }
    }
    // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
    var absOverlap = Math.abs(overlap);
    if (absOverlap < response['overlap']) {
      response['overlap'] = absOverlap;
      Vec2.copy(response['overlapN'], axis);
      if (overlap < 0) {
        Vec2.negate(response['overlapN'], response['overlapN']);
      }
    }      
  }
  T_VECTORS.push(offsetV); 
  T_ARRAYS.push(rangeA); 
  T_ARRAYS.push(rangeB);
  return false;
}

// Calculates which Vornoi region a point is on a line segment.
// It is assumed that both the line and the point are relative to `(0,0)`
//
//            |       (0)      |
//     (-1)  [S]--------------[E]  (1)
//            |       (0)      |
/**
 * @param {Vector} line The line segment.
 * @param {Vector} point The point.
 * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region, 
 *          MIDDLE_VORNOI_REGION (0) if it is the middle region, 
 *          RIGHT_VORNOI_REGION (1) if it is the right region.
 */
function _vornoiRegion(line, point) {
  var len2 = Vec2.lengthSq(line);
  var dp = Vec2.dot(point, line);
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

var v = [0, 0];
// Check if a point is inside a circle.
/**
 * @param {Vector} p The point to test.
 * @param {Circle} c The circle to test.
 * @return {boolean} true if the point is inside the circle, false if it is not.
 */
function pointInCircle(p, c) {
  Vec2.sub(pic_differenceV, p, c[0]);

  // If the distance between is smaller than the radius then the point is inside the circle.
  return Vec2.lengthSq(pic_differenceV) <= (c[1] * c[1]);
}

// Check if a point is inside a convex polygon.
/**
 * @param {Vector} p The point to test.
 * @param {Polygon} poly The polygon to test.
 * @return {boolean} true if the point is inside the polygon, false if it is not.
 */
function pointInPolygon(p, poly) {
  UNIT_SQUARE['pos'].copy(p);
  T_RESPONSE.clear();
  var result = getPolygonPolygon(UNIT_SQUARE, poly, T_RESPONSE);
  if (result) {
    result = T_RESPONSE['aInB'];
  }
  return result;
}

var cic_differenceV = [0, 0];
/**
 * Check if two circles collide.
 * @param {Circle} a The first circle.
 * @param {Circle} b The second circle.
 * @param {Response=} response Response object (optional) that will be populated if
 *   the circles intersect.
 * @return {boolean} true if the circles intersect, false if they don't. 
 */
function getCircleCircle(a, b, response) {
  // Check if the distance between the centers of the two
  // circles is greater than their combined radius.
  Vec2.sub(cic_differenceV, b[0], a[0]);
  var totalRadius = a[1] + b[1];
  var totalRadiusSq = totalRadius * totalRadius;
  var distanceSq = Vec2.lengthSq(cic_differenceV);
  // If the distance is bigger than the combined radius, they don't intersect.
  if (distanceSq > totalRadiusSq) {
    return false;
  }
  // They intersect.  If we're calculating a response, calculate the overlap.
  if (response) { 
    var dist = Math.sqrt(distanceSq);
    response['a'] = a;
    response['b'] = b;
    response['overlap'] = totalRadius - dist;
    
    Vec2.normalize(cic_differenceV, cic_differenceV);
    Vec2.copy(response['overlapN'], cic_differenceV);
    Vec2.scale(response['overlapV'], cic_differenceV, response['overlap']);

    response['aInB']= a[1] <= b[1] && dist <= b[1] - a[1];
    response['bInA'] = b[1] <= a[1] && dist <= a[1] - b[1];
  }
  return true;
}

var pc_circlePos = [0, 0];
/**
 * Check if a polygon and a circle collide.
 * @param {Polygon} polygon The polygon.
 * @param {Circle} circle The circle.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
function getPolygonCircle(polygon, circle, response) {
  // Get the position of the circle relative to the polygon.
  var circlePos = 
  Vec2.sub(pc_circlePos, circle[0], polygon['pos']);
  var radius = circle[1];
  var radius2 = radius * radius;
  var points = polygon['calcPoints'];
  var len = points.length;
  var edge = T_VECTORS.pop();
  var point = T_VECTORS.pop();
  
  // For each edge in the polygon:
  for (var i = 0; i < len; i++) {
    var next = i === len - 1 ? 0 : i + 1;
    var prev = i === 0 ? len - 1 : i - 1;
    var overlap = 0;
    var overlapN = null;
    
    // Get the edge.
    Vec2.copy(edge, polygon['edges'][i]);
    // Calculate the center of the circle relative to the starting point of the edge.
    Vec2.sub(point, pc_circlePos, points[i]);
    
    // If the distance between the center of the circle and the point
    // is bigger than the radius, the polygon is definitely not fully in
    // the circle.
    if (response && Vec2.lengthSq(point) > radius2) {
      response['aInB'] = false;
    }
    
    // Calculate which Vornoi region the center of the circle is in.
    var region = _vornoiRegion(edge, point);
    // If it's the left region:
    if (region === LEFT_VORNOI_REGION) { 
      // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
      Vec2.copy(edge, polygon['edges'][prev]);
      // Calculate the center of the circle relative the starting point of the previous edge
      var point2 = Vec2.sub(T_VECTORS.pop(), pc_circlePos, points[prev]);
      region = _vornoiRegion(edge, point2);
      if (region === RIGHT_VORNOI_REGION) {
        // It's in the region we want.  Check if the circle intersects the point.
        var dist = Vec2.length(point);
        if (dist > radius) {
          // No intersection
          T_VECTORS.push(edge);
          T_VECTORS.push(point); 
          T_VECTORS.push(point2);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          response['bInA'] = false;
          overlapN = [0, 0];
          Vec2.normalize(overlapN, point);
          overlap = radius - dist;
        }
      }
      T_VECTORS.push(point2);
    // If it's the right region:
    } else if (region === RIGHT_VORNOI_REGION) {
      // We need to make sure we're in the left region on the next edge
      Vec2.copy(edge, polygon['edges'][next]);
      // Calculate the center of the circle relative to the starting point of the next edge.
      Vec2.sub(point, pc_circlePos, points[next]);
      region = _vornoiRegion(edge, point);
      if (region === LEFT_VORNOI_REGION) {
        // It's in the region we want.  Check if the circle intersects the point.
        var dist = Vec2.length(point);
        if (dist > radius) {
          // No intersection
          T_VECTORS.push(edge); 
          T_VECTORS.push(point);
          return false;              
        } else if (response) {
          // It intersects, calculate the overlap.
          response['bInA'] = false;
          overlapN = [0, 0];
          Vec2.normalize(overlapN, point);
          overlap = radius - dist;
        }
      }
    // Otherwise, it's the middle region:
    } else {
      // Need to check if the circle is intersecting the edge,
      // Change the edge into its "edge normal".
      var normal;
      normal = Vec2.normalize(edge, Vec2.perp(edge, edge));
      // Find the perpendicular distance between the center of the 
      // circle and the edge.
      var dist = Vec2.dot(point, normal);
      var distAbs = Math.abs(dist);
      // If the circle is on the outside of the edge, there is no intersection.
      if (dist > 0 && distAbs > radius) {
        // No intersection
        T_VECTORS.push(normal); 
        T_VECTORS.push(point);
        return false;
      } else if (response) {
        // It intersects, calculate the overlap.
        overlapN = normal;
        overlap = radius - dist;
        // If the center of the circle is on the outside of the edge, or part of the
        // circle is on the outside, the circle is not fully inside the polygon.
        if (dist >= 0 || overlap < 2 * radius) {
          response['bInA'] = false;
        }
      }
    }
    
    // If this is the smallest overlap we've seen, keep it. 
    // (overlapN may be null if the circle was in the wrong Vornoi region).
    if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
      response['overlap'] = overlap;
      Vec2.copy(response['overlapN'], overlapN);
    }
  }
  
  // Calculate the final overlap vector - based on the smallest overlap.
  if (response) {
    response['a'] = polygon;
    response['b'] = circle;
    Vec2.scale(response['overlapV'], response['overlapN'], response['overlap']);
  }
  T_VECTORS.push(edge); 
  T_VECTORS.push(point);
  return true;
}

// Check if a circle and a polygon collide.
//
// **NOTE:** This is slightly less efficient than polygonCircle as it just
// runs polygonCircle and reverses everything at the end.
/**
 * @param {Circle} circle The circle.
 * @param {Polygon} polygon The polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
function getCirclePolygon(circle, polygon, response) {
  // Test the polygon against the circle.
  var result = getPolygonCircle(polygon, circle, response);
  if (result && response) {
    // Swap A and B in the response.
    var a = response['a'];
    var aInB = response['aInB'];
    Vec2.negate(response['overlapN'], response['overlapN']);
    Vec2.negate(response['overlapV'], response['overlapV']);
    response['a'] = response['b'];
    response['b'] = a;
    response['aInB'] = response['bInA'];
    response['bInA'] = aInB;
  }
  return result;
}

// Checks whether polygons collide.
/**
 * @param {Polygon} aPoints The first polygon.
 * @param {Polygon<normals>} aNormals
 * @param {Polygon<position>} aPos
 * @param {Polygon} b The second polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
function getPolygonPolygon(aPoints, aNormals, aPos, bPoints, bNormals, bPos, response) {
  var aLen = aPoints.length;
  var bLen = bPoints.length;
  // If any of the edge normals of A is a separating axis, no intersection.
  for (var i = 0; i < aLen; i++) {
    if (_isSeparatingAxis(aPos, bPos, aPoints, bPoints, aNormals[i], response)) {
      return false;
    }
  }
  // If any of the edge normals of B is a separating axis, no intersection.
  for (var i = 0;i < bLen; i++) {
    if (_isSeparatingAxis(aPos, bPos, aPoints, bPoints, bNormals[i], response)) {
      return false;
    }
  }
  // Since none of the edge normals of A or B are a separating axis, there is an intersection
  // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
  // final overlap vector.
  if (response) {
    Vec2.scale(response['overlapV'], response['overlapN'], response['overlap']);
  }
  return true;
}

var SAT = {
    Response: Response,
    pointInCircle: pointInCircle,
    pointInPolygon: pointInPolygon,
    getCircleCircle: getCircleCircle,
    getPolygonCircle: getPolygonCircle,
    getCirclePolygon: getCirclePolygon,
    getPolygonPolygon: getPolygonPolygon
};

module.exports = SAT;