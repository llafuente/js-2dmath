var Vec2 = require("./vec2.js"),
    vec2_add = Vec2.add,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,
    vec2_crossLength = Vec2.crossLength,
    vec2_cross = Vec2.cross,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,
    vec2_lengthSq = Vec2.lengthSq,
    vec2_perp = Vec2.perp,

    Matrix23 = require("./matrix23.js"),

    Beizer = require("./beizer.js"),
    beizer_getPoints = Beizer.getPoints,
    f,
    sum = 0,
    cross = 0,
    x,
    y,
    o,
    p,
    sqrt = Math.sqrt,
    cos = Math.cos,
    abs = Math.abs,
    sin = Math.sin,
    EPS = Math.EPS;
/**
 * input are many Vec2(s)
 * @return {Polygon}
 */
function create() {
    var i,
        len = arguments.length,
        out = new Array(len);

    for (i = 0; i < len; ++i) {
        out[i] = arguments[i];
    }

    return out;
}

/*
 * Create the convex hull using the Gift wrapping algorithm
 * @source https://github.com/juhl/collision-detection-2d/blob/master/util.js
 * @reference http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
 * @reference http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
 * @param {Vec2[]} vec2_list
 * @return {Polygon}
 */
function createConvexHull(vec2_list) {
    // Find the right most point on the hull
    var i0 = 0,
        x0 = vec2_list[0][0],
        i,
        x;

    for (i = 1; i < vec2_list.length; i++) {
        x = vec2_list[i][0];
        if (x > x0 || (x === x0 && vec2_list[i][1] < vec2_list[i0][1])) {
            i0 = i;
            x0 = x;
        }
    }

    var n = vec2_list.length,
        hull = [],
        m = 0,
        ih = i0,
        ie,
        j,
        r = [0, 0],
        v = [0, 0],
        c;

    do {
        hull[m] = ih;

        ie = 0;
        for (j = 1; j < n; ++j) {
            if (ie === ih) {
                ie = j;
                continue;
            }

            vec2_sub(r, vec2_list[ie], vec2_list[hull[m]]);
            vec2_sub(v, vec2_list[j], vec2_list[hull[m]]);
            c = Vec2.cross(r, v);
            if (c < 0) {
                ie = j;
            }

            // Collinearity check
            if (c === 0 && vec2_lengthSq(v) > vec2_lengthSq(r)) {
                ie = j;
            }
        }

        ++m;
        ih = ie;
    } while (ie !== i0);

    // Copy vertices
    var newPoints = [];
    for (i = 0; i < m; ++i) {
        newPoints.push(vec2_list[hull[i]]);
    }

    return newPoints;
}
/**
 * @param {AABB2} aabb2
 * @return {Polygon}
 */
function fromAABB(aabb2) {
    var out = new Array(4);
    out[0] = [aabb2[0], aabb2[1]];
    out[1] = [aabb2[0], aabb2[3]];
    out[2] = [aabb2[2], aabb2[3]];
    out[3] = [aabb2[2], aabb2[1]];

    return out;
}
/**
 * @param {Rectangle} rect
 * @return {Polygon}
 */
function fromRectangle(rect) {
    var out = new Array(4);
    out[0] = [rect[0][0], rect[0][1]];
    out[1] = [rect[0][0], rect[1][1]];
    out[2] = [rect[1][0], rect[1][1]];
    out[3] = [rect[1][0], rect[0][1]];

    return out;
}
/**
 * Create a polygon, the polygon is a line
 * @todo extrude this line
 * @param {Beizer} curve
 * @param {Number} npoints
 * @return {Polygon}
 */
function fromBeizer(curve, npoints) {
    return beizer_getPoints(curve, npoints);
}
/**
 * Create a polygon from a circle
 * start_radians rotate the given polygon
 * @param {Circle} circle
 * @param {Number} npoints
 * @param {Number} start_radians
 * @return {Polygon}
 */
function fromCircle(circle, npoints, start_radians) {
    var i = start_radians,
        max = Math.TWO_PI + start_radians,
        angle = Math.TWO_PI / npoints,
        out = [],
        cx = circle[0][0],
        cy = circle[0][1],
        r = circle[1],
        c,
        s;

    for (; i < max; i += angle) {
        c = cos(i);
        s = sin(i);
        out.push([cx + c * r, cy + s * r]);
    }

    return out;
}
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Vec2} vec2
 * @return {Polygon}
 */
