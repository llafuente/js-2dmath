/**
 * Stability: 1 (Only additions & fixes)
 *
 * 2x3 Transformation matrix used in 2D (column-major) represented as a 8 coordinates array
 * [m11:Number, m12:Number, m13:Number, m21:Number, m22:Number, m23:Number, **cache**:Array(5), dirty:Boolean]
 * cache = [xScale:Number, yScale:Number, xSkew:Number, yScale:Number, rotation:Number]
 * * why cache? Speed improvements in exchange of memory to avoid tan/atan2/sqrt.
 * * why dirty? Matrix.transform could be expensive with large polygons, keep track of this variable to transform only when necessary.
 * @TODO dSetSkewX / dSetSkewY
 */

// cache variables
var DEG_TO_RAD = Math.DEG_TO_RAD,
    PI = Math.PI,
    cos = Math.cos,
    sin = Math.sin,
    tan = Math.tan,
    atan2 = Math.atan2,
    __x,
    __y,
    aux_vec = [0, 0],
    c = 0,
    s = 0,
    angle = 0,
    m11 = 0,
    m12 = 0,
    m21 = 0,
    m22 = 0,
    dx = 0,
    dy = 0;

/**
 * Creates a new identity 2x3 matrix
 * @return {Matrix23}
 */
function create() {
    return [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false];
}

/**
 * Creates a new matrix given 4 points(a Rectangle)
 *
 * @todo
 * @see http://jsfiddle.net/dFrHS/1/
 * @return {Matrix23} a new 2x3 matrix
 */
function fromPoints() {
}

/**
 * Creates a new matrix given 4 points(a Rectangle)
 *
 * @todo
 * @see http://jsfiddle.net/dFrHS/1/
 * @return {Matrix23} a new 2x3 matrix
 */
function fromAngle() {
    return [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false];
}

/**
 * Copy m2d into out
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @return {Matrix23} out 2x3 matrix
 */
function copy(out, m2d) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = m2d[7];

    return out;
}
/**
 * Copy m2d into out
 *
 * @param {Matrix23} out destiny matrix
 * @return {Matrix23} out 2x3 matrix
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;

    out[6][0] = 1;
    out[6][1] = 1;
    out[6][2] = 0;
    out[6][3] = 0;
    out[6][4] = 0;

    out[7] = false;

    return out;
}

/**
 * Rotates a Matrix23 by the given angle in degrees(increment rotation)
 * @note increment rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees
 * @return {Matrix23} out 2x3 matrix
 */
function dRotate(out, m2d, degrees) {
    return rotate(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Rotates a Matrix23 by the given angle in radians(increment rotation)
 * @note increment rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians
 * @return {Matrix23} out 2x3 matrix
 */
function rotate(out, m2d, radians) {
    c = cos(radians);
    s = sin(radians);
    m11 = m2d[0] * c +  m2d[2] * s;
    m12 = m2d[1] * c +  m2d[3] * s;
    m21 = m2d[0] * -s + m2d[2] * c;
    m22 = m2d[1] * -s + m2d[3] * c;

    out[0] = m11;
    out[1] = m12;
    out[2] = m21;
    out[3] = m22;

    // copy
    out[4] = m2d[4];
    out[5] = m2d[5];
    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4] + radians;

    out[7] = true;

    return out;
}

/**
 * Set rotation of a Matrix23 by the given angle in degrees(set rotation)
 * @note set rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees
 * @return {Matrix23} out 2x3 matrix
 */
function dRotation(out, m2d, degrees) {
    return rotation(out, m2d, degrees * DEG_TO_RAD);
}

/**
 * Set rotation of a Matrix23 by the given angle in radians(set rotation)
 * @note set rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians
 * @return {Matrix23} out 2x3 matrix
 */
function rotation(out, m2d, radians) {
    c = radians - out[6][4];

    rotate(out, m2d, c);

    out[6][4] = radians;
    out[7] = true;

    return out;
}

/**
 * Translates given Matrix23 by the dimensions in the given vec2
 * @note This translation is affected by rotation/skew
 * @note increment position
 * @see gTranslate
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 amount to be translated
 * @return {Matrix23} out 2x3 matrix
 */
function translate(out, m2d, vec2) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4] + m2d[0] * vec2[0] + m2d[2] * vec2[1];
    out[5] = m2d[5] + m2d[1] * vec2[0] + m2d[3] * vec2[1];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Translates given Matrix23 by the dimensions in the given vec2
 * @note This translation is NOT affected by rotation/skew
 * @note increment position
 * @see translate
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 amount to be translated
 * @return {Matrix23} out 2x3 matrix
 */
