var Vec2 = require("./vec2.js"),
    vec2_add = Vec2.add,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,
    vec2_cross = Vec2.cross,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,

    Beizer = require("./beizer.js"),
    beizer_getPoints = Beizer.getPoints,
    f,
    sum = 0,
    cross = 0,
    len = 0,
    i = 0,
    x,
    y,
    o,
    p,
    sqrt = Math.sqrt,
    cos = Math.cos,
    sin = Math.sin,
    EPS = Math.EPS;
/**
 * input are many Vec2(s)
 * @returns {Polygon}
 */
function create() {
    var i,
        max = arguments.length,
        out = new Array(max);

    for (i = 0; i < max; ++i) {
        out[i] = arguments[i];
    }

    return out;
}
function fromAABB(aabb2) {
    var out = new Array(4);
    out[0] = [aabb2[0], aabb2[1]];
    out[1] = [aabb2[0], aabb2[3]];
    out[2] = [aabb2[2], aabb2[3]];
    out[3] = [aabb2[2], aabb2[1]];

    return out;
}

function fromBeizer(curve, npoints) {
    return beizer_getPoints(curve, npoints)
}

function translate(out, poly, vec2) {
    len = poly.length - 1;
    x = vec2[0];
    y = vec2[1];

    do {
        p = poly[len];
        o = out[len] = out[len] || [0, 0];
        o[0] = p[0] + x;
        o[1] = p[1] + y;
    } while (len--);

    return out;
}
var cfactor,
    sfactor;

function rotate(out, poly, radians) {
    len = poly.length - 1;

    cfactor = cos(radians);
    sfactor = sin(radians);

    do {
        p = poly[len];
        o = out[len] = out[len] || [0, 0];
        x = p[0];
        y = p[1];

        o[0] = x * cfactor - y * sfactor;
        o[1] = x * sfactor + y * cfactor;
    } while (len--);

    return out;
}

var c_aux = [0, 0],
    c_aux2 = [0, 0];
/**
 * @returns {Vec2}
 */
function centroid(out_vec2, poly) {
    sum = 0;
    out_vec2[0] = 0;
    out_vec2[1] = 1;

    for (i = 0, len = poly.length; i < len; ++i) {
        c_aux[0] = poly[i][0];
        c_aux[1] = poly[i][1];
        f = (i === len) ? 0 : i;
        c_aux2[0] = poly[f][0];
        c_aux2[0] = poly[f][1];

        cross = vec2_cross(c_aux, c_aux2);

        sum += cross;
        vec2_add(c_aux, c_aux, c_aux2);
        vec2_scale(c_aux, c_aux, cross);
        vec2_add(out_vec2, out_vec2, c_aux);
    }

    return vec2_scale(out_vec2, 1 / (3 * sum));
}
var vec2_centroid = [0, 0];
/**
 * @returns {Polygon}
 */
function recenter(out, poly) {
    centroid(vec2_centroid, poly);
    var x = vec2_centroid[0],
        y = vec2_centroid[1];

    for (i = 0, len = poly.length; i < len; ++i) {
        out[i] = out[i] || [0, 0]; // create if needed...
        out[i][0] += x;
        out[i][1] += y;
    }
}
/**
* @TODO review, this doesn't seems to be right!
* Get the circumeter of polygon
* @param {Complex[]} p The polygon
function circumcenter(out, poly) {
    var circ = 0, i = 1;
    for (; i < poly.length; i++) {
      var dx = poly[i].x - poly[i - 1].x;
      var dy = poly[i].y - poly[i - 1].y;
      circ += sqrt(dx * dx + dy * dy);
    }
    return circ;
},
*/
/**
 * @returns {Number}
 */
function area(poly) {
    var value = 0;

    for (i = 0, len = poly.length; i < len; i += 2) {
        f = (i === len) ? 0 : i;
        value -= (poly[i][0] * poly[f][0]) - (poly[i][1] * poly[f][1]);
    }

    return value * 0.5;
}
/**
 * find support point
 */
