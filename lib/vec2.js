/**
 * Stability: 2 (fixes / performance improvements)
 *
 * Vec2 is represented as a two coordinates array
 * [x:Number, y:Number]
 */

var aux_vec = [0, 0],
    __x = 0,
    __y = 0,
    aux_number1 = 0,
    aux_number2 = 0,
    aux_number3 = 0,

    //cache
    EPS = Math.EPS,
    acos = Math.acos,
    cos  = Math.cos,
    sqrt = Math.sqrt,
    __abs  = Math.abs,
    sin  = Math.sin,
    __min  = Math.min,
    atan2 = Math.atan2,
    __pow = Math.pow,

    HALF_NPI = Math.HALF_NPI,
    HALF_PI = Math.HALF_PI,

    DEG_TO_RAD = Math.DEG_TO_RAD,
    Vec2;

/**
 * Create a Vec2 given two coords
 *
 * @param {Vec2|Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function create(x, y) {
    return [x, y];
}

/**
 * Create a Vec2 given length and angle
 *
 * @param {Number} length
 * @param {Number} degrees
 * @return {Vec2}
 */
function dFromPolar(length, degrees) {
    return fromPolar(length, degrees * DEG_TO_RAD);
}

/**
 * Create a Vec2 given length and angle
 *
 * @param {Number} length
 * @param {Number} radians
 * @return {Vec2}
 */
function fromPolar(length, radians) {
    return [length * sin(radians), length * cos(radians)];
}

/**
 * Create an empty Vec2
 *
 * @return {Vec2}
 */
function zero() {
    return [0, 0];
}

/**
 * Clone given vec2
 *
 * @param {Vec2} v1
 * @return {Vec2}
 */
function clone(v1) {
    return [v1[0], v1[1]];
}

// **********************************************************
// comparison operations
// **********************************************************

/**
 * Returns true if both vectors are equal(same coords)
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function equals(v1, v2) {
    return v2[0] === v1[0] && v2[1] === v1[1];
}
/**
 * Returns true if both vectors are "almost(Math.EPS)" equal
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function equalsEpsilon(v1, v2) {
    aux_number1 = __abs(v2[0] - v1[0]);
    aux_number2 = __abs(v2[1] - v1[1]);

    return aux_number1 < EPS && aux_number2 < EPS;
}
/**
 * Returns true both coordinates of v1 area greater than v2
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function gt(v1, v2) {
    return v2[0] > v1[0] && v2[1] > v1[1];
}
/**
 * Returns true both coordinates of v1 area lesser than v2
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function lt(v1, v2) {
    return v2[0] < v1[0] && v2[1] < v1[1];
}

/**
 * Returns true if the distance between v1 and v2 is less than dist.
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} dist
 * @return {Boolean}
 */
function near(v1, v2, dist) {
    // maybe inline
    aux_number1 = sqrDistance(v1, v2);


    return aux_number1 < dist * dist;
}

/**
 * * 0 equal
 * * 1 top
 * * 2 top-right
 * * 3 right
 * * 4 bottom right
 * * 5 bottom
 * * 6 bottom-left
 * * 7 left
 * * 8 top-left
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function compare(v1, v2) {
    var v1x = v1[0],
        v1y = v1[1],
        v2x = v2[0],
        v2y = v2[1];

    if (v2x === v1x && v2y === v1y) {
        return 0;
    }
    if (v2x === v1x) {
        return v2y > v1y ? 1 : 5;
    }
    if (v2y === v1y) {
        return v2x > v1x ? 3 : 7;
    }

    if (v2x > v1x) {
        if (v2y > v1y) {
            return 2;
        }

        if (v2y < v1y) {
            return 4;
        }
    }

    if (v2x < v1x) {
        if (v2y < v1y) {
            return 6;
        }
        if (v2y > v1y) {
            return 8;
        }
    }

    return -1;
}

// **********************************************************
// validation
// **********************************************************
/**
 * The vector does not contain any not number value: ±Infinity || NaN
 *
 * @param {Vec2} v1
 * @return {Boolean}
 */