function translate(out, poly, vec2) {
    var len = poly.length - 1;

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
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Number} radians
 * @return {Polygon}
 */
function rotate(out, poly, radians) {
    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    var len = poly.length - 1;

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
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Number} radians
 * @return {Polygon}
 */
function edges(out, poly) {
    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    var i = 0,
        len = poly.length,
        lenm1 = len - 1;

    // Calculate the edges/normals
    for (; i < len; i++) {
        vec2_sub(out[i] = out[i] || [0, 0], poly[i < lenm1 ? i + 1 : 0], poly[i]);
    }

    return out;
}
/**
 *
 * @param {Polygon} out
 * @param {Polygon} edges
 * @return {Polygon}
 */
function normals(out, edges) {
    var i = 0,
        len = edges.length;

    if (out.length > edges.length) {
        out.splice(edges.length);
    }

    for (; i < len; i++) {
        out[i] = out[i] || [0, 0];
        vec2_perp(out[i], edges[i]);
        vec2_normalize(out[i], out[i]);
    }

    return out;
}

var c_aux = [0, 0],
    c_aux2 = [0, 0];
/**
 *
 * @param {Vec2} out_vec2
 * @param {Polygon} poly
 * @return {Vec2}
 */
function centroid(out_vec2, poly) {
    var i = 0,
        len = poly.length;

    sum = 0;
    out_vec2[0] = 0;
    out_vec2[1] = 1;

    for (; i < len; ++i) {
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

    return vec2_scale(out_vec2, out_vec2, 1 / (3 * sum));
}
var vec2_centroid = [0, 0];
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @return {Polygon}
 */
function recenter(out, poly) {
    var i = 0,
        len = poly.length;

    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    centroid(vec2_centroid, poly);
    var x = vec2_centroid[0],
        y = vec2_centroid[1];

    for (; i < len; ++i) {
        out[i] = out[i] || [0, 0]; // create if needed...
        out[i][0] += x;
        out[i][1] += y;
    }
}
/*
* @TODO review, this doesn't seems to be right!
* Get the circumeter of polygon
* @param {Complex[]} p The polygon
function circumcenter(out, poly) {
    var circ = 0, i = 1;
    for (; i < poly.length; i++) {
      var dx = poly[i][0] - poly[i - 1][0];
      var dy = poly[i][1] - poly[i - 1][1];
      circ += sqrt(dx * dx + dy * dy);
    }
    return circ;
},
*/

/**
 *
 * @param {Polygon} poly
 * @return {Number}
 */
function area(poly) {
    var value = 0,
        i = 0,
        len = poly.length;

    for (; i < len; ++i) {
        f = (i === len) ? 0 : i;
        value -= (poly[i][0] * poly[f][0]) - (poly[i][1] * poly[f][1]);
    }

    return value * 0.5;
}

/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Matrix23} m2d
 * @return {Polygon}
 */
function transform(out, poly, m2d) {
    var i = 0,
        len = poly.length;

    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    for (; i < len; ++i) {
        out[i] = out[i] || [0, 0];
        Matrix23.transform(out[i], m2d, poly[i]);
    }

    return out;
}

/**
 *
 * @param {Polygon} poly
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(poly, vec2) {
    var i = 0,
        len = poly.length,
        j = len - 1,
        c = false;

    for (; i < len; j = i++) {
        if ((poly[i][1] >= vec2[1]) !== (poly[j][1] >= vec2[1]) &&
            (vec2[0] <= (poly[j][0] - poly[i][0]) * (vec2[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
        ) {
            c = !c;
        }
    }

    return c;
}

/**
 * Compute farthest polygon point in particular direction.
 * Return the index in the polygon and a clone in out_vec2
 *
 * @param {Vec2} out_vec2
 * @param {Polygon} poly
 * @param {Vec2} vec2_dir
 * @return {Number} index in the current poly
 */
function furthestPoint(out_vec2, poly, vec2_dir) {
    var idx,
        i,
        max,
        max_dot = -Infinity,
        current_dot;

    for (i = 0, max = poly.length; i < max; ++i) {
        current_dot = Vec2.dot(poly[i], vec2_dir);
        if (current_dot > max_dot) {
            idx = i;
            max_dot = current_dot;
        }
    }

    out_vec2[0] = poly[idx][0];
    out_vec2[1] = poly[idx][1];

    return idx;
}

