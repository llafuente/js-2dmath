/**
 * @reference http://www.codezealot.org/archives/180
 * @reference https://github.com/LSFN/dyn4go/blob/383474ee3924d626a1c106bc717f07deb76b9635/collision/narrowphase/EPA.go
 * @reference https://github.com/BrandonLittell/PinballGL/blob/d2678f0e916cdb8b8a234243feeda03a196e5bc8/Group3_FinalProject/Collision.cpp
 */

var Vec2 = require("../vec2.js"),
    vec2_sub = Vec2.sub,
    vec2_cross = Vec2.cross,
    vec2_tripleProduct = Vec2.tripleProduct,
    vec2_normalize = Vec2.normalize,
    vec2_dot = Vec2.dot,
    Polygon = require("../polygon.js"),
    clear = require("./response.js").clear,
    polygon_furthestMinkowski = Polygon.furthestMinkowski;

var gw_aux = [0, 0];
var gw_aux2 = [0, 0];
function _getWinding(simplex) {
    vec2_sub(gw_aux, simplex[1], simplex[0]);
    vec2_sub(gw_aux2, simplex[2], simplex[1]);
    return vec2_cross(gw_aux, gw_aux2);


    var len = simplex.length,
        i = 0,
        j,
        f;

    for (; i < len; ++i) {
        j = i + 1;
        if (j === len) {
            j = 0;
        }
        f = vec2_cross(simplex[i], simplex[j]);

        if (f > 0) {
            return 1;
        } else if (f < 0) {
            return -1;
        }
    }
    return 0;
}

var edge = [0, 0];
function _findClosestEdge(simplex, winding) {
    // prime the distance of the edge to the max
    var distance = Infinity,
        a,
        i,
        j,
        d,
        n = [0, 0],
        normal = [0, 0],
        index,
        len = simplex.length,
        lenm1 = len - 1;

    // simplex is the passed in simplex
    for (i = 0; i < len; i++) {
        // compute the next points index
        j = i === lenm1 ? 0 : i + 1;
        // get the current point and the next one
        a = simplex[i];
        // b = simplex[j];
        // create the edge vector
        vec2_sub(edge, simplex[j], a); // or a.to(b);
        // console.log("edge", edge, "@", i, j, a, simplex[j]);
        // get the vector from the origin to a
        //Vector oa = a; // or a - ORIGIN

        // get the vector from the edge towards the origin
        //vec2_tripleProduct(n, edge, a, edge);
        //----------------------------------------------------------------------
        // @llafuente: winding method seems to be more reliable to find MTV
        if (winding > 0) {
            Vec2.rotateCW(n, edge);
        } else {
            Vec2.rotateCCW(n, edge);
        }
        // normalize the vector
        //----------------------------------------------------------------------

        vec2_normalize(n, n);
        // console.log("tripleProduct", n, edge, a, edge);
        // calculate the distance from the origin to the edge
        d = vec2_dot(a, n); // could use b or a here
        // check the distance against the other distances
        // console.log("d = a.dot(n) =", d, distance);
        if (d < distance) {
            // if this edge is closer then use it
            distance = d;
            normal[0] = n[0];
            normal[1] = n[1];
            index = j;
        }
    }
    // return the closest edge we found
    return {
        distance: distance,
        normal: normal,
        index: index,
    };
}

/**
 * @TODO the current implementation has no max iterations, but seems to work review edge cases
 *
 */
function EPA(out_response, A, B, simplex) {
    //simplex = [[4, 2], [-8, -2], [-1, -2]];
    clear(out_response);

    var edge,
        depth,
        p,
        winding = _getWinding(simplex);
    console.log("winding", winding);

    //redo the simplex
    if (winding <= 0) {
        simplex.reverse();
    }

    // loop to find the collision information
    while (true) {
        // console.log("***************************", Polygon.toString(simplex));
        // obtain the feature (edge for 2D) closest to the origin on the Minkowski Difference
        edge = _findClosestEdge(simplex, winding);
        // console.log("_findClosestEdge", edge);
        // obtain a new support point in the direction of the edge normal
        p = polygon_furthestMinkowski([0, 0], A, B, edge.normal);
        // check the distance from the origin to the edge against the
        // distance p is along edge.normal
        depth = vec2_dot(p, edge.normal);
        // console.log(max, "distance", depth, edge.distance);
        if (depth - edge.distance < Math.EPS) {
            // the tolerance should be something positive close to zero (ex. 0.00001)

            // if the difference is less than the tolerance then we can
            // assume that we cannot expand the simplex any further and
            // we have our solution
            out_response.mtv = edge.normal;
            out_response.depth = depth;

            return true;
        } else {
            // we haven't reached the edge of the Minkowski Difference
            // so continue expanding by adding the new point to the simplex
            // in between the points that made the closest edge
            // console.log(simplex[edge.index], p);
            simplex.splice(edge.index, 0, p);
        }
    }
}


module.exports = EPA;