function isValid(v1) {
    return !(v1[0] === Infinity || v1[0] === -Infinity || isNaN(v1[0]) || v1[1] === Infinity || v1[1] === -Infinity || isNaN(v1[1]));
}
/**
 * Any coordinate is NaN? -> true
 *
 * @param {Vec2} v1
 * @return {Boolean}
 */
function isNaN(v1) {
    return isNaN(v1[0]) || isNaN(v1[1]);
}

// **********************************************************
// first parameter is the output
// **********************************************************

/**
 * Copy v1 into out_vec2
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function copy(out_vec2, v1) {
    out_vec2[0] = v1[0];
    out_vec2[1] = v1[1];

    return out_vec2;
}

/**
 * Negate v1 into out_vec2
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function negate(out_vec2, v1) {
    out_vec2[0] = -v1[0];
    out_vec2[1] = -v1[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function normalize(out_vec2, v1) {
    __x = v1[0];
    __y = v1[1];
    aux_number3 = sqrt(__x * __x + __y * __y);

    if (aux_number3 > EPS) {
        aux_number3 = 1 / aux_number3;
        out_vec2[0] = v1[0] * aux_number3;
        out_vec2[1] = v1[1] * aux_number3;
    }

    return out_vec2;
}
/**
 * Normalize v1 but squared no use sqrt, for performance.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function normalizeSq(out_vec2, v1) {
    __x = v1[0];
    __y = v1[1];
    aux_number3 = __x * __x + __y * __y;

    if (aux_number3 > EPS * EPS) {
        aux_number3 = 1 / aux_number3;
        out_vec2[0] = v1[0] * aux_number3;
        out_vec2[1] = v1[1] * aux_number3;
    }

    return out_vec2;
}
/**
 * Rotate the vector clockwise
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function perpendicular(out_vec2, v1) {
    aux_number1 = v1[0];
    out_vec2[0] = v1[1];
    out_vec2[1] = -aux_number1;

    return out_vec2;
}
/**
 * Rotate the vector counterclockwise
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function rperpendicular(out_vec2, v1) {
    aux_number1 = v1[0];
    out_vec2[0] = -v1[1];
    out_vec2[1] = aux_number1;

    return out_vec2;
}

/**
 * Linearly interpolate between a and b.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} t
 * @return {Vec2}
 */
function lerp(out_vec2, v1, v2, t) {
    out_vec2[0] = v1[0] + (v2[0] - v1[0]) * t;
    out_vec2[1] = v1[1] + (v2[1] - v1[1]) * t;

    return out_vec2;
}

/**
 * Linearly interpolate between v1 towards v2 by distance d.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} d
 * @return {Vec2}
 */
function lerpconst(out_vec2, v1, v2, d) {
    out_vec2[0] = v2[0] - v1[0];
    out_vec2[1] = v2[1] - v1[1];

    clamp(out_vec2, d);

    out_vec2[0] += v1[0];
    out_vec2[1] += v1[1];

    return out_vec2;
}

/**
 * Spherical linearly interpolate between v1 and v2.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} t
 * @return {Vec2}
 */
function slerp(out_vec2, v1, v2, t) {
    var omega = acos(dot(v1, v2)),
        denom;

    if (omega) {
        denom = 1.0 / sin(omega);

        scale(out_vec2, v1, sin((1.0 - t) * omega) * denom);
        scale(aux_vec, sin(t * omega) * denom);

        return add(out_vec2, out_vec2, aux_vec);
    }

    return copy(out_vec2, v1);
}

/**
 * Spherical linearly interpolate between v1 towards v2 by no more than angle a in radians.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} radians
 * @return {Vec2}
 */
function slerpconst(out_vec2, v1, v2, radians) {
    var _radians = acos(dot(v1, v2));
    return slerp(out_vec2, v1, v2, __min(radians, _radians) / _radians);
}

/**
 * Returns the unit length vector for the given angle (in radians).
 *
 * @param {Vec2} out_vec2
 * @param {Number} radians
 * @return {Vec2}
 */
function forAngle(out_vec2, radians) {
    out_vec2[0] = cos(radians);
    out_vec2[1] = sin(radians);

    return out_vec2;
}

