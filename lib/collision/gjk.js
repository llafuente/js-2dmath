/**
*
* Copyright (c) 2013 Jasper Palfree http://wellcaffeinated.net/PhysicsJS/
*
* Adapted and optimized by Luis Lafuente <llafuente@noboxout.com>
*
* @todo stress test
* @source https://github.com/wellcaffeinated/PhysicsJS
* @reference https://github.com/felipetavares/bomberman/blob/master/web/modules/collision.js
* @reference http://www.codezealot.org/archives/88
* @reference http://mollyrocket.com/849
*/


// the algorithm doesn't always converge for curved shapes.
// need these constants to dictate how accurate we want to be.
var EPS = Math.EPS,
    abs = Math.abs,
    gjkMaxIterations = 100,
    Vec2 = require("../vec2.js"),
    vec2_lengthSq = Vec2.lengthSq,
    vec2_dot = Vec2.dot,
    vec2_negate = Vec2.negate,
    vec2_sub = Vec2.sub,
    vec2_perp = Vec2.perp,
    vec2_rperp = Vec2.rperp,
    vec2_copy = Vec2.copy,
    vec2_near = Vec2.near,
    vec2_ZERO = Vec2.ZERO,
    vec2_scale = Vec2.scale,
    vec2_add = Vec2.add,
    vec2_normalize = Vec2.normalize,
    vec2_swap = Vec2.swap,
    vec2_cross = Vec2.cross,
    Polygon = require("../polygon.js");

// get the next search direction from two simplex points
function _getNextSearchDir(ptA, ptB, dir) {

    var ABdotB = vec2_lengthSq(ptB) - vec2_dot(ptB, ptA),
        ABdotA = vec2_dot(ptB, ptA) - vec2_lengthSq(ptA);

    // if the origin is farther than either of these points
    // get the direction from one of those points to the origin
    if (ABdotB < 0) {
        return vec2_negate(dir, ptB);
    } else if (ABdotA > 0) {
        return vec2_negate(dir, ptA);
    // otherwise, use the perpendicular direction from the simplex
    }

    // dir = AB = B - A
    vec2_sub(dir, ptB, ptA);
    // if (left handed coordinate system)
    // A cross AB < 0 then get perpendicular counterclockwise
    //return dir.perp( (ptA.cross( dir ) > 0) );
    return vec2_perp(dir, dir);
}


var gcp_A = [0, 0],
    gcp_L = [0, 0],
    gcp_aux = [0, 0];

/** hide
* _getClosestPoints( simplex ) -> Object
* - simplex (Array): The simplex
*
* Figure out the closest points on the original objects
* from the last two entries of the simplex
**/
function _getClosestPoints(simplex) {

    // see http://www.codezealot.org/archives/153
    // for algorithm details

    // we know that the position of the last point
    // is very close to the previous. (by nature of the distance test)
    // this won't give great results for the closest
    // points algorithm, so let's use the previous two
    var len = simplex.length,
        last = simplex[len - 2],
        prev = simplex[len - 3],
        lambdaB,
        lambdaA;

    vec2_copy(gcp_A, last);

    // L = B - A
    vec2_sub(gcp_L, prev, gcp_A);

    if (vec2_near(gcp_L, vec2_ZERO, EPS)) {
        // oh.. it's a zero vector. So A and B are both the closest.
        // just use one of them
        return {
            a: last.a,
            b: last.b
        };
    }

    lambdaB = - vec2_dot(gcp_L, gcp_A) / vec2_lengthSq(gcp_L);
    lambdaA = 1 - lambdaB;

    if (lambdaA <= 0) {
        // woops.. that means the closest simplex point
        // isn't on the line it's point B itself
        return {
            a: prev.a,
            b: prev.b
        };
    } else if (lambdaB <= 0) {
        // vice versa
        return {
            a: last.a,
            b: last.b
        };
    }

    // guess we'd better do the math now...
    var a = [0, 0],
        b = [0, 0];

    vec2_scale(a, last.a, lambdaA);
    vec2_scale(gcp_aux, prev.a, lambdaB);
    vec2_add(a, a, gcp_aux);

    vec2_scale(b, last.b, lambdaA);
    vec2_scale(gcp_aux, prev.b, lambdaB);
    vec2_add(b, b, gcp_aux);

    return {
        // a closest = lambdaA * Aa + lambdaB * Ba
        a: a,
        // b closest = lambdaA * Ab + lambdaB * Bb
        b: b
    };
}