var fm_nd = [0, 0],
    fm_a = [0, 0],
    fm_b = [0, 0];

/*
 * furthest Point in the Minkowski diff between A and B polygons for a given direction
 *
 * @param {Vec2} out_vec2
 * @param {Polygon} poly_a
 * @param {Polygon} poly_b
 * @param {Vec2} vec2_dir
 * @return {Vec2}
 */
function furthestMinkowski(out_vec2, poly_a, poly_b, vec2_dir) {
    // furthest point in poly_a for vec2_dir
    furthestPoint(fm_a, poly_a, vec2_dir);

    // furthest point in poly_b for -vec2_dir
    vec2_negate(fm_nd, vec2_dir);
    furthestPoint(fm_b, poly_b, fm_nd);

    return vec2_sub(out_vec2, fm_a, fm_b);
}

/**
 * Calculate Minkowski Difference
 *
 * @param {Polygon} poly_a
 * @param {Polygon} poly_b
 * @return {Polygon} a new one, because the size is random
 */
function MinkowskiDifference(poly_a, poly_b) {
    var i,
        imax = poly_a.length,
        j,
        jmax = poly_b.length,
        scale = imax * jmax,
        minkSum = new Array(scale),
        idx = 0;

    for (i = 0; i < imax; ++i) {
        for (j = 0; j < jmax; ++j) {
            minkSum[idx++] = [poly_a[i][0] - poly_b[j][0], poly_a[i][1] - poly_b[j][1]];
        }
    }

    return createConvexHull(minkSum);
}
/**
 * @source http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
 * @source http://www.physicsforums.com/showthread.php?t=25293&page=2&pp=15
 * @param {Polygon} poly
 * @param {Number} mass
 */
function momentOfInertia(poly, mass) {
    var denom = 0.0,
        numer = 0.0,
        len = poly.length,
        i = 0,
        j = len - 1,
        p0,
        p1,
        a,
        b;

    for (; i < len; j = i++) {
        p0 = poly[j];
        p1 = poly[i];
        a = abs(vec2_crossLength(p0, p1));
        b = vec2_dot(p1, p1) + vec2_dot(p1, p0) + vec2_dot(p0, p0);
        denom += a * b;
        numer += a;
    }
    return (mass / 6.0) * (denom / numer);
}

/**
 * @source http://paulbourke.net/geometry/polygonmesh/
 * @param {Polygon} poly
 */
function isConvex(poly) {
    var len = poly.length,
        i,
        j = 1,
        k = 2,
        flag = 0,
        z;

    if (len < 3) {
        return -1;
    }

    for (i = 0; i < len; ++i, ++j, ++k) {
        j = j % len;
        k = k % len;

        z  = (poly[j][0] - poly[i][0]) * (poly[k][1] - poly[j][1]) -
             (poly[j][1] - poly[i][1]) * (poly[k][0] - poly[j][0]);
        if (z < 0) {
            flag |= 1;
        } else if (z > 0) {
            flag |= 2;
        }

        if (flag === 3) {
            return false;
        }
    }

    if (flag !== 0) {
       return true;
    }

    return -1;
}

/**
 * @param {Polygon} poly
 */
function toString(poly) {
    var vec2s = [],
        i,
        len = poly.length;

    for (i = 0; i < len; ++i) {
        vec2s.push(Vec2.toString(poly[i]));
    }

    return "{" + vec2s.join(",") + "}";
}

/**
 * @class Polygon
 */
var Polygon = {
    create: create,
    createConvexHull: createConvexHull,
    fromAABB: fromAABB,
    fromRectangle: fromRectangle,
    fromBeizer: fromBeizer,
    fromCircle: fromCircle,
    translate: translate,
    isConvex: isConvex,
    rotate: rotate,
    centroid: centroid,
    recenter: recenter,
    //circumcenter: circumcenter,
    area: area,
    transform: transform,

    normals: normals,
    edges: edges,

    isVec2Inside: isVec2Inside,
    furthestPoint: furthestPoint,
    furthestMinkowski: furthestMinkowski,
    MinkowskiDifference: MinkowskiDifference,

    //physics
    momentOfInertia: momentOfInertia,

    toString: toString
};

module.exports = Polygon;