/**
 * Returns the vector projection of v1 onto v2.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function project(out_vec2, v1, v2) {
    multiply(out_vec2, v1, v2);
    scale(out_vec2, dot(v1, v2) / dot(v2, v2));

    return out_vec2;
}

/**
 * Rotates the point by the given angle
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} radians
 * @return {Vec2}
 */
function rotate(out_vec2, v1, radians) {
    var s = sin(radians),
        c = cos(radians);

    __x = v1[0];
    __y = v1[1];

    out_vec2[0] = __x * c - __y * s;
    out_vec2[1] = __y * c + __x * s;

    return out_vec2;
}
/**
 * Rotates the point by the given angle around an optional center point.
 *
 * @note center cannot be out_vec2
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} radians
 * @param {Vec2} center
 * @return {Vec2}
 */
function rotateFrom(out_vec2, v1, radians, center) {
    subtract(out_vec2, v1, center);

    __x = out_vec2[0];
    __y = out_vec2[1];

    var s = sin(radians),
        c = cos(radians);


    out_vec2[0] = __x * c - __y * s;
    out_vec2[1] = __y * c + __x * s;

    add(out_vec2, out_vec2, center);

    return out_vec2;
}
/**
 * Rotate a vector given "angle" by a normalized vector v2_n
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2_n
 * @return {Vec2}
 */
function rotateVec(out_vec2, v1, v2_n) {
    out_vec2[0] = v1[0] * v2_n[0] - v1[1] * v2_n[1];
    out_vec2[1] = v1[0] * v2_n[1] + v1[1] * v2_n[0];

    return out_vec2;
}
/**
 * Un-rotate a vector given "angle" by a normalized vector v2_n
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2_n
 * @return {Vec2}
 */
function unrotateVec(out_vec2, v1, v2_n) {
    out_vec2[0] = v1[0] * v2_n[0] + v1[1] * v2_n[1];
    out_vec2[1] = v1[1] * v2_n[0] - v1[0] * v2_n[1];

    return out_vec2;
}
/**
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function midPoint(out_vec2, v1, v2) {
    out_vec2[0] = (v1[0] + v2[0]) * 0.5;
    out_vec2[1] = (v1[1] + v2[1]) * 0.5;

    return out_vec2;
}

var reflect_factor;
/**
 * Reflect v1 by the imaginary line v2_n
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2_n
 * @return {Vec2}
 */
function reflect(out_vec2, v1, v2_n) {
    reflect_factor = dot(v1, v2_n);

    scale(out_vec2, v2_n, 2 * reflect_factor);
    subtract(out_vec2, v1, out_vec2);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function subtract(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] - v2[0];
    out_vec2[1] = v1[1] - v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function subtract2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] - x;
    out_vec2[1] = v1[1] - y;

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function add(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] + v2[0];
    out_vec2[1] = v1[1] + v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function add2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] + x;
    out_vec2[1] = v1[1] + y;

    return out_vec2;
}
/**
 * @see scale
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function multiply(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] * v2[0];
    out_vec2[1] = v1[1] * v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function multiply2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] * x;
    out_vec2[1] = v1[1] * y;

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function divide(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] / v2[0];
    out_vec2[1] = v1[1] / v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function divide2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] / x;
    out_vec2[1] = v1[1] / y;

    return out_vec2;
}
/**
 * @see multiply
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} factor
 * @return {Vec2}
 */
function scale(out_vec2, v1, factor) {
    out_vec2[0] = v1[0] * factor;
    out_vec2[1] = v1[1] * factor;

    return out_vec2;
}
/**
 * (x1^y, y1^y)
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} y
 * @return {Vec2}
 */
