var Vec2 = require("../vec2.js"),
    Polygon = require("../polygon.js"),
    sqrt = Math.sqrt;

var l = [0, 0],
    r = [0, 0],
    v = [0, 0];

// Find the separating edge for the given direction
function _findSeparationEdge(polygon, n) {

    // Compute farthest polygon point in particular direction.
    var index = Polygon.furthestPoint(v, polygon, n);

    var index_prev = (index + polygon.length - 1) % polygon.length;
    var index_next = (index + 1) % polygon.length;

    var v_prev = Vec2.clone(polygon[index_prev]);
    var v_next = Vec2.clone(polygon[index_next]);
    Vec2.sub(l, v, v_next);
    Vec2.sub(r, v, v_prev);

    var edge = {};

    if (Vec2.dot(r, n) <= Vec2.dot(l, n)) {
        edge.v1 = v_prev;
        edge.v2 = Vec2.clone(v);
        return edge;
    }

    edge.v1 = Vec2.clone(v);
    edge.v2 = v_next;
    return edge;
}

var delta = [0, 0],
    p = [0, 0],
    _p = [0, 0];
function _clipLineSegment(v1, v2, n, o) {
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
/**
 * @source https://github.com/juhl/collision-detection-2d
 */
function EdgeClipping(polygon1, polygon2, n) {
    var e1 = _findSeparationEdge(polygon1, n);
    Vec2.negate(ccp_nn, n);
    var e2 = _findSeparationEdge(polygon2, ccp_nn);


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
        flip = false;
    } else {
        ref = e2;
        Vec2.normalize(ref_n, e2d);
        inc = e1;
        flip = true;
    }

    // Clip incident edge vertices using reference edge v1
    var o1 = Vec2.dot(ref_n, ref.v1);
    var v = _clipLineSegment(inc.v1, inc.v2, ref_n, o1);
    if (v.length < 2) {
        return null;
    }

    // Clip incident edge vertices using reference edge v2
    var o2 = Vec2.dot(ref_n, ref.v2);
    Vec2.negate(ref_nn, ref_n);
    v = _clipLineSegment(v[0], v[1], ref_nn, -o2);
    if (v.length < 2) {
        return null;
    }

    Vec2.perp(ref_perp, ref_n);

    if (flip) {
        Vec2.negate(ref_perp, ref_perp);
    }

    var cp = [];
    var max = Vec2.dot(ref_perp, ref.v1);
    var depth0 = Vec2.dot(ref_perp, v[0]) - max;
    var depth1 = Vec2.dot(ref_perp, v[1]) - max;

    if (depth0 >= 0) {
        cp.push({p: Vec2.clone(v[0]), n: Vec2.clone(n), d: -depth0});
    }

    if (depth1 >= 0) {
        cp.push({p: Vec2.clone(v[1]), n: Vec2.clone(n), d: -depth1});
    }

    return { cp: cp, incidentEdge: inc, referenceEdge: ref };
}


var cc_n = [0, 0];
/**
 * @source http://www.randygaul.net/2013/03/28/custom-physics-engine-part-2-manifold-generation/
 */
function CircleCircle(c1, c2) {
    // Setup a couple pointers to each object

    // Vector from A to B
    Vec2.sub(cc_n, c2[0], c1[0]);

    var r = c1[1] + c1[1];
    r *= r;

    var length_sq = Vec2.lengthSq(cc_n);
    if (length_sq > r) {
        return false;
    }

    // Circles have collided, now compute manifold
    var d = sqrt(length_sq); // perform actual sqrt

    // If distance between circles is not zero
    if (d !== 0) {
        // Distance is difference between radius and distance
        var normal = Vec2.div([0, 0], cc_n, d);
        var position = Vec2.scale([0, 0], normal * c1[1]);
        Vec2.add(position, position, c1[0]);

        return {
            penetration: r - d,
            position: position,
            normal: normal
        };
    }

    // Circles are on same position
    // Choose random (but consistent) values
    return {
        position: c1[0],
        penetration: c1[1],
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