function gTranslate(out, m2d, vec2) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4] + vec2[0];
    out[5] = m2d[5] + vec2[1];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Set Matrix23 position
 * @note This translation is NOT affected by rotation/skew
 * @note set position
 * @see gTranslate
 * @see translate
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @return {Matrix23} out 2x3 matrix
 */
function position(out, m2d, vec2) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = vec2[0];
    out[5] = vec2[1];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Scales the Matrix23 by the dimensions in the given vec2

 * @note incremental scale
 * @note do not affect position
 * @see scalation
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @return {Matrix23} out 2x3 matrix
 */
function scale(out, m2d, vec2) {
    __x = vec2[0];
    __y = vec2[1];

    out[0] = m2d[0] * __x;
    out[1] = m2d[1] * __x;
    out[2] = m2d[2] * __y;
    out[3] = m2d[3] * __y;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0] * __x;
    out[6][1] = m2d[6][1] * __y;
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Set the Matrix23 scale by the dimensions in the given vec2

 * @note set scale
 * @note do not affect position
 * @see scale
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @return {Matrix23} out 2x3 matrix
 */
function scalation(out, m2d, vec2) {
    return scale(out, m2d, [vec2[0] / m2d[6][0], vec2[1] / m2d[6][1]]);
}

/**
 * Increment the Matrix23 x-skew by given degrees
 *
 * @note increment skewX
 * @see skewX
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSkewX(out, m2d, degrees) {
    return skewX(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Increment the Matrix23 x-skew by given radians
 *
 * @note increment skewX
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function skewX(out, m2d, radians) {
    angle = tan(radians);

    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2] + m2d[0] * angle;
    out[3] = m2d[3] + m2d[1] * angle;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2] + radians;
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Increment the Matrix23 y-skew by given degrees
 *
 * @note increment skewY
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSkewY(out, m2d, degrees) {
    return skewY(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Increment the Matrix23 y-skew by given radians
 *
 * @note increment skewY
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function skewY(out, m2d, radians) {
    angle = tan(radians);

    out[0] = m2d[0] + m2d[2] * angle;
    out[1] = m2d[1] + m2d[3] * angle;
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3] + angle;
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Increment the Matrix23 skew y by given degrees in vec2_degrees
 *
 * @note increment skew
 * @see dSetSkew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSkew(out, m2d, vec2_degrees) {
    aux_vec[0] = vec2_degrees[0] * DEG_TO_RAD;
    aux_vec[1] = vec2_degrees[1] * DEG_TO_RAD;

    return skew(out, m2d, aux_vec);
}

/**
 * Increment the Matrix23 skew y by given radians in vec2
 *
 * @note increment skew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function skew(out, m2d, vec2_radians) {
    c = tan(vec2_radians[0]);
    s = tan(vec2_radians[1]);

    out[0] = m2d[0] + m2d[2] * s;
    out[1] = m2d[1] + m2d[3] * s;
    out[2] = m2d[2] + m2d[0] * c;
    out[3] = m2d[3] + m2d[1] * c;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2] + vec2_radians[0];
    out[6][3] = m2d[6][3] + vec2_radians[1];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}
/**
 * Set the Matrix23 skew y by given degrees in vec2_degrees
 *
 * @note set skew
 * @see setSkew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSetSkew(out, m2d, vec2_degrees) {
    aux_vec[0] = vec2_degrees[0] * DEG_TO_RAD;
    aux_vec[1] = vec2_degrees[1] * DEG_TO_RAD;

    return setSkew(out, m2d, aux_vec);
}

/**
 * Set the Matrix23 skew y by given radians in vec2
 *
 * @note set skew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function setSkew(out, m2d, vec2_radians) {
    c = tan(vec2_radians[0] - m2d[6][2]);
    s = tan(vec2_radians[1] - m2d[6][3]);

    out[0] = m2d[0] + m2d[2] * s;
    out[1] = m2d[1] + m2d[3] * s;
    out[2] = m2d[2] + m2d[0] * c;
    out[3] = m2d[3] + m2d[1] * c;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = vec2_radians[0];
    out[6][3] = vec2_radians[1];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}


/**
 * Multiplies two Matrix23's
 *
 * @param {Matrix23} out destiny matrix(A*B)
 * @param {Matrix23} m2d A matrix
 * @param {Matrix23} m2d_2 B matrix
 * @return {Matrix23} out 2x3 matrix
 */
