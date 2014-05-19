var Vec2 = require("../vec2.js"),
    Polygon = require("../polygon.js"),
    polygon_furthestPoint = Polygon.furthestPoint,
    sqrt = Math.sqrt,
    abs = Math.abs,
    vec2_sub = Vec2.sub,
    vec2_add = Vec2.add,
    vec2_clone = Vec2.clone,
    vec2_dot = Vec2.dot,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,
    vec2_perp = Vec2.perp,
    vec2_lengthSq = Vec2.lengthSq,
    vec2_div = Vec2.div;

var l = [0, 0],
    r = [0, 0],
    v = [0, 0];

/**
 * Find the separating edge for the given direction
 */
function _findSeparationEdge(polygon, n) {

    // Compute farthest polygon point in particular direction.
    var index = polygon_furthestPoint(v, polygon, n);

    var index_prev = (index + polygon.length - 1) % polygon.length;
    var index_next = (index + 1) % polygon.length;

    var v_prev = vec2_clone(polygon[index_prev]);
    var v_next = vec2_clone(polygon[index_next]);
    vec2_sub(l, v, v_next);
    vec2_sub(r, v, v_prev);

    var edge = {};

    if (vec2_dot(r, n) <= vec2_dot(l, n)) {
        edge.v1 = v_prev;
        edge.v2 = vec2_clone(v);
        return edge;
    }

    edge.v1 = vec2_clone(v);
    edge.v2 = v_next;
    return edge;
}

var delta = [0, 0],
    p = [0, 0],
    _p = [0, 0];
function _clipLineSegment(v1, v2, n, o) {
    var d1 = vec2_dot(n, v1) - o;
    var d2 = vec2_dot(n, v2) - o;
    var cp = [];

    if (d1 >= 0) {
        cp.push(v1);
    }

    if (d2 >= 0) {
        cp.push(v2);
    }

    if (d1 * d2 < 0) {
        vec2_sub(delta, v2, v1);
        vec2_add(p, v1, vec2_scale(_p, delta, d1 / (d1 - d2)));
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
/**
 * @source https://github.com/juhl/collision-detection-2d
 */
function EdgeClipping(a_points, b_points, n) {
    var e1 = _findSeparationEdge(a_points, n);
    vec2_negate(ccp_nn, n);
    var e2 = _findSeparationEdge(b_points, ccp_nn);


    vec2_sub(e1d, e1.v2, e1.v1);
    vec2_sub(e2d, e2.v2, e2.v1);

    var ref;
    var inc;
    var flip;

    // The reference edge is the edge most perpendicular to the separation normal.
    // So as to separate both polygons as little as possible.
    var en1 = abs(vec2_dot(e1d, n));
    var en2 = abs(vec2_dot(e2d, n));
    if (en1 <= en2) {
        ref = e1;
        vec2_normalize(ref_n, e1d);
        inc = e2;
        flip = false;
    } else {
        ref = e2;
        vec2_normalize(ref_n, e2d);
        inc = e1;
        flip = true;
    }

    // Clip incident edge vertices using reference edge v1
    var o1 = vec2_dot(ref_n, ref.v1);
    var v = _clipLineSegment(inc.v1, inc.v2, ref_n, o1);
    if (v.length < 2) {
        return null;
    }

    // Clip incident edge vertices using reference edge v2
    var o2 = vec2_dot(ref_n, ref.v2);
    vec2_negate(ref_nn, ref_n);
    v = _clipLineSegment(v[0], v[1], ref_nn, -o2);
    if (v.length < 2) {
        return null;
    }

    vec2_perp(ref_perp, ref_n);

    if (flip) {
        vec2_negate(ref_perp, ref_perp);
    }

    var cp = [];
    var max = vec2_dot(ref_perp, ref.v1);
    var depth0 = vec2_dot(ref_perp, v[0]) - max;
    var depth1 = vec2_dot(ref_perp, v[1]) - max;

    if (depth0 >= 0) {
        cp.push({p: vec2_clone(v[0]), n: vec2_clone(n), d: -depth0});
    }

    if (depth1 >= 0) {
        cp.push({p: vec2_clone(v[1]), n: vec2_clone(n), d: -depth1});
    }

    return { cp: cp, incidentEdge: inc, referenceEdge: ref };
}


var cc_n = [0, 0];
/**
 * @source http://www.randygaul.net/2013/03/28/custom-physics-engine-part-2-manifold-generation/
 */
function CircleCircle(a_circle, b_circle) {
    // Setup a couple pointers to each object

    // Vector from A to B
    vec2_sub(cc_n, b_circle[0], a_circle[0]);

    var r = b_circle[1] + a_circle[1];
    r *= r;

    var length_sq = vec2_lengthSq(cc_n);
    if (length_sq > r) {
        return false;
    }

    // Circles have collided, now compute manifold
    var d = sqrt(length_sq); // perform actual sqrt

    // If distance between circles is not zero
    if (d !== 0) {
        // Distance is difference between radius and distance
        var normal = vec2_div([0, 0], cc_n, d);
        var position = vec2_scale([0, 0], normal * a_circle[1]);
        vec2_add(position, position, a_circle[0]);

        return {
            penetration: r - d,
            position: position,
            normal: normal
        };
    }

    // Circles are on same position
    // Choose random (but consistent) values
    return {
        position: a_circle[0],
        penetration: a_circle[1],
        normal: [1, 0]
    };
}

/*
EdgeClipping(
    [[8, 4], [14, 4], [8, 10], [14, 10]],
    [[12, 5], [4, 5], [12, 0], [4, 0]],
    [0, -1]
);

process.exit();
*/
module.exports = EdgeClipping;


module.exports = {
    EdgeClipping: EdgeClipping,
    CircleCircle: CircleCircle,


    // alias
    PolygonPolygon: EdgeClipping
};