/**
*
* Implementation of Gilbert–Johnson–Keerthi (GJK)
*
*
* Returned object
*
* ```javascript
* {
*   overlap: Boolean,
*   simplex: Polygon,
*   distance: Number,
*   closest: Vec2
* }
* ```
* @todo distance seem to be not 100% right
*
* @return {Object}
**/
function getPolygonPolygon(a_points, b_points) {

    var overlap = false,
        noOverlap = false, // if we're sure we're not overlapping
        distance = false,
        simplex = [],
        simplexLen = 1,
        // use seed as starting direction or use x axis
        dir = [0, 1],
        last = [0, 0],
        lastlast = [0, 0],
        // some temp vectors
        ab,
        ac,
        sign,
        tmp,
        iterations = 0,
        dead = [],
        deadlen;

    // get the first Minkowski Difference point
    //tmp = support(dir);
    tmp = Polygon.furthestMinkowski([0, 0], a_points, b_points, dir);
    simplexLen = simplex.push(tmp);
    vec2_copy(last, tmp);
    // negate d for the next point
    vec2_negate(dir, dir);

    //console.log("simplex", Polygon.toString(simplex));

    // start looping
    gjk_end:
    while (++iterations) {

        // swap last and lastlast, to save on memory/speed
        vec2_swap(last, lastlast);
        // push a new point to the simplex because we haven't terminated yet
        //tmp = support(dir);
        tmp = Polygon.furthestMinkowski([0, 0], a_points, b_points, dir);
        simplexLen = simplex.push(tmp);
        vec2_copy(last, tmp);

        //<debug>
        //Draw.polygon(ctx, simplex, "rgba(255, 0, 0, 0.1)", true);
        //console.log("simplex", iterations, Polygon.toString(simplex), "last", Vec2.toString(last));
        //@TODO history!
        //</debug>

        // @TODO experimental, seems to work, confirm it!
        if (dead.length) {
            deadlen = dead.length - 1;
            while (deadlen--) {
                if (dead[deadlen][0] === last[0] && dead[deadlen][1] === last[1]) {
                    break gjk_end;
                }
            }
        }


        if (vec2_near(last, vec2_ZERO, EPS)) {
            // we happened to pick the origin as a support point... lucky.
            overlap = true;
            break;
        }

        // check if the last point we added actually passed the origin
        if (!noOverlap && vec2_dot(last, dir) <= 0.0) {
            // if the point added last was not past the origin in the direction of d
            // then the Minkowski difference cannot possibly contain the origin since
            // the last point added is on the edge of the Minkowski Difference

            noOverlap = true;
        }

        // if it's a line...
        if (simplexLen === 2) {

            // otherwise we need to determine if the origin is in
            // the current simplex and act accordingly

            dir = _getNextSearchDir(last, lastlast, dir);
            // continue...

        // if it's a triangle... and we're looking for the distance
        } else if (noOverlap) {

            // if we know there isn't any overlap and
            // we're just trying to find the distance...
            // make sure we're getting closer to the origin
            vec2_normalize(dir, dir);
            tmp = vec2_dot(lastlast, dir);

            if (abs(tmp - vec2_dot(last, dir)) < EPS) {
                distance = -tmp;
                break;
            }

            // if we are still getting closer then only keep
            // the points in the simplex that are closest to
            // the origin (we already know that last is closer
            // than the previous two)
            // the norm is the same as distance(origin, a)
            // use norm squared to avoid the sqrt operations
            if (vec2_lengthSq(lastlast) < vec2_lengthSq(simplex[0])) {
                dead.push(simplex.shift());
            } else {
                dead.push(simplex.splice(1, 1)[0]);
            }

            dir = _getNextSearchDir(simplex[1], simplex[0], dir);
            // continue...

        // if it's a triangle
        } else {

            // we need to trim the useless point...

            ab = ab || [0, 0];
            ac = ac || [0, 0];

            // get the edges AB and AC
            vec2_sub(ab, lastlast, last);
            vec2_sub(ac, simplex[0], last);

            // here normally people think about this as getting outward facing
            // normals and checking dot products. Since we're in 2D
            // we can be clever...
            sign = vec2_cross(ab, ac) > 0;

            if (sign ^ (vec2_cross(last, ab) > 0)) {

                // ok... so there's an XOR here... don't freak out
                // remember last = A = -AO
                // if AB cross AC and AO cross AB have the same sign
                // then the origin is along the outward facing normal of AB
                // so if AB cross AC and A cross AB have _different_ (XOR) signs
                // then this is also the case... so we proceed...

                // point C is dead to us now...
                dead.push(simplex.shift());

                // if we haven't deduced that we've enclosed the origin
                // then we know which way to look...
                // morph the ab vector into its outward facing normal

                //ab.perp( !sign );
                //// swap
                //dir.swap( ab );

                sign ? vec2_perp(dir, ab) : vec2_rperp(dir, ab);


                // continue...

                // if we get to this if, then it means we can continue to look along
                // the other outward normal direction (ACperp)
                // if we don't see the origin... then we must have it enclosed
            } else if (sign ^ (vec2_cross(ac, last) > 0)) {
                // then the origin is along the outward facing normal
                // of AC; (ACperp)

                // point B is dead to us now...
                dead.push(simplex.splice(1, 1)[0]);

                //ac.perp( sign );
                //// swap
                //dir.swap( ab );

                sign ? vec2_rperp(dir, ac) : vec2_perp(dir, ac);

                // continue...

            } else {

                // we have enclosed the origin!
                overlap = true;
                // fewf... take a break
                break;
            }
        }

        // woah nelly... that's a lot of iterations.
        // Stop it!
        if (iterations > gjkMaxIterations) {
            return {
                simplex: simplex,
                iterations: iterations,
                distance: 0,
                maxIterationsReached: true
            };
        }
    }

    tmp = {
        overlap: overlap,
        simplex: simplex,
        iterations: iterations
    };

    if (distance !== false) {

        tmp.distance = distance;
        tmp.closest = _getClosestPoints(simplex);
    }

    return tmp;
}

module.exports = {
    getPolygonPolygon: getPolygonPolygon
};