function multiply(out, m2d, m2d_2) {
    m11 = m2d[0] * m2d_2[0] + m2d[2] * m2d_2[1];
    m12 = m2d[1] * m2d_2[0] + m2d[3] * m2d_2[1];

    m21 = m2d[0] * m2d_2[2] + m2d[2] * m2d_2[3];
    m22 = m2d[1] * m2d_2[2] + m2d[3] * m2d_2[3];

    dx = m2d[0] * m2d_2[4] + m2d[2] * m2d_2[5] + m2d[4];
    dy = m2d[1] * m2d_2[4] + m2d[3] * m2d_2[5] + m2d[5];

    out[0] = m11;
    out[1] = m12;
    out[2] = m21;
    out[3] = m22;
    out[4] = dx;
    out[5] = dy;


    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Multiplies a Matrix23 and a Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @param {Vec2} vec2
 * @return {Vec2} out_vec2, result Vec2
 */
function multiplyVec2(out_vec2, m2d, vec2) {
    out_vec2[0] = vec2[0] * m2d[0] + vec2[0] * m2d[2] + vec2[0] * m2d[4];
    out_vec2[1] = vec2[1] * m2d[1] + vec2[1] * m2d[3] + vec2[1] * m2d[5];

    return out_vec2;
}

/**
 * Retrieve current position as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @return {Vec2} out_vec2, result Vec2
 */
function getPosition(out_vec2, m2d) {
    out_vec2[0] = m2d[4];
    out_vec2[1] = m2d[5];

    return out_vec2;
}

/**
 * Retrieve current scale as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @return {Vec2} out_vec2, result Vec2
 */
function getScale(out_vec2, m2d) {
    out_vec2[0] = m2d[6][0];
    out_vec2[1] = m2d[6][1];

    return out_vec2;
}

/**
 * Retrieve current skew as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @return {Vec2} out_vec2, result Vec2
 */
function getSkew(out_vec2, m2d) {
    out_vec2[0] = m2d[6][2];
    out_vec2[1] = m2d[6][3];

    return out_vec2;
}

/**
 * Alias of rotate 180º(PI)
 *
 * @param {Matrix23} out destiny Matrix23
 * @param {Matrix23} m2d source Matrix23
 * @return {Matrix23} out 2x3 matrix
 */
function reflect(out, m2d) {
    return rotate(out, m2d, PI);
}

/**
 * @TODO needed ?
 * @param {Matrix23} out destiny Matrix23
 * @param {Matrix23} m2d source Matrix23
 */
function transpose(out, m2d) {
}

/**
 * @TODO review & test
 * @param {Matrix23} m2d source Matrix23
 * @return {Number}
 */
function determinant(m2d) {
    var fCofactor00 = m2d[1][1] * m2d[2][2] - m2d[1][2] * m2d[2][1],
        fCofactor10 = m2d[1][2] * m2d[2][0] - m2d[1][0] * m2d[2][2],
        fCofactor20 = m2d[1][0] * m2d[2][1] - m2d[1][1] * m2d[2][0];

    return m2d[0][0] * fCofactor00 +
        m2d[0][1] * fCofactor10 +
        m2d[0][2] * fCofactor20;

}


/**
 * Returns a 3x2 2D column-major translation matrix for x and y.
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Matrix23} a new 2x3 matrix
 */
function translationMatrix(x, y) {
    return [ 1, 0, 0, 1, x, y ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given degrees.
 *
 * @param {Number} degrees
 * @return {Matrix23} a new 2x3 matrix
 */
function dSkewXMatrix(degrees) {
    return [ 1, 0, tan(degrees * 0.017453292519943295769236907684886), 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @return {Matrix23} a new 2x3 matrix
 */
function skewXMatrix(radians) {
    return [ 1, 0, tan(radians), 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given degrees.
 *
 * @param {Number} degrees
 * @return {Matrix23} a new 2x3 matrix
 */
function dSkewYMatrix(degrees) {
    return [ 1, tan(degrees * 0.017453292519943295769236907684886), 0, 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @return {Matrix23} a new 2x3 matrix
 */
function skewYMatrix(radians) {
    return [ 1, tan(radians), 0, 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @return {Matrix23} a new 2x3 matrix
 */
function rotationMatrix(radians) {
    var c = cos(radians),
        s = sin(radians);

    return [c, -s, s, c, 0, 0 ];
}


/**
 * Returns a 3x2 2D column-major scaling matrix for x and y.
 *
 * @param {Number} x
 * @param {Number} y
 */
function scalingMatrix(x, y) {
    return [ x, 0, 0, y, 0, 0 ];
}


/**
 * Interpolate two matrixes by given factor.
 * Used in conjunction with Transitions and you will have nice transformations :)
 *
 * @param {Matrix23} out
 * @param {Matrix23} m2d first matrix
 * @param {Matrix23} m2d_2 second matrix
 * @param {Number} factor
 * @return {Matrix23}
 */
function interpolate(out, m2d, m2d_2, factor) {
    out[0] = m2d[0] + ((m2d_2[0] - m2d[0]) * factor);
    out[1] = m2d[1] + ((m2d_2[1] - m2d[1]) * factor);
    out[2] = m2d[2] + ((m2d_2[2] - m2d[2]) * factor);
    out[3] = m2d[3] + ((m2d_2[3] - m2d[3]) * factor);
    out[4] = m2d[4] + ((m2d_2[4] - m2d[4]) * factor);
    out[5] = m2d[5] + ((m2d_2[5] - m2d[5]) * factor);

    var o = out[6],
        i1 = m2d[6],
        i2 = m2d_2[6];

    o[0] = i1[0] + ((i2[0] - i1[0]) * factor);
    o[1] = i1[1] + ((i2[1] - i1[1]) * factor);
    o[2] = i1[2] + ((i2[2] - i1[2]) * factor);
    o[3] = i1[3] + ((i2[3] - i1[3]) * factor);
    o[4] = i1[4] + ((i2[4] - i1[4]) * factor);

    out[7] = m2d[7];

    return out;
}

/**
 * For completeness because it's not need in the current implementation just get: m2d[6][4]
 *
 * @param {Matrix23} m2d
 */
function toAngle(m2d) {
    return atan2(m2d[1], m2d[0]);
}
/**
 * Transform a vector by given matrix
 *
 * @param {Vec2} out_vec2
 * @param {Matrix23} m2d
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function transform(out_vec2, m2d, vec2) {
    var x = vec2[0] * m2d[0] + vec2[1] * m2d[2] + m2d[4],
        y = vec2[0] * m2d[1] + vec2[1] * m2d[3] + m2d[5];

    out_vec2[0] = x;
    out_vec2[1] = y;

    return out_vec2;
}


var Matrix23 =  {
    create: create,
    fromPoints: fromPoints,
    copy: copy,
    identity: identity,
    dRotate: dRotate,
    rotate: rotate,
    dRotation: dRotation,
    rotation: rotation,
    translate: translate,
    gTranslate: gTranslate,
    position: position,
    scale: scale,
    scalation: scalation,
    dSkewX: dSkewX,
    skewX: skewX,
    dSkewY: dSkewY,
    skewY: skewY,
    dSkew: dSkew,
    skew: skew,
    dSetSkew: dSetSkew,
    setSkew: setSkew,
    multiply: multiply,
    multiplyVec2: multiplyVec2,
    getPosition: getPosition,
    getScale: getScale,
    getSkew: getSkew,
    reflect: reflect,
    transpose: transpose,
    determinant: determinant,
    translationMatrix: translationMatrix,
    dSkewXMatrix: dSkewXMatrix,
    skewXMatrix: skewXMatrix,
    dSkewYMatrix: dSkewYMatrix,
    skewYMatrix: skewYMatrix,
    scalingMatrix: scalingMatrix,
    rotationMatrix: rotationMatrix,

    interpolate: interpolate,
    transform: transform,

    toAngle: toAngle,

    // alias
    dSetRotation: dRotation,
    setRotation: rotation,
    setPosition: position,
    setScale: scalation,
};

module.exports = Matrix23;