function furthestPoint(out_vec2, poly, vec2) {
    var vertex_idx,
        c_dot,
        max_dot;
    var i,
        max;

    max_dot = -Infinity;

    for (i = 0, max = poly.length; i < max; i++) {
        c_dot = vec2_dot(poly[i], vec2);
        if (c_dot > max_dot) {
            vertex_idx = i; // do not copy or reference the vector here!!
            max_dot = c_dot;
        }
    }

    out_vec2[0] = poly[vertex_idx][0];
    out_vec2[1] = poly[vertex_idx][1];

    return out_vec2;
}

var fm_vec2_ndir = [0, 0],
    fm_aux_vec2 = [0, 0];
function furthestMinkowski(out_vec2, poly, poly2, vec2_dir) {
    // furthest point in poly for vec2_dir
    furthestPoint(out_vec2, poly, vec2_dir);

    // furthest point in poly2 for -vec2_dir
    vec2_negate(fm_vec2_ndir, vec2_dir);
    furthestPoint(fm_aux_vec2, poly2, fm_vec2_ndir);

    return vec2_sub(out_vec2, out_vec2, fm_aux_vec2);
}

var bca = [0, 0],
    acb = [0, 0];
function _tripleProduct(out_vec2, A, B, C) {
    // (A x B) x C = B(C.A) - A(C.B)
    vec2_scale(bca, B, vec2_dot(C, A));
    vec2_scale(acb, A, vec2_dot(C, B));

    return vec2_normalize(out_vec2, vec2_sub(out_vec2, bca, acb));
}

var abPerp = [0, 0],
    acPerp = [0, 0],
    ab = [0, 0],
    ac = [0, 0],
    ao = [0, 0];

function containsOrigin(simplex) {
    var a, b, c;

    // Get the last point added to simplex
    a = simplex[simplex.length - 1];
    // compute AO
    vec2_negate(ao, a);

    if (3 === simplex.length) {
        // then it's the  triangle case
        // get b and c;
        b = simplex[0];
        c = simplex[1];

        // compute the edges
        vec2_normalize(ab, vec2_sub(ab, b, a));
        vec2_normalize(ac, vec2_sub(ac, c, a));

        // compute the normals
        _tripleProduct(abPerp, ac, ab, ab);
        _tripleProduct(acPerp, ab, ac, ac);

        // is the origin is outside of ab
        //if (abPerp.dot(ao) > 0) {
        if (vec2_dot(abPerp, ao) > 0) {
            // remove point c (index 1)
            simplex.splice(1, 1);

            GJK_direction[0] = abPerp[0];
            GJK_direction[1] = abPerp[1];
        } else {
            // is the origin outside of ac
            if (vec2_dot(acPerp, ao) > 0) {
                // remove point b (index 0)
                simplex.splice(0, 1);

                // set the new direction to acPerp
                GJK_direction[0] = acPerp[0];
                GJK_direction[1] = acPerp[1];
            } else {
                // otherwise we know simplex contains origin
                return true;
            }
        }
    } else {
        // then it's the line segment case
        b = simplex[0];

        // compute ab
        vec2_normalize(ab, vec2_sub(ab, b, a));
        console.log("a-b", a, b);
        console.log("ab", ab);

        // get perp to ab in the direction of the origin
        _tripleProduct(abPerp, ab, ao, ab);
        console.log("abPerp", abPerp);

        // set the direction to abPerp
        GJK_direction[0] = abPerp[0];
        GJK_direction[1] = abPerp[1];

    }
    return false;
}

var GJK_direction;
/**
 * fix current implementation that it's buggy
 * looks correct: https://github.com/juhl/collision-detection-2d
 */
function GJK(A, B, simplex) {
    // disallow segments
    if (A.length < 2 || B.length < 2) {
        return false;
    }

    // Choose a direction
    GJK_direction = [-1, 0];

    // get the first minkowski diff point
    var vec2 = [0, 0];
    furthestMinkowski(vec2, A, B, GJK_direction);
    simplex.push(vec2);

    GJK_direction[0] = 1;

    // start looping
    while (true) {
        console.log("GJK_direction", GJK_direction);
        // add a new point to the simplex
        vec2 = [0, 0];
        furthestMinkowski(vec2, A, B, GJK_direction);
        simplex.push(vec2);
        console.log(vec2, simplex);
        // make sure that the last point we added
        // pass the origin
        if (vec2_dot(vec2, GJK_direction) <= 0) {
            // if the point added last was not past the origin in the direction of d
            // then the Minkowski diff cannot possibly contain the origin since
            // the last point added is on the edge of the Minkowski diff
            return false;
        } else {
            // otherwise we need to determine if the origin is in
            // the current simplex
            if (containsOrigin(simplex)) {
                return true;
            }
        }
    }
}

