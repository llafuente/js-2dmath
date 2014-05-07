/**
* @todo cache Vec2 calls / initilizations
* @todo stress test
*/


// the algorithm doesn't always converge for curved shapes.
// need these constants to dictate how accurate we want to be.
var gjkAccuracy = 0.0001;
var gjkMaxIterations = 100;
var Vec2 = require("./vec2.js");

// the output will not be modify that why there is no out argument
function furthestPoint(poly, direction) {
    var fPoint,
        maxDot,
        i,
        fDot;

    maxDot = -Infinity;

    for (i = 0; i < poly.length; i++) {
        fDot = Vec2.dot(poly[i], direction);
        if (fDot > maxDot) {
            fPoint = poly[i];
            maxDot = fDot;
        }
    }

    return fPoint;
}

// furthest Point in the Minkowski diff between A and B for a direction d
var fm_nd = [0, 0];
function furthestMinkowski(A, B, d) {
    var a, b;
    // furthest point in A for d
    a = furthestPoint(A, d);

    // furthest point in B for -d
    Vec2.negate(fm_nd, d);
    b = furthestPoint(B, fm_nd);

    return Vec2.sub([0, 0], a, b);
}

// get the next search direction from two simplex points
var getNextSearchDir = function getNextSearchDir(ptA, ptB, dir) {

    var ABdotB = Vec2.lengthSq(ptB) - Vec2.dot(ptB, ptA),
        ABdotA = Vec2.dot(ptB, ptA) - Vec2.lengthSq(ptA);

    // if the origin is farther than either of these points
    // get the direction from one of those points to the origin
    if (ABdotB < 0) {
        return Vec2.negate(dir, ptB);
    } else if (ABdotA > 0) {
        return Vec2.negate(dir, ptA);
    // otherwise, use the perpendicular direction from the simplex
    }

    // dir = AB = B - A
    Vec2.sub(dir, ptB, ptA);
    // if (left handed coordinate system)
    // A cross AB < 0 then get perpendicular counterclockwise
    //return dir.perp( (ptA.cross( dir ) > 0) );
    return Vec2.perp(dir, dir);
};

/** hide
* getClosestPoints( simplex ) -> Object
* - simplex (Array): The simplex
*
* Figure out the closest points on the original objects
* from the last two entries of the simplex
**/
function getClosestPoints(simplex) {

    // see http://www.codezealot.org/archives/153
    // for algorithm details

    // we know that the position of the last point
    // is very close to the previous. (by nature of the distance test)
    // this won't give great results for the closest
    // points algorithm, so let's use the previous two
    var len = simplex.length,
        last = simplex[len - 2],
        prev = simplex[len - 3],
        A = Vec2.clone(last),
        // L = B - A
        L = Vec2.sub([0, 0], prev, A),
        lambdaB,
        lambdaA;

    if (Vec2.near(L, Vec2.ZERO, Math.EPS)) {
        // oh.. it's a zero vector. So A and B are both the closest.
        // just use one of them
        return {
            a: last.a,
            b: last.b
        };
    }

    lambdaB = - Vec2.dot(L, A) / Vec2.lengthSq(L);
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
        aux = [0, 0];

    Vec2.scale(a, last.a, lambdaA);
    Vec2.scale(aux, prev.a, lambdaB);
    Vec2.add(a, a, aux);

    var b = [0, 0];
    Vec2.scale(b, last.b, lambdaA);
    Vec2.scale(aux, prev.b, lambdaB);
    Vec2.add(b, b, aux);

    return {
        // a closest = lambdaA * Aa + lambdaB * Ba
        a: a,
        // b closest = lambdaA * Ab + lambdaB * Bb
        b: b
    };
}

