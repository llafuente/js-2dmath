var clamp,
    sqrt = Math.sqrt,
    random = Math.random,
    ceil = Math.ceil,
    floor = Math.floor,
    log = Math.log,
    PI,
    QUATER_PI,
    HALF_PI,
    HALF_NPI,
    TWO_PI,
    TWO_HALF_PI,
    NPI,
    NQUATER_PI,
    NHALF_PI,
    NTWO_PI,
    NTWO_HALF_PI,
    EPS = 10e-3,
    LOG2;

PI = Math.PI;
QUATER_PI = Math.QUATER_PI = 0.25 * Math.PI;
HALF_PI = Math.HALF_PI = 0.5 * Math.PI;
HALF_NPI = Math.HALF_NPI = -0.5 * Math.PI;
TWO_PI = Math.TWO_PI = 2 * Math.PI;
TWO_HALF_PI = Math.TWO_HALF_PI = (2 * Math.PI) + Math.HALF_PI;
NPI = Math.NPI = -Math.PI;
NQUATER_PI = Math.NQUATER_PI = 0.25 * Math.NPI;
NHALF_PI = Math.NHALF_PI = 0.5 * Math.NPI;
NTWO_PI = Math.NTWO_PI = 2 * Math.NPI;
NTWO_HALF_PI = Math.NTWO_HALF_PI = (2 * Math.NPI) + Math.HALF_PI;
LOG2 = Math.LOG2 = log(2);

Math.INV_PI = 1 / Math.PI;

Math.RAD_TO_DEG = 180 / Math.PI;
Math.DEG_TO_RAD = Math.PI / 180;

// this could be useful to tweak in your app, depends on your world resolution
Math.EPS = EPS;

/**
 * Clamp @c f to be between @c min and @c max.
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
function near(a, b) {
    return a > b - EPS && a < b + EPS;
}

/**
 * Clamp @c f to be between @c min and @c max.
 * @param {Number} f
 * @param {Number} minv
 * @param {Number} maxv
 * @return {Number}
 */
function clamp(f, minv, maxv) {
    return f < minv ? minv : (f > maxv ? maxv : f);
};

/**
 * Clamp @c f to be between 0 and 1.
 * @param {Number} f
 * @return {Number}
 */
function clamp01(f) {
    return f < 0 ? 0 : (f > 1 ? 1 : f);
}

/**
 * Linearly interpolate (or extrapolate) between @c f1 and @c f2 by @c t percent.
 * @param {Number} f1
 * @param {Number} f2
 * @param {Number} t
 * @return {Number}
 */
function lerp(f1, f2, t) {
    return f1 * (1 - t) + f2 * t;
}

/**
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Number} percent
 * @return {Number}
 */
function lerp2(a, b, percent) {
    return a + (b - a) * percent;
}

/**
 * Linearly interpolate from @c f1 to @c f2 by no more than @c d.
 *
 * @param {Number} f1
 * @param {Number} f2
 * @param {Number} d
 * @return {Number}
 */
function lerpconst(f1, f2, d) {
    return f1 + clamp(f2 - f1, -d, d);
}
/**
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
function randInRange(min, max) {
    return lerp(min, max, random());
}
/**
 *
 * @param {Number} max
 * @param {Number} min
 * @return {Number}
 */
function randRange(max, min) {
    if (max === undefined) {
        return random();
    }
    min = min || 0;

    return random() * (max - min) + min;
}
/**
 *
 * @param {Number} max
 * @param {Number} min
 * @return {Number}
 */
function randInt(max, min) {
    min = min || 0;

    return floor(random() * (max - min + 1) + min);
}

/**
 *
 * @param {Number} value
 * @param {Number} snap_size
 * @return {Number}
 */
function snap(value, snap_size) {
    return floor(value / snap_size) * snap_size;
}

/**
 *
 * @param {Number} value
 * @param {Number} snap_size
 * @return {Number}
 */
function snapRound(value, snap_size) {
    var steps = value / snap_size | 0,
        remain = value - (steps * snap_size),
        rounder = remain > (snap_size / 2) ? ceil : floor;

    return rounder(value / snap_size) * snap_size;
}

/**
 * get the angle inside [-PI, +PI]
 * @param {Number} angle
 * @return {Number}
 */
function normalizeRotation(angle) {
    if (angle > NPI && angle < PI) {
        return angle;
    }

    angle = angle % (TWO_PI);

    if (angle < NPI) {
        angle += TWO_PI;
    } else if (angle > PI) {
        angle -= TWO_PI;
    }

    return angle;
}

/**
 * rotate the angle and return the normalized
 *
 * @param {Number} angle
 * @param {Number} target
 * @return {Number}
 */
function deltaRotation(angle, target) {
    return normalizeRotation(angle - target);
}


/**
 * Mathematical aproach rather than computaional/performance because JS Number representation is elusive
 *
 * @todo study bitwise operations can be used in all cases ?
 *
 * @param {Number} x
 * @return {Number}
 */
function powerOfTwo(x) {
    next = pow(2, ceil(log(x)/LOG2));
}
/**
 * @credits Three.js
 * @param {Number} value
 * @return {Number}
 */
function isPowerOfTwo(value) {
   return ( value & ( value - 1 ) ) === 0 && value !== 0;
}

Math.clamp = clamp;
Math.near = near;
Math.clamp01 = clamp01;
Math.lerp = lerp;
Math.lerpconst = lerpconst;
Math.randRange = randRange;
Math.randInt = randInt;
Math.snap = snap;
Math.snapRound = snapRound;
Math.deltaRotation = deltaRotation;
Math.normalizeRadians = normalizeRotation;
Math.powerOfTwo = powerOfTwo;
Math.isPowerOfTwo = isPowerOfTwo;
