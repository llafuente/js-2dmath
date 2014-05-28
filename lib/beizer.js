/**
 * Stability: 1 (Only additions & fixes)
 *
 * @reference http://pomax.github.io/bezierinfo/
 * @reference https://github.com/jackcviers/Degrafa/blob/master/Degrafa/com/degrafa/geometry/utilities/BezierUtils.as
 * @reference http://cagd.cs.byu.edu/~557/text/ch7.pdf
 * @reference http://algorithmist.wordpress.com/2009/02/02/degrafa-closest-point-on-quad-bezier/
 * @reference http://algorithmist.wordpress.com/2009/01/26/degrafa-bezierutils-class/
*/
var sqrt = Math.sqrt,
    cl0 = 0,
    cl1 = 0,
    cl2 = 0,
    cl3 = 0,
    t1 = 0,
    t2 = 0,
    t3 = 0;

/**
 * cp0 - start point
 * cp1 - start control point
 * cp2 - end control point
 * cp3 - end
 *
 * @returns {Beizer}
 */
function cubic(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y, cp3x, cp3y) {
    return [[cp0x, cp0y], [cp1x, cp1y], [cp2x, cp2y], [cp3x, cp3y]];
}
/**
 * Figure 21.2
 * http://pomax.github.io/bezierinfo/
 * @todo DO IT!
 */
function from3Points(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {
}
/**
 * @returns {Beizer}
 */
function quadric(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {
    return [[cp0x, cp0y], [cp1x, cp1y], [cp2x, cp2y]];
}
/**
 * Figure 21.1
 * @reference http://pomax.github.io/bezierinfo/
 */
function quadricFrom3Points(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {

}
/**
 * Solves the curve (quadric or cubic) for any given parameter t.
 * @source https://github.com/hyperandroid/CAAT/blob/master/src/Math/Bezier.js
 * @returns {Vec2}
 */
function solve(out_vec2, curve, t) {
    if (curve.length === 4) {
        //cubic
        t2 = t * t;
        t3 = t * t2;
        cl0 = curve[0];
        cl1 = curve[1];
        cl2 = curve[2];
        cl3 = curve[3];

        out_vec2[0] = (cl0[0] + t * (-cl0[0] * 3 + t * (3 * cl0[0] - cl0[0] * t))) +
                   t * (3 * cl1[0] + t * (-6 * cl1[0] + cl1[0] * 3 * t)) +
                   t2 * (cl2[0] * 3 - cl2[0] * 3 * t) +
                   cl3[0] * t3;
        out_vec2[1] = (cl0[1] + t * (-cl0[1] * 3 + t * (3 * cl0[1] - cl0[1] * t))) +
                   t * (3 * cl1[1] + t * (-6 * cl1[1] + cl1[1] * 3 * t)) +
                   t2 * (cl2[1] * 3 - cl2[1] * 3 * t) +
                   cl3[1] * t3;
    } else {
        // quadric

        cl0 = curve[0];
        cl1 = curve[1];
        cl2 = curve[2];
        t1 = 1 - t;

        out_vec2[0] = t1 * t1 * cl0[0] + 2 * t1 * t * cl1[0] + t * t * cl2[0];
        out_vec2[1] = t1 * t1 * cl0[1] + 2 * t1 * t * cl1[1] + t * t * cl2[1];
    }

    return out_vec2;
}
/**
 * @see Polygon.fromBeizer
 * @returns {Array}
 */
function getPoints(curve, npoints) {
    var inv_npoints = 1 / npoints,
        i,
        output = [],
        vec2;

    for (i = 0; i <= 1; i += inv_npoints) {
        vec2 = [];
        output.push(solve(vec2, curve, i));
    }

    return output;
}
/**
 * Calculate the curve length by incrementally solving the curve every substep=CAAT.Curve.k. This value defaults
 * to .05 so at least 20 iterations will be performed.
 * @todo some kind of cache maybe it's needed!
 * @returnss {Number} the approximate curve length.
 */
function length(curve, step) {
    step = step || 0.05;

    var x1,
        y1,
        llength = 0,
        pt = [0, 0],
        t;

    x1 = curve[0][0];
    y1 = curve[0][1];
    for (t = step; t <= 1 + step; t += step) {
        solve(pt, curve, t);
        llength += sqrt((pt[0] - x1) * (pt[0] - x1) + (pt[1] - y1) * (pt[1] - y1));
        x1 = pt[0];
        y1 = pt[1];
    }

    return llength;
}

/**
 * credits - CAAT
 *
 * @class Beizer
 */
var Beizer = {
    cubic: cubic,
    quadric: quadric,
    solve: solve,
    length: length,
    getPoints: getPoints
};


module.exports = Beizer;