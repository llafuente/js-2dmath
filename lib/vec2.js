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
 * @param {Number} x
 * @param {Number} y
 * @returns {Vec2}
 */
function create(x, y) {
    return [x, y];
}

/**
 * Create a Vec2 given length and angle
 *
 * @param {Number} length
 * @param {Number} degrees
 * @returns {Vec2}
 */
function dFromPolar(length, degrees) {
    return fromPolar(length, degrees * DEG_TO_RAD);
}

/**
 * Create a Vec2 given length and angle
 *
 * @param {Number} length
 * @param {Number} radians
 * @returns {Vec2}
 */
function fromPolar(length, radians) {
    return [length * sin(radians), length * cos(radians)];
}

/**
 * Create an empty Vec2
 *
 * @returns {Vec2}
 */
function zero() {
    return [0, 0];
}

/**
 * Clone given vec2
 *
 * @param {Array} v1
 * @returns {Vec2}
 */
function clone(v1) {
    return [v1[0], v1[1]];
}

//
// compare operations
//
/**
 * Returns true if both vectors are equal(same coords)
 *
 * @param {Array} v1
 * @param {Array} v2
 * @returns {Boolean}
 */
function equals(v1, v2) {
    return v2[0] === v1[0] && v2[1] === v1[1];
}
/**
 * Returns true if both vectors are "almost(Math.EPS)" equal
 *
 * @param {Array} v1
 * @param {Array} v2
 * @returns {Boolean}
 */
function equalsEpsilon(v1, v2) {
    aux_number1 = __abs(v2[0] - v1[0]);
    aux_number2 = __abs(v2[1] - v1[1]);

    return aux_number1 < EPS && aux_number2 < EPS;
}
/**
 * Returns true both coordinates of v1 area greater than v2
 *
 * @param {Array} v1
 * @param {Array} v2
 * @returns {Boolean}
 */
function gt(v1, v2) {
    return v2[0] > v1[0] && v2[1] > v1[1];
}
/**
 * Returns true both coordinates of v1 area lesser than v2
 *
 * @param {Array} v1
 * @param {Array} v2
 * @returns {Boolean}
 */
function lt(v1, v2) {
    return v2[0] < v1[0] && v2[1] < v1[1];
}

/**
 * Returns true if the distance between v1 and v2 is less than dist.
 *
 * @param {Array} v1
 * @param {Array} v2
 * @param {Number} dist
 * @returns {Boolean}
 */
function near(v1, v2, dist) {
    // maybe inline
    aux_number1 = sqrDistance(v1, v2);


    return aux_number1 < dist * dist;
}

//
// validation
//
/**
 * The vector does not contain any not number value: ±Infinity || NaN
 *
 * @param {Array} v1
 * @param {Array} v2
 * @param {Number} dist
 * @returns {Boolean}
 */
function isValid(v1) {
    return !(v1[0] === Infinity || v1[0] === -Infinity || isNaN(v1[0]) || v1[1] === Infinity || v1[1] === -Infinity || isNaN(v1[1]));
}
/**
 * Any coordinate is NaN
 *
 * @param {Array} v1
 * @param {Array} v2
 * @param {Number} dist
 * @returns {Boolean}
 */
function isNaN(v1) {
    return isNaN(v1[0]) || isNaN(v1[1]);
}

//
// first parameter is the output
//
/**
 * Copy v1 into out
 *
 * @param {Vec2} out
 * @param {Vec2} v1
 * @returns {Vec2}
 */
function copy(out, v1) {
    out[0] = v1[0];
    out[1] = v1[1];

    return out;
}

/**
 * Negate v1 and return it into out
 *
 * @param {Vec2} out
 * @param {Vec2} v1
 * @returns {Vec2}
 */
