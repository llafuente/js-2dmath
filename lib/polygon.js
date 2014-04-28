var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    vec2_add = Vec2.add,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,
    vec2_cross = Vec2.cross,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,
    f,
    sum = 0,
    cross = 0,
    len = 0,
    i = 0,
    sqrt = Math.sqrt;
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

function furthestPoint(out_vec2, poly, vec2) {
    var point_idx,
        c_dot,
        max_dot;
    var i,
        max;

    max_dot = -Infinity;

    for (i = 0, max = poly.length; i < max; i++) {
        c_dot = vec2_dot(poly[i], vec2);
        if (c_dot > max_dot) {
            point_idx = i;
            max_dot = c_dot;
        }
    }

    out_vec2[0] = poly[point_idx][0];
    out_vec2[1] = poly[point_idx][1];

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
function tripleProduct(out_vec2, A, B, C) {
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
        tripleProduct(abPerp, ac, ab, ab);
        tripleProduct(acPerp, ab, ac, ac);

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
        ab = vec2_normalize(ab, vec2_sub(ab, b, a));

        // get perp to ab in the direction of the origin
        tripleProduct(abPerp, ab, ao, ab);

        // set the direction to abPerp
        GJK_direction[0] = abPerp[0];
        GJK_direction[1] = abPerp[1];

    }
    return false;
}

var GJK_direction;

function GJK(A, B) {
    var simplex = [];

    // Choose a direction
    GJK_direction = [0, 1];

    // get the first minkowski diff point
    var vec2 = furthestMinkowski([], A, B, GJK_direction);
    simplex.push(vec2);

    vec2_negate(GJK_direction, GJK_direction);

    // start looping
    while (true) {
        // add a new point to the simplex 
        vec2 = furthestMinkowski([], A, B, GJK_direction);
        simplex.push(vec2);
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

/**
 * @class Polygon
 */
var Polygon = {
    create: create,
    fromAABB: fromAABB,
    centroid: centroid,
    recenter: recenter,
    //circumcenter: circumcenter,
    area: area,

    furthestPoint: furthestPoint,
    furthestMinkowski: furthestMinkowski,
    containsOrigin: containsOrigin,
    GJK: GJK,
};

module.exports = Polygon;