function EPA(polygon1, polygon2, simplex) {
    var polytope = new Polytope(simplex);
    var edgeHistory = [];
    var closestEdge;

    var v = polytope.verts;

    var save1 = [];
    var save2 = [];
    var saveCount = 0;

    var max_iters = 20;
    for (var iter = 0; iter < max_iters; iter++) {
        // Copy polytope so we can identify duplicates.
        saveCount = v.length;
        for (var i = 0; i < saveCount; i++) {
            save1[i] = v[i].index1;
            save2[i] = v[i].index2;
        }

        var edge = polytope.getClosestEdge();

        edgeHistory.push(edge);

        var d = edge.dir;

        // Ensure the search direction non-zero.
        if (vec2.dot(d, d) == 0) {
            break;
         }

        // Compute new closest point to closest edge direction
        var index1 = supportPoint(polygon1, vec2.neg(d));
        var p1 = polygon1[index1];
        var index2 = supportPoint(polygon2, d);
        var p2 = polygon2[index2];
        var p = vec2.sub(p2, p1);

        var v1 = v[edge.index1];
        var v2 = v[edge.index2];

        // Check for new point is already on a closest edge
        if ((v1.index1 == index1 && v1.index2 == index2) || (v2.index1 == index1 && v2.index2 == index2)) {
            break;
        }

        // Add new polytope point and split the edge
        var new_v = new SimplexVertex;
        new_v.index1 = index1;
        new_v.index2 = index2;
        new_v.p1 = p1;
        new_v.p2 = p2;
        new_v.p = p;

        polytope.verts.push(new_v);
        var new_index = v.length - 1;

        var prevEdge = edge.prev;
        var nextEdge = edge.next;
        polytope.deleteEdge(edge);

        polytope.insertEdge(prevEdge, new PolytopeEdge(prevEdge.index2, new_index));
        polytope.insertEdge(prevEdge.next, new PolytopeEdge(new_index, nextEdge.index1));

        // Check for duplicate support points. This is the main termination criteria.
        var duplicate = false;
        for (var i = 0; i < saveCount; i++) {
            if (new_v.index1 == save1[i] && new_v.index2 == save2[i]) {
                duplicate = true;
                break;
            }
        }

    // If we found a duplicate support point we must exit to avoid cycling.
        if (duplicate) {
            break;
        }
    }

    return { polytope: polytope, edgeHistory: edgeHistory };
}

/**
 * @class Polygon
 */
var Polygon = {
    create: create,
    fromAABB: fromAABB,
    fromBeizer: fromBeizer,
    translate: translate,
    rotate: rotate,
    centroid: centroid,
    recenter: recenter,
    //circumcenter: circumcenter,
    area: area,

    furthestPoint: furthestPoint,
    furthestMinkowski: furthestMinkowski,
    containsOrigin: containsOrigin,
    GJK: GJK,
    EPA: EPA,
};

module.exports = Polygon;




SimplexVertex = function() {
    this.p1 = new vec2; // support point in polygon1
    this.p2 = new vec2; // support point in polygon2
    this.p = new vec2;  // p2 - p1
    this.u = 1;         // unnormalized barycentric coordinate for closest point
    this.index1 = 0;    // p1 index
    this.index2 = 0;    // p2 index
}

SimplexVertex.prototype.copy = function(v) {
    this.p1.copy(v.p1 || v[0]);
    this.p2.copy(v.p2 || v[1]);
    this.p.copy(v.p)
    this.u = v.u;
    this.index1 = v.index1;
    this.index2 = v.index2;
}

