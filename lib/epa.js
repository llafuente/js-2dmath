/**
* @source http://www.codezealot.org/archives/180
*/

var Vec2 = require("./vec2.js");
var Polygon = require("./polygon.js");

var edge = [0, 0];
function findClosestEdge(simplex) {
    // prime the distance of the edge to the max
    var distance = Infinity,
        oa,
        a,
        i,
        j,
        d,
        n,
        normal,
        index,
        len = simplex.length,
        lenm1 = len -1;

    // simplex is the passed in simplex
    for (i = 0; i < len; i++) {
        // compute the next points index
        j = i === lenm1 ? 0 : i + 1;
        // get the current point and the next one
        a = simplex[i];
        // b = simplex[j];
        // create the edge vector
        Vec2.sub(edge, simplex[j], a); // or a.to(b);
        // console.log("edge", edge, "@", i, j, a, simplex[j]);
        // get the vector from the origin to a
        //Vector oa = a; // or a - ORIGIN

        // get the vector from the edge towards the origin
        n = [0, 0];
        Vec2.tripleProduct(n, edge, a, edge);
        // normalize the vector
        Vec2.normalize(n, n);
        // console.log("tripleProduct", n, edge, a, edge);
        // calculate the distance from the origin to the edge
        d = Vec2.dot(a, n); // could use b or a here
        // check the distance against the other distances
        // console.log("d = a.dot(n) =", d, distance);
        if (d < distance) {
            // if this edge is closer then use it
            distance = d;
            normal = n;
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

function EPA(A, B, simplex) {
    //simplex = [[4, 2], [-8, -2], [-1, -2]];

    var e,
        d,
        p,
        max = 10;

    // loop to find the collision information
    while (true) {
        // console.log("***************************", Polygon.toString(simplex));
        // obtain the feature (edge for 2D) closest to the origin on the Minkowski Difference
        e = findClosestEdge(simplex);
        // console.log("findClosestEdge", e);
        // obtain a new support point in the direction of the edge normal
        p = Polygon.furthestMinkowski([0, 0], A, B, e.normal);
        // check the distance from the origin to the edge against the
        // distance p is along e.normal
        d = Vec2.dot(p, e.normal);
        // console.log(max, "distance", d, e.distance);
        if (d - e.distance < Math.EPS) {
            // the tolerance should be something positive close to zero (ex. 0.00001)

            // if the difference is less than the tolerance then we can
            // assume that we cannot expand the simplex any further and
            // we have our solution
            return {
                normal: e.normal,
                depth: d
            }
        } else {
            // we haven't reached the edge of the Minkowski Difference
            // so continue expanding by adding the new point to the simplex
            // in between the points that made the closest edge
            // console.log(simplex[e.index], p);
            simplex.splice(e.index, 0, p);
        }
    }
}


module.exports = EPA;