/**
* credits - https://github.com/wellcaffeinated/PhysicsJS
*
* Implementation of Gilbert–Johnson–Keerthi (GJK)
*
* For general information about GJK see:
* - [www.codezealot.org/archives/88](http://www.codezealot.org/archives/88)
* - [mollyrocket.com/849](http://mollyrocket.com/849)
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
*
*
* @returns {Object}
**/
function gjk(A, B, his_simplex, checkOverlapOnly) {

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
        v1 = [0, 0],
        v2 = [0, 0],
        ab,
        ac,
        sign,
        tmp,
        iterations = 0,
        dead = [],
        deadlen;

    // get the first Minkowski Difference point
    //tmp = support(dir);
    tmp = furthestMinkowski(A, B, dir);
    simplexLen = simplex.push(tmp);
    Vec2.copy(last, tmp);
    // negate d for the next point
    Vec2.negate(dir, dir);

    console.log("simplex", Polygon.toString(simplex));

    // start looping
    gjk_end:
    while (++iterations) {

        // swap last and lastlast, to save on memory/speed
        Vec2.swap(last, lastlast);
        // push a new point to the simplex because we haven't terminated yet
        //tmp = support(dir);
        tmp = furthestMinkowski(A, B, dir);
        simplexLen = simplex.push(tmp);
        Vec2.copy(last, tmp);

        //<debug>
        //Draw.polygon(ctx, simplex, "rgba(255, 0, 0, 0.1)", true);
        //console.log("simplex", iterations, Polygon.toString(simplex), "last", Vec2.toString(last));
        //@TODO history!
        //</debug>

        // @TODO experimental, seems to work, confirm it!
        if (dead.length) {
            deadlen = dead.length - 1;
            while(deadlen--) {
                if (dead[deadlen][0] === last[0] && dead[deadlen][1] === last[1]) {
                    break gjk_end;
                }
            }
        }


        if (Vec2.near(last, Vec2.ZERO, Math.EPS)) {
            console.log("we happened to pick the origin as a support point... lucky.");
            // we happened to pick the origin as a support point... lucky.
            overlap = true;
            break;
        }

        // check if the last point we added actually passed the origin
        if (!noOverlap && Vec2.dot(last, dir) <= 0.0) {
            console.log("check! -- ", Vec2.dot(last, dir));
            // if the point added last was not past the origin in the direction of d
            // then the Minkowski difference cannot possibly contain the origin since
            // the last point added is on the edge of the Minkowski Difference

            // if we just need the overlap...
            //if (checkOverlapOnly) {
            //    break;
            //}

            noOverlap = true;
        }

        // if it's a line...
        if (simplexLen === 2) {

            // otherwise we need to determine if the origin is in
            // the current simplex and act accordingly

            dir = getNextSearchDir(last, lastlast, dir);
            // continue...

        // if it's a triangle... and we're looking for the distance
        } else if (noOverlap) {

            // if we know there isn't any overlap and
            // we're just trying to find the distance...
            // make sure we're getting closer to the origin
            Vec2.normalize(dir, dir);
            tmp = Vec2.dot(lastlast, dir);
            if (Math.abs(tmp - Vec2.dot(last, dir)) < gjkAccuracy) {

                distance = -tmp;
                break;
            }

            // if we are still getting closer then only keep
            // the points in the simplex that are closest to
            // the origin (we already know that last is closer
            // than the previous two)
            // the norm is the same as distance(origin, a)
            // use norm squared to avoid the sqrt operations
            if (Vec2.lengthSq(lastlast) < Vec2.lengthSq(simplex[0])) {
                dead.push(simplex.shift());
            } else {
                dead.push(simplex.splice(1, 1)[0]);
            }

            dir = getNextSearchDir(simplex[1], simplex[0], dir);
            // continue...

        // if it's a triangle
        } else {

            // we need to trim the useless point...

            ab = ab || [0, 0];
            ac = ac || [0, 0];

            // get the edges AB and AC
            Vec2.sub(ab, lastlast, last);
            Vec2.sub(ac, simplex[0], last);

            // here normally people think about this as getting outward facing
            // normals and checking dot products. Since we're in 2D
            // we can be clever...
            sign = Vec2.cross(ab, ac) > 0;

            if (sign ^ (Vec2.cross(last, ab) > 0)) {

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

                sign ? Vec2.perp(dir, ab) : Vec2.rperp(dir, ab);


                // continue...

                // if we get to this if, then it means we can continue to look along
                // the other outward normal direction (ACperp)
                // if we don't see the origin... then we must have it enclosed
            } else if (sign ^ (Vec2.cross(ac, last) > 0)) {
                // then the origin is along the outward facing normal
                // of AC; (ACperp)

                // point B is dead to us now...
                dead.push(simplex.splice(1, 1)[0]);

                //ac.perp( sign );
                //// swap
                //dir.swap( ab );

                sign ? Vec2.rperp(dir, ac) : Vec2.perp(dir, ac);

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
        tmp.closest = getClosestPoints(simplex);
    }

    return tmp;
}

module.exports = gjk;