function pow(out_vec2, v1, y) {
    if (y === 2) {
        out_vec2[0] = v1[0] * v1[0];
        out_vec2[1] = v1[1] * v1[1];
    } else {
        out_vec2[0] = __pow(v1[0], y);
        out_vec2[1] = __pow(v1[1], y);
    }

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function max(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] > v2[0] ? v1[0] : v2[0];
    out_vec2[1] = v1[1] > v2[1] ? v1[1] : v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function min(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] < v2[0] ? v1[0] : v2[0];
    out_vec2[1] = v1[1] < v2[1] ? v1[1] : v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function abs(out_vec2, v1) {
    out_vec2[0] = __abs(v1[0]);
    out_vec2[1] = __abs(v1[1]);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} factor
 * @return {Vec2}
 */
function scaleAndAdd(out_vec2, v1, v2, factor) {
    out_vec2[0] = v1[0] + (v2[0] * factor);
    out_vec2[1] = v1[1] + (v2[1] * factor);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} length
 * @return {Vec2}
 */
function clamp(out_vec2, v1, length) {
    out_vec2[0] = v1[0];
    out_vec2[1] = v1[1];

    if (dot(v1, v1) > length * length) {
        normalize(out_vec2);
        multiply(out_vec2, length);
    }

    return out_vec2;
}
/**
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} length
 */
function truncate(out_vec2, v1, length) {
    var length_sq = v1[0] * v1[0] + v1[1] * v1[1];
    if (length_sq > length * length) {
        return scale(out_vec2, v1, length / sqrt(length_sq));
    }

    out_vec2[0] = v1[0];
    out_vec2[1] = v1[1];

    return out_vec2;
}

/**
 * Cross product between a vector and the Z component of a vector
 * AKA Rotate CW and scale
 *
 * @todo test use rprependicular ?
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} vec2
 * @param {Number} factor
 * @return {Number}
 */
function crossVZ(out_vec2, vec2, factor) {
    rotate(out_vec2, vec2, HALF_NPI); // Rotate according to the right hand rule
    return scale(out_vec2, out_vec2, factor); // Scale with z
}
/**
 * Cross product between a vector and the Z component of a vector
 * AKA Rotate CCW and scale
 *
 * @todo test use prependicular ?
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} vec2
 * @param {Number} factor
 * @return {Vec2}
 */
function crossZV(out_vec2, factor, vec2) {
    rotate(out_vec2, vec2, HALF_PI);
    return scale(out_vec2, out_vec2, factor);
}

var tp_left = [0, 0],
    tp_right = [0, 0];
/**
 * (A x B) x C = B(C · A) - A(C · B)
 * (A x B) x C = B(A.dot(C)) - A(B.dot(C))
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Vec2} v3
*/
function tripleProduct(out_vec2, v1, v2, v3) {
    scale(tp_left, v2, dot(v1, v3));

    scale(tp_right, v1, dot(v2, v3));

    return subtract(out_vec2, tp_left, tp_right);
}

// **********************************************************
// functions that return numbers
// **********************************************************

/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function magnitude(v1, v2) {
    __x = v1[0] - v2[0];
    __y = v1[1] - v2[1];

    return __x / __y;
}

/**
 * v1 · v2 = |a| * |b| * sin θ
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * v1 × v2 = |a| * |b| * sin θ
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function cross(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
}
/**
 * @param {Vec2} v1
 * @return {Number}
 */
function toAngle(v1) {
    return atan2(v1[1], v1[0]);
}

/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function angleTo(v1, v2) {
    return atan2(v2[1] - v1[1], v2[0] - v1[0]);
}

var distance_x,
    distance_y;
/**
 * Returns the distance between v1 and v2.
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function distance(v1, v2) {
    //subtract
    distance_x = v2[0] - v1[0];
    distance_y = v2[1] - v1[1];
    //sqrLength
    return sqrt(distance_x * distance_x + distance_y * distance_y);
}
/**
 * Distance without using sqrt (squared distance)
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function sqrDistance(v1, v2) {
    //subtract
    distance_x = v1[0] - v2[0];
    distance_y = v1[1] - v2[1];
    //sqrLength
    return distance_x * distance_x + distance_y * distance_y;
}

/**
 * Return vector the length.
 *
 * @param {Vec2} v1
 * @return {Number}
 */
function length(v1) {
    return sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
}
/**
 * Squared length (no sqrt)
 *
 * @param {Vec2} v1
 * @return {Number}
 */
function sqrLength(v1) {
    return v1[0] * v1[0] + v1[1] * v1[1];
}

/**
 * Return true if v2 is between v1 and v3(inclusive)
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Vec2} v3
 * @return {Boolean}
 */
function within(v1, v2, v3) {
    return ((v1[0] <= v2[0] && v2[0] <= v3[0]) || (v3[0] <= v2[0] && v2[0] <= v1[0])) &&
          ((v1[1] <= v2[1] && v2[1] <= v3[1]) || (v3[1] <= v2[1] && v2[1] <= v1[1]));
}

/**
 * Return true if q is between p and r(inclusive)
 *
 * @param {Number} px
 * @param {Number} py
 * @param {Number} qx
 * @param {Number} qy
 * @param {Number} rx
 * @param {Number} ry
 * @return {Boolean}
 */
function $within(px, py, qx, qy, rx, ry) {
    return ((px <= qx && qx <= rx) || (rx <= qx && qx <= px)) &&
          ((py <= qy && qy <= ry) || (ry <= qy && qy <= py));
}

/**
 * p is near x ± dist ("box test")
 *
 * @param {Number} px
 * @param {Number} py
 * @param {Number} qx
 * @param {Number} qy
 * @param {Number} dist EPS
 * @return {Boolean}
 */
function $near(px, py, qx, qy, dist) {
    return (px > qx ? (px - qx) < dist : (qx - px) < dist) &&
           (py > qy ? (py - qy) < dist : (qy - py) < dist);
}
/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Number}
 */