Polytope = function(simplex) {
    //assert(simplex.count == 3);

    this.verts = [];

    for (var i = 0; i < simplex.length; i++) {
        this.verts[i] = new SimplexVertex;
        this.verts[i].copy(simplex[i]);
    }

    this.edgeHead = null;
    this.edgeTail = null;

    if (simplex.length == 2) {
        this.insertEdge(this.edgeTail, new PolytopeEdge(0, 1));
        this.insertEdge(this.edgeTail, new PolytopeEdge(1, 0));
    }
    else if (simplex.length == 3) {
        var a = simplex[0];
        var b = simplex[1];
        var c = simplex[2];

        var ab = vec2.sub(b, a);
        var bc = vec2.sub(c, b);

        // Ensure the edge winding to CCW
        if (vec2.cross(ab, bc) > 0) {
            this.insertEdge(this.edgeTail, new PolytopeEdge(0, 1));
            this.insertEdge(this.edgeTail, new PolytopeEdge(1, 2));
            this.insertEdge(this.edgeTail, new PolytopeEdge(2, 0));
        }
        else {
            this.insertEdge(this.edgeTail, new PolytopeEdge(0, 2));
            this.insertEdge(this.edgeTail, new PolytopeEdge(2, 1));
            this.insertEdge(this.edgeTail, new PolytopeEdge(1, 0));
        }
    }
}

Polytope.prototype.insertEdge = function(prevEdge, newEdge) {
    if (this.edgeHead == null) {
        this.edgeHead = newEdge;
        this.edgeTail = newEdge;
    }
    else {
        newEdge.prev = prevEdge;
        newEdge.next = prevEdge.next;
        newEdge.next.prev = newEdge;
        prevEdge.next = newEdge;

        if (prevEdge == this.edgeTail) {
            this.edgeTail = newEdge;
        }
    }
}

Polytope.prototype.deleteEdge = function(edge) {
    if (edge == this.edgeHead) {
        this.edgeHead = edge.next;
    }

    if (edge == this.edgeTail) {
        this.edgeTail = edge.prev;
    }

    edge.prev.next = edge.next;
    edge.next.prev = edge.prev;

    //delete edge;
}

// Find closest polytope edge to origin
Polytope.prototype.getClosestEdge = function() {
    var firstEdge = this.edgeHead;

    if (firstEdge.distsq == undefined) {
        var a = this.verts[firstEdge.index1].p;
        var b = this.verts[firstEdge.index2].p;
        var ab = vec2.sub(b, a);

        var v = -vec2.dot(ab, a);
        if (v <= 0) {
            var cp = new vec2(a.x, a.y);
            firstEdge.distsq = cp.lengthsq();
            firstEdge.dir = cp;
        }
        else {
            var u = vec2.dot(ab, b);
            if (u <= 0) {
                var cp = new vec2(b.x, b.y);
                firstEdge.distsq = cp.lengthsq();
                firstEdge.dir = cp;
            }
            else {
                var s = 1 / ab.lengthsq();
                var cp = vec2.lerp(a, b, v * s);
                firstEdge.distsq = cp.lengthsq();
                firstEdge.dir = vec2.rperp(ab);
            }
        }
    }

    var closestEdge = firstEdge;

    for (var edge = firstEdge.next; edge != this.edgeHead; edge = edge.next) {
        if (edge.distsq == undefined) {
            var a = this.verts[edge.index1].p;
            var b = this.verts[edge.index2].p;
            var ab = vec2.sub(b, a);

            var v = -vec2.dot(ab, a);
            if (v <= 0) {
                var cp = new vec2(a.x, a.y);
                edge.distsq = cp.lengthsq();
                edge.dir = cp;
            }
            else {
                var u = vec2.dot(ab, b);
                if (u <= 0) {
                    var cp = new vec2(b.x, b.y);
                    edge.distsq = cp.lengthsq();
                    edge.dir = cp;
                }
                else {
                    var s = 1 / ab.lengthsq();
                    cp = vec2.lerp(a, b, v * s);
                    edge.distsq = cp.lengthsq();
                    edge.dir = vec2.rperp(ab);
                }
            }
        }

        if (edge.distsq > 0.0001 && edge.distsq < closestEdge.distsq) {
            closestEdge = edge;
        }
    }

    return closestEdge;
}

PolytopeEdge = function(index1, index2) {
    this.index1 = index1;
    this.index2 = index2;
    this.next = this;
    this.prev = this;
}