function negate(out, v1) {
    out[0] = -v1[0];
    out[1] = -v1[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function normalize(out, v1) {
    __x = v1[0];
    __y = v1[1];
    aux_number3 = sqrt(__x * __x + __y * __y);

    if (aux_number3 > EPS) {
        aux_number3 = 1 / aux_number3;
        out[0] = v1[0] * aux_number3;
        out[1] = v1[1] * aux_number3;
    }

    return out;
}
/**
 * @returns {Vec2}
 */
function normalizeSq(out, v1) {
    __x = v1[0];
    __y = v1[1];
    aux_number3 = __x * __x + __y * __y;

    if (aux_number3 > EPS * EPS) {
        aux_number3 = 1 / aux_number3;
        out[0] = v1[0] * aux_number3;
        out[1] = v1[1] * aux_number3;
    }

    return out;
}
/**
 * Rotate the vector clockwise
 * @returns {Vec2}
 */
function perpendicular(out, v1) {
    aux_number1 = v1[0];
    out[0] = v1[1];
    out[1] = -aux_number1;

    return out;
}
/**
 * Rotate the vector counterclockwise
 * @returns {Vec2}
 */
function rperpendicular(out, v1) {
    aux_number1 = v1[0];
    out[0] = -v1[1];
    out[1] = aux_number1;

    return out;
}

/**
 * Linearly interpolate between a and b.
 * @returns {Vec2}
 */
function lerp(out, v1, v2, t) {
    out[0] = v1[0] + (v2[0] - v1[0]) * t;
    out[1] = v1[1] + (v2[1] - v1[1]) * t;

    return out;
}

/**
 * Linearly interpolate between v1 towards v2 by distance d.
 * @returns {Vec2}
 */
function lerpconst(out, v1, v2, d) {
    out[0] = v2[0] - v1[0];
    out[1] = v2[1] - v1[1];

    clamp(out, d);

    out[0] += v1[0];
    out[1] += v1[1];

    return out;
}

/**
 * Spherical linearly interpolate between v1 and v2.
 * @returns {Vec2}
 */
function slerp(out, v1, v2, t) {
    var omega = acos(dot(v1, v2)),
        denom;

    if (omega) {
        denom = 1.0 / sin(omega);

        scale(out, v1, sin((1.0 - t) * omega) * denom);
        scale(aux_vec, sin(t * omega) * denom);

        return add(out, out, aux_vec);
    }

    return copy(out, v1);
}

/**
 * Spherical linearly interpolate between v1 towards v2 by no more than angle a in radians.
 * @returns {Vec2}
 */
function slerpconst(out, v1, v2, radians) {
    var _radians = acos(dot(v1, v2));
    return slerp(out, v1, v2, __min(radians, _radians) / _radians);
}

/**
 * Returns the unit length vector for the given angle(in radians).
 * @returns {Vec2}
 */
function forAngle(v1, radians) {
    v1[0] = cos(radians);
    v1[1] = sin(radians);

    return v1;
}

/**
 * Returns the vector projection of v1 onto v2.
 * @returns {Vec2}
 */
function project(out, v1, v2) {
    multiply(out, v1, v2);
    scale(out, dot(v1, v2) / dot(v2, v2));

    return out;
}

/**
 * Rotates the point by the given angle
 * @returns {Vec2}
 */
function rotate(out, v1, radians) {
    copy(out, v1);

    var s = sin(radians),
        c = cos(radians);

    __x = v1[0];
    __y = v1[1];

    out[0] = __x * c - __y * s;
    out[1] = __y * c + __x * s;

    return out;
}
/**
 * Rotates the point by the given angle around an optional center point.
 * @returns {Vec2}
 */
function rotateFrom(out, v1, radians, center) {
    subtract(out, v1, center);

    var s = sin(radians),
        c = cos(radians);

    __x = v1[0];
    __y = v1[1];

    out[0] = __x * c - __y * s;
    out[1] = __y * c + __x * s;

    add(out, out, center);

    return out;
}
/**
 * @returns {Vec2}
 */
function rotateVec(out, v1, v2) {
    out[0] = v1[0] * v2[0] - v1[1] * v2[1];
    out[1] = v1[0] * v2[1] + v1[1] * v2[0];

    return out;
}
/**
 * @returns {Vec2}
 */
function unrotateVec(out, v1, v2) {
    out[0] = v1[0] * v2[0] + v1[1] * v2[1];
    out[1] = v1[1] * v2[0] - v1[0] * v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function midPoint(out, v1, v2) {
    out[0] = (v1[0] + v2[0]) * 0.5;
    out[1] = (v1[1] + v2[1]) * 0.5;

    return out;
}

// v2 = v2_normal why this name ?
/**
 * @returns {Vec2}
 */
function reflect(out, v1, v2) {
    aux_number1 = dot(v1, v2);

    scale(out, v2, 2 * aux_number1);
    subtract(out, v1, out);

    return out;
}
/**
 * @returns {Vec2}
 */
function subtract(out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function subtract2(out, v1, x, y) {
    out[0] = v1[0] - x;
    out[1] = v1[1] - y;

    return out;
}
/**
 * @returns {Vec2}
 */
function add(out, v1, v2) {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function add2(out, v1, x, y) {
    out[0] = v1[0] + x;
    out[1] = v1[1] + y;

    return out;
}
/**
 * @returns {Vec2}
 */
function multiply(out, v1, v2) {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function multiply2(out, v1, x, y) {
    out[0] = v1[0] * x;
    out[1] = v1[1] * y;

    return out;
}
/**
 * @returns {Vec2}
 */
function divide(out, v1, v2) {
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function divide2(out, v1, x, y) {
    out[0] = v1[0] / x;
    out[1] = v1[1] / y;

    return out;
}
/**
 * @returns {Vec2}
 */
function scale(out, v1, factor) {
    out[0] = v1[0] * factor;
    out[1] = v1[1] * factor;

    return out;
}
/**
 * @returns {Vec2}
 */
function pow(out, v1, factor) {
    if (factor === 2) {
        out[0] = v1[0] * v1[0];
        out[1] = v1[1] * v1[1];
    } else {
        out[0] = __pow(v1[0], factor);
        out[1] = __pow(v1[1], factor);
    }

    return out;
}
/**
 * @returns {Vec2}
 */
function max(out, v1, v2) {
    out[0] = v1[0] > v2[0] ? v1[0] : v2[0];
    out[1] = v1[1] > v2[1] ? v1[1] : v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function min(out, v1, v2) {
    out[0] = v1[0] < v2[0] ? v1[0] : v2[0];
    out[1] = v1[1] < v2[1] ? v1[1] : v2[1];

    return out;
}
/**
 * @returns {Vec2}
 */
function abs(out, v1) {
    out[0] = __abs(v1[0]);
    out[1] = __abs(v1[1]);

    return out;
}
/**
 * @returns {Vec2}
 */
function scaleAndAdd(out, v1, v2, factor) {
    out[0] = v1[0] + (v2[0] * factor);
    out[1] = v1[1] + (v2[1] * factor);

    return out;
}
/**
 * @returns {Vec2}
 */
function clamp(out, v1, length) {
    out[0] = v1[0];
    out[1] = v1[1];

    if (dot(v1, v1) > length * length) {
        normalize(out);
        multiply(out, length);
    }

    return out;
}

function truncate(out, v1, length) {
    var length_sq = v1[0] * v1[0] + v1[1] * v1[1];
    if (length_sq > length * length) {
        scale(out, v1, length / sqrt(length_sq));
    }

    return out;
}

//
// function that return numbers
//
/**
 * @returns {Number}
 */
function magnitude(v1, v2) {
    __x = v1[0] - v2[0];
    __y = v1[1] - v2[1];

    return __x / __y;
}

/**
 * 0 equal, 1 top, 2 top-right, 3 right, 4 bottom right, 5 bottom, 6 bottom-left, 7 left, 8 top-left
 *
 * @returns {Number}
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

/**
 * v1 · v2 = |a| * |b| * sin θ
 *
 * @returns {Number}
 */
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * v1 × v2 = |a| * |b| * sin θ
 *
 * @returns {Number}
 */
function cross(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
}
/**
 *  Cross product between a vector and the Z component of a vector
 * @todo test use rprependicular ?
 */
function cossVZ(out, vec2, factor) {
    rotate(out, vec2, HALF_NPI); // Rotate according to the right hand rule
    scale(out, out, zcomp);     // Scale with z

    return out;
}
/**
 * Cross product between a vector and the Z component of a vector
 * @todo test use prependicular ?
 */
function cossZV(out, factor, vec2) {
    rotate(out, vec2, HALF_PI);
    scale(out, out, zcomp);

    return out;
}
/**
 * @returns {Number}
 */
function toAngle(v1) {
    return atan2(v1[1], v1[0]);
}

/**
 * @returns {Number}
 */
function angleTo(v1, v2) {
    return atan2(v2[1] - v1[1], v2[0] - v1[0]);
}

/**
 * Returns the distance between v1 and v2.
 * @returns {Number}
 */
function distance(v1, v2) {
    //subtract
    aux_number1 = v2[0] - v1[0];
    aux_number2 = v2[1] - v1[1];
    //sqrLength
    return sqrt(aux_number1 * aux_number1 + aux_number2 * aux_number2);
}
/**
 * you length only need to compare lengths.
 * @returns {Number}
 */
function sqrDistance(v1, v2) {
    //subtract
    aux_vec[0] = v1[0] - v2[0];
    aux_vec[1] = v1[1] - v2[1];
    //sqrLength
    return aux_vec[0] * aux_vec[0] + aux_vec[1] * aux_vec[1];
}

/**
 * Returns the length.
 * @returns {Number}
 */
function length(v1) {
    return sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
}
/**
 * @returns {Number}
 */
function sqrLength(v1) {
    return v1[0] * v1[0] + v1[1] * v1[1];
}

/**
 * Return true if v2 is between v1 and v3(inclusive)
 * @returns {Boolean}
 */
function within(v1, v2, v3) {
    return ((v1[0] <= v2[0] && v2[0] <= v3[0]) || (v3[0] <= v2[0] && v2[0] <= v1[0])) &&
          ((v1[1] <= v2[1] && v2[1] <= v3[1]) || (v3[1] <= v2[1] && v2[1] <= v1[1]));
}

/**
 * Return true if q is between p and r(inclusive)
 * @returns {Boolean}
 */
function $within(px, py, qx, qy, rx, ry) {
    return ((px <= qx && qx <= rx) || (rx <= qx && qx <= px)) &&
          ((py <= qy && qy <= ry) || (ry <= qy && qy <= py));
}

/**
 * p is near x ± dist ("box test")
 * @returns {Boolean}
 */
function $near(px, py, qx, qy, dist) {
    return (px > qx ? (px - qx) < dist : (qx - px) < dist) &&
           (py > qy ? (py - qy) < dist : (qy - py) < dist);
}

function $cross(x1, y1, x2, y2) {
    return x1 * y2 - y1 * x2;
}

function $dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}
/**
 * Swap vectors, both will be modified.
 * @returns {Undefined}
 */
function swap(v1, v2) {
    __x = v2[0];
    v2[0] = v1[0];
    v1[0] = __x;

    __x = v2[1];
    v2[1] = v1[1];
    v1[1] = __x;
}

var tp_left = [0, 0],
    tp_right = [0, 0];
/**
* (A x B) x C = B(C · A) - A(C · B)
* (A x B) x C = B(A.dot(C)) - A(B.dot(C))
*/
function tripleProduct(out, v1, v2, v3) {
    scale(tp_left, v2, dot(v1, v3));

    scale(tp_right, v1, dot(v2, v3));

    return subtract(out, tp_left, tp_right);
};

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