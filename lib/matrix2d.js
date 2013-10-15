var exp;
(exp = function () {
    "use strict";

    var DEG_TO_RAD = Math.DEG_TO_RAD,
        cos = Math.cos,
        sin = Math.sin,
        tan = Math.tan,
        __x,
        __y,
        c = 0,
        s = 0,
        angle = 0,
        m11 = 0,
        m12 = 0,
        m21 = 0,
        m22 = 0,
        dx = 0,
        dy = 0,
        Matrix2D;


    /**
     * based on cakejs
     * @class Matrix2D
     */
    Matrix2D = function() {
        return [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false];
    };

    Matrix2D.copy = function(out, m2d) {
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
    };

    Matrix2D.identity = function(out) {
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
    };

    Matrix2D.drotate = function(out, m2d, degree) {
        return Matrix2D.rotate(out, m2d, degree * DEG_TO_RAD);
    };

    Matrix2D.rotate = function(out, m2d, radians) {
        c = cos(radians);
        s = sin(radians);
        m11 = this.matrix[0] * c +  this.matrix[2] * s;
        m12 = this.matrix[1] * c +  this.matrix[3] * s;
        m21 = this.matrix[0] * -s + this.matrix[2] * c;
        m22 = this.matrix[1] * -s + this.matrix[3] * c;

        out[0] = m11;
        out[1] = m12;
        out[2] = m21;
        out[3] = m22;

        out[6][4] += radians;

        out[7] = true;

        return out;
    };

    Matrix2D.drotation = function(out, m2d, degree) {
        return Matrix2D.rotation(out, m2d, degree * DEG_TO_RAD);
    };

    Matrix2D.rotation = function(out, m2d, radians) {
        c = angle - out[6][4];

        Matrix2D.rotate(out, m2d, c);

        out[6][4] = radians;
        out[7] = true;

        return out;
    };

    Matrix2D.translate = function(out, m2d, v1) {
        out[0] = m2d[0];
        out[1] = m2d[1];
        out[2] = m2d[2];
        out[3] = m2d[3];
        out[4] = m2d[4] + m2d[0] * v1[0] + m2d[2] + v1[1];
        out[5] = m2d[5] + m2d[1] * v1[0] + m2d[3] + v1[1];

        out[6][0] = m2d[6][0];
        out[6][1] = m2d[6][1];
        out[6][2] = m2d[6][2];
        out[6][3] = m2d[6][3];
        out[6][4] = m2d[6][4];

        out[7] = true;
    };

    // do not affect rotation
    Matrix2D.gtranslate = function(out, m2d, v1) {
        out[0] = m2d[0];
        out[1] = m2d[1];
        out[2] = m2d[2];
        out[3] = m2d[3];
        out[4] = m2d[4] + v1[0];
        out[5] = m2d[5] + v1[1];

        out[6][0] = m2d[6][0];
        out[6][1] = m2d[6][1];
        out[6][2] = m2d[6][2];
        out[6][3] = m2d[6][3];
        out[6][4] = m2d[6][4];

        out[7] = true;
    };

    // do not affect rotation
    Matrix2D.position = function(out, m2d, v1) {
        out[0] = m2d[0];
        out[1] = m2d[1];
        out[2] = m2d[2];
        out[3] = m2d[3];
        out[4] = v1[0];
        out[5] = v1[1];

        out[6][0] = m2d[6][0];
        out[6][1] = m2d[6][1];
        out[6][2] = m2d[6][2];
        out[6][3] = m2d[6][3];
        out[6][4] = m2d[6][4];

        out[7] = true;
    };

    // do not affect rotation
    Matrix2D.scale = function(out, m2d, v1) {
        __x = v1[0];
        __y = v1[1];

        out[0] = m2d[0] * __x;
        out[1] = m2d[1] * __x;
        out[2] = m2d[2] * __y;
        out[3] = m2d[3] * __y;
        out[4] = v1[0];
        out[5] = v1[1];

        out[6][0] = m2d[6][0] * __x;
        out[6][1] = m2d[6][1] * __y;
        out[6][2] = m2d[6][2];
        out[6][3] = m2d[6][3];
        out[6][4] = m2d[6][4];

        out[7] = true;

        return out;
    };

    // do not affect rotation
    Matrix2D.scalation = function(out, m2d, v1) {
        __x = m2d[6][0] / __x;
        __y = m2d[6][1] / __y;

        return Matrix2D.scale(out, m2d, [__x, __y]);
    };

    // do not affect rotation
    Matrix2D.dskewx = function(out, m2d, degree) {
        return Matrix2D.skewx(out, m2d, degree * DEG_TO_RAD);
    };

    Matrix2D.skewx = function(out, m2d, radians) {
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
    };

    Matrix2D.skewy = function(out, m2d, radiansx, radiansy) {
        c = tan(radiansx);
        s = tan(radiansy);

        out[0] = m2d[0] + m2d[2] * s;
        out[1] = m2d[1] + m2d[3] * s;
        out[2] = m2d[2] + m2d[0] * c;
        out[3] = m2d[3] + m2d[1] * c;
        out[4] = m2d[4];
        out[5] = m2d[5];

        out[6][0] = m2d[6][0];
        out[6][1] = m2d[6][1];
        out[6][2] = m2d[6][2] + radiansx;
        out[6][3] = m2d[6][3] + radiansy;
        out[6][4] = m2d[6][4];

        out[7] = true;

        return out;
    };

    Matrix2D.multiply = function(out, m2d, m2d_2) {
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
    };

    Matrix2D.multiplyVec2 = function(out, m2d, v1) {
        out[0] = v1[0] * m2d[0] + v1[0] * m2d[2] + v1[0] * m2d[4];
        out[1] = v1[1] * m2d[1] + v1[1] * m2d[3] + v1[1] * m2d[5];

        return out;
    };

    Matrix2D.getPosition = function(out_vec2, m2d) {
        out_vec2[0] = m2d[4];
        out_vec2[1] = m2d[5];

        return out_vec2;
    };

    Matrix2D.inverse = function(out, m2d) {
    };

    Matrix2D.transpose = function(out, m2d) {
    };

    Matrix2D.determinant = function(out, m2d) {

        var fCofactor00 = m2d[1][1] * m2d[2][2] - m2d[1][2] * m2d[2][1],
            fCofactor10 = m2d[1][2] * m2d[2][0] - m2d[1][0] * m2d[2][2],
            fCofactor20 = m2d[1][0] * m2d[2][1] - m2d[1][1] * m2d[2][0];

        return m2d[0][0] * fCofactor00 +
            m2d[0][1] * fCofactor10 +
            m2d[0][2] * fCofactor20;

    };


    /**
     * Returns a 3x2 2D column-major translation matrix for x and y.
     * @member Matrix2D
     * @static
     * @param {Number} x
     * @param {Number} y
     */
    Matrix2D.translationMatrix = function (x, y) {
        return [ 1, 0, 0, 1, x, y ];
    };
    /**
     * Returns a 3x2 2D column-major y-skew matrix for the angle.
     * @member Matrix2D
     * @static
     * @param {Number} angle
     */
    Matrix2D.skewXMatrix = function (angle) {
        return [ 1, 0, Math.tan(angle * 0.017453292519943295769236907684886), 1, 0, 0 ];
    };

    /**
     * Returns a 3x2 2D column-major y-skew matrix for the angle.
     * @member Matrix2D
     * @static
     * @param {Number} angle
     */
    Matrix2D.skewYMatrix = function (angle) {
        return [ 1, Math.tan(angle * 0.017453292519943295769236907684886), 0, 1, 0, 0 ];
    };
    /**
     * Returns a 3x2 2D column-major scaling matrix for sx and sy.
     * @member Matrix2D
     * @static
     * @param {Number} sx
     * @param {Number} sy
     */
    Matrix2D.scalingMatrix = function (sx, sy) {
        return [ sx, 0, 0, sy, 0, 0 ];
    };

    return Matrix2D;

}());


if ("undefined" === typeof module) {
    window.Matrix2D = exp;
} else {
    module.exports = exp;
}