function $cross(x1, y1, x2, y2) {
    return x1 * y2 - y1 * x2;
}

/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Number}
 */
function $dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}
/**
 * Swap vectors, both will be modified.
 * for lazy people
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Undefined}
 */
function swap(v1, v2) {
    __x = v2[0];
    v2[0] = v1[0];
    v1[0] = __x;

    __x = v2[1];
    v2[1] = v1[1];
    v1[1] = __x;
}
/*
 * (x, y) with only two decimals, for readability
 * @param {Vec2} v1
 * @return {String}
 */
function toString(v1) {
    return "(" + v1[0].toFixed(2) + "," + v1[1].toFixed(2) + ")";
}

Vec2 = {
    ZERO: [0, 0],
    create: create,
    dFromPolar: dFromPolar,
    fromPolar: fromPolar,
    zero: zero,
    clone: clone,
    equals: equals,
    equalsEpsilon: equalsEpsilon,
    gt: gt,
    lt: lt,
    near: near,
    isValid: isValid,
    isNaN: isNaN,
    copy: copy,
    negate: negate,
    perpendicular: perpendicular,
    perp: perpendicular,
    rotateCW: perpendicular,
    normalize: normalize,
    normalizeSq: normalizeSq,
    rperpendicular: rperpendicular,
    rperp: rperpendicular,
    rotateCCW: rperpendicular,
    lerp: lerp,
    interpolate: lerp,
    lerpconst: lerpconst,
    slerp: slerp,
    slerpconst: slerpconst,
    forAngle: forAngle,
    project: project,
    rotate: rotate,
    rotateFrom: rotateFrom,
    rotateVec: rotateVec,
    unrotateVec: unrotateVec,
    midPoint: midPoint,
    reflect: reflect,
    subtract: subtract,
    subtract2: subtract2,
    add: add,
    add2: add2,
    multiply: multiply,
    multiply2: multiply2,
    divide: divide,
    divide2: divide2,
    scale: scale,
    pow: pow,
    max: max,
    min: min,
    abs: abs,
    scaleAndAdd: scaleAndAdd,
    clamp: clamp,
    truncate: truncate,
    magnitude: magnitude,
    compare: compare,
    dot: dot,
    cross: cross,
    crossVZ: crossVZ,
    crossZV: crossZV,
    toAngle: toAngle,
    angle: toAngle,
    angleTo: angleTo,
    distance: distance,
    length: length,
    sqrDistance: sqrDistance,
    sqrLength: sqrLength,
    within: within,
    swap: swap,
    tripleProduct: tripleProduct,

    // alias
    eq: equals,
    sub: subtract,
    sub2: subtract2,
    mul: multiply,
    mul2: multiply2,
    div: divide,
    div2: divide2,
    distanceSq: sqrDistance,
    lengthSq: sqrLength,
    $within: $within,
    $near: $near,
    $cross: $cross,
    $dot: $dot,

    toString: toString
};

module.exports = Vec2;
