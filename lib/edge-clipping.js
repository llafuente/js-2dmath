/**
 * credits - https://github.com/juhl/collision-detection-2d
 */

var Vec2 = require("./vec2.js");
var Polygon = require("./polygon.js");

var l = [0, 0],
    r = [0, 0],
    v = [0, 0];

// Find the separating edge for the given direction
function findSeparationEdge(polygon, n) {

    // Compute farthest polygon point in particular direction.
    var index = Polygon.furthestPoint(v, polygon, n);

    var index_prev = (index + polygon.length - 1) % polygon.length;
    var index_next = (index + 1) % polygon.length;

    var v_prev = polygon[index_prev];
    var v_next = polygon[index_next];
    Vec2.sub(l, v, v_next);
    Vec2.sub(r, v, v_prev);

    var edge = {};

    if (Vec2.dot(r, n) <= Vec2.dot(l, n)) {
        edge.v1 = v_prev;
        edge.v2 = v;
        return edge;
    }

    edge.v1 = v;
    edge.v2 = v_next;
    return edge;
}

var delta = [0, 0],
    p = [0, 0],
    _p = [0, 0];
function clipLineSegment(v1, v2, n, o) {
    var d1 = Vec2.dot(n, v1) - o;
    var d2 = Vec2.dot(n, v2) - o;
    var cp = [];

    if (d1 >= 0) {
        cp.push(v1);
    }

    if (d2 >= 0) {
        cp.push(v2);
    }

    if (d1 * d2 < 0) {
        Vec2.sub(delta, v2, v1);
        Vec2.add(p, v1, Vec2.scale(_p, delta, d1 / (d1 - d2)));
        cp.push(p);
    }

    return cp;
}
var ccp_nn = [0, 0],
    e1d = [0, 0],
    e2d = [0, 0],
    ref_n = [0, 0],
    ref_nn = [0, 0],
    ref_perp = [0, 0];
function computeContactPoints(polygon1, polygon2, n) {
    var e1 = findSeparationEdge(polygon1, n);
    Vec2.negate(ccp_nn, n);
    var e2 = findSeparationEdge(polygon2, ccp_nn);

    Vec2.sub(e1d, e1.v2, e1.v1);
    Vec2.sub(e2d, e2.v2, e2.v1);

    var ref;
    var inc;
    var flip;

    // The reference edge is the edge most perpendicular to the separation normal.
    // So as to separate both polygons as little as possible.
    var en1 = Math.abs(Vec2.dot(e1d, n));
    var en2 = Math.abs(Vec2.dot(e2d, n));
    if (en1 <= en2) {
        ref = e1;
        Vec2.normalize(ref_n, e1d);
        inc = e2;
        flip = true;
    }
    else {
        ref = e2;
        Vec2.normalize(ref_n, e2d);
        inc = e1;
        flip = false;
    }

    // Clip incident edge vertices using reference edge v1
    var o1 = Vec2.dot(ref_n, ref.v1);
    var v = clipLineSegment(inc.v1, inc.v2, ref_n, o1);
    if (v.length < 2) {
        return null;
    }

    // Clip incident edge vertices using reference edge v2
    var o2 = -Vec2.dot(ref_n, ref.v2);
    Vec2.negate(ref_nn, ref_n);
    v = clipLineSegment(v[0], v[1], ref_nn, o2);
    if (v.length < 2) {
        return null;
    }

    Vec2.perp(ref_perp, ref_n);

    var cp = [];
    var o3 = Vec2.dot(ref_perp, ref.v1);
    var depth0 = Vec2.dot(ref_perp, v[0]) - o3;
    var depth1 = Vec2.dot(ref_perp, v[1]) - o3;

    if (depth0 > 0) {
        cp.push({p: Vec2.clone(v[0]), n: Vec2.clone(n), d: -depth0});
    }

    if (depth1 > 0) {
        cp.push({p: Vec2.clone(v[1]), n: Vec2.clone(n), d: -depth1});
    }

    return { cp: cp, incidentEdge: inc, referenceEdge: ref };
}

module.exports = computeContactPoints;