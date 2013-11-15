var exp;
(exp = function () {
    "use strict";

    var aux_vec = [0, 0],
        __x = 0,
        __y = 0,
        aux_number1 = 0,
        aux_number2 = 0,
        aux_number3 = 0,
        aux_number4 = 0,

        //cache
        EPS = Math.EPS,
        acos = Math.acos,
        cos  = Math.cos,
        sqrt = Math.sqrt,
        abs  = Math.abs,
        sin  = Math.sin,
        min  = Math.min,
        atan2 = Math.atan2,
        Vec2,
        multiply,
        scale,
        subtract,
        fromPolar,
        distanceSq,
        clamp,
        normalize,
        add,
        copy,
        dot,
        slerp,
        DEG_TO_RAD = Math.DEG_TO_RAD;


    //
    // creation
    //

    Vec2 = {};

    /**
     * Create a Vec2 given two coords
     *
     * @param {Number} x
     * @param {Number} y
     * @returns {Array} Vec2
     */
    Vec2.create = function (x, y) {
        return [x, y];
    };

    /**
     * Create a Vec2 given length and angle
     *
     * @param {Number} length
     * @param {Number} degree
     * @returns {Array} Vec2
     */
    Vec2.dFromPolar = function (length, degree) {
        return fromPolar(length, degree * DEG_TO_RAD);
    };

    /**
     * Create a Vec2 given length and angle
     *
     * @param {Number} length
     * @param {Number} radians
     * @returns {Array} Vec2
     */
    Vec2.fromPolar = function (length, radians) {
        return [length * sin(radians), length * cos(radians)];
    };

    fromPolar = Vec2.fromPolar;

    /**
     * Create an empty Vec2
     *
     * @returns {Array} Vec2
     */
    Vec2.zero = function () {
        return [0, 0];
    };

    /**
     * Clone given vec2
     *
     * @param {Array} vec2
     * @returns {Array} Vec2
     */
    Vec2.clone = function (vec2) {
        return [vec2[0], vec2[1]];
    };

    //
    // compare operations
    //
    /**
     * Returns true if both vectors are equal (same coords)
     *
     * @param {Array} v1
     * @param {Array} v2
     * @returns {Boolean}
     */
    Vec2.equals = function (v1, v2) {
        return v2[0] === v1[0] && v2[1] === v1[1];
    };
    /**
     * Returns true if both vectors are "almost (Math.EPS)" equal
     *
     * @param {Array} v1
     * @param {Array} v2
     * @returns {Boolean}
     */
    Vec2.equalsEpsilon = function (v1, v2) {
        aux_number1 = abs(v2[0] - v1[0]);
        aux_number2 = abs(v2[1] - v1[1]);

        return aux_number1 < EPS && aux_number2 < EPS;
    };
    /**
     * Returns true both coordinates of v1 area greater than v2
     *
     * @param {Array} v1
     * @param {Array} v2
     * @returns {Boolean}
     */
    Vec2.gt = function (v1, v2) {
        return v2[0] > v1[0] && v2[1] > v1[1];
    };
    /**
     * Returns true both coordinates of v1 area lesser than v2
     *
     * @param {Array} v1
     * @param {Array} v2
     * @returns {Boolean}
     */
    Vec2.lt = function (v1, v2) {
        return v2[0] < v1[0] && v2[1] < v1[1];
    };

    /**
     * Returns true if the distance between v1 and v2 is less than dist.
     *
     * @param {Array} v1
     * @param {Array} v2
     * @param {Number} dist
     * @returns {Boolean}
     */
    Vec2.near = function (v1, v2, dist) {
        // maybe inline
        aux_number1 = distanceSq(v1, v2);


        return aux_number1 < dist * dist;
    };

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
    Vec2.isValid = function (v1) {
        return !(v1[0] === Infinity || v1[0] === -Infinity || isNaN(v1[0]) || v1[1] === Infinity || v1[1] === -Infinity || isNaN(v1[1]));
    };
    /**
     * Any coordinate is NaN
     *
     * @param {Array} v1
     * @param {Array} v2
     * @param {Number} dist
     * @returns {Boolean}
     */
    Vec2.isNaN = function (v1) {
        return isNaN(v1[0]) || isNaN(v1[1]);
    };

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
    Vec2.copy = function (out, v1) {
        out[0] = v1[0];
        out[1] = v1[1];

        return out;
    };

    copy = Vec2.copy;

    /**
     * Negate v1 and return it into out
     *
     * @param {Vec2} out
     * @param {Vec2} v1
     * @returns {Vec2}
     */
    Vec2.negate = function (out, v1) {
        out[0] = -v1[0];
        out[1] = -v1[1];

        return out;
    };
    /**
     * Negate v1 and return it into out
     *
     * @param {Vec2} out
     * @param {Vec2} v1
     * @returns {Vec2}
     */
    Vec2.perpendicular = function (out, v1) {
        aux_number1 = v1[0];
        out[0] = -v1[1];
        out[1] = aux_number1;

        return out;
    };

    Vec2.perp = Vec2.perpendicular;
    Vec2.rotateCW = Vec2.perpendicular;

    Vec2.normalize = function (out, v1) {
        __x = v1[0];
        __y = v1[1];
        aux_number3 = sqrt(__x * __x + __y * __y);

        if (aux_number3 > EPS) {
            aux_number3 = 1 / aux_number3;
            out[0] = v1[0] * aux_number3;
            out[1] = v1[1] * aux_number3;
        }

        return out;
    };

    normalize = Vec2.normalize;

    Vec2.rperpendicular = function (out, v1) {
        aux_number1 = v1[0];
        out[0] = v1[1];
        out[1] = -aux_number1;

        return out;
    };

    Vec2.rerp = Vec2.rperpendicular;
    Vec2.rotateCCW = Vec2.rperpendicular;

    /**
     * Linearly interpolate between a and b.
     */
    Vec2.lerp = function (out, v1, v2, t) {
        out[0] = v1[0] + (v2[0] - v1[0]) * t;
        out[1] = v1[1] + (v2[1] - v1[1]) * t;

        return out;
    };

    Vec2.interpolate = Vec2.lerp;

    /**
     * Linearly interpolate between v1 towards v2 by distance d.
     */
    Vec2.lerpconst = function (out, v1, v2, d) {
        out[0] = v2[0] - v1[0];
        out[1] = v2[1] - v1[1];

        clamp(out, d);

        out[0] += v1[0];
        out[1] += v1[1];

        return out;
    };

    /**
     * Spherical linearly interpolate between v1 and v2.
     */
    Vec2.slerp = function (out, v1, v2, t) {
        var omega = acos(dot(v1, v2)),
            denom,
            comp1;

        if (omega) {
            denom = 1.0 / sin(omega);

            scale(out, v1, sin((1.0 - t) * omega) * denom);
            scale(aux_vec, sin(t * omega) * denom);

            return add(out, out, aux_vec);
        }

        return copy(out, v1);
    };

    slerp = Vec2.slerp;

    /**
     * Spherical linearly interpolate between v1 towards v2 by no more than angle a in radians.
     */
    Vec2.slerpconst = function (out, v1, v2, angle) {
        var _angle = acos(dot(v1, v2));
        return slerp(out, v1, v2, min(angle, _angle) / _angle);
    };

    /**
     * Returns the unit length vector for the given angle (in radians).
     */
    Vec2.forAngle = function (v1, angle) {
        v1[0] = cos(angle);
        v1[1] = sin(angle);

        return v1;
    };

    /**
     * Returns the vector projection of v1 onto v2.
     */
    Vec2.project = function (out, v1, v2) {
        multiply(out, v1, v2);
        scale(out, dot(v1, v2) / dot(v2, v2));

        return out;
    };

    /**
    * Rotates the point by the given angle around an optional center point.
    * The object itself is not modified.
    *
    * Read more about angle units and orientation in the description of the
    * {@link #angle} property.
    */
    Vec2.rotate = function (out, v1, angle, center) {
        if (center) {
            subtract(out, v1, center);
        } else {
            copy(out, v1);
        }

        var s = sin(angle),
            c = cos(angle);
        __x = v1[0];
        __y = v1[1];

        out[0] = __x * c - __y * s;
        out[1] = __y * c + __x * s;

        if (center) {
            add(out, out, center);
        }

        return out;
    };

    Vec2.rotateVec = function (out, v1, v2) {
        out[0] = v1[0] * v2[0] - v1[1] * v2[1];
        out[1] = v1[0] * v2[1] + v1[1] * v2[0];

        return out;
    };

    Vec2.unrotateVec = function (out, v1, v2) {
        out[0] = v1[0] * v2[0] + v1[1] * v2[1];
        out[1] = v1[1] * v2[0] - v1[0] * v2[1];

        return out;
    };

    Vec2.midPoint = function (out, v1, v2) {
        out[0] = (v1[0] + v2[0]) * 0.5;
        out[1] = (v1[1] + v2[1]) * 0.5;

        return out;
    };

    Vec2.reflect = function (out, v1, v2_normal) {
        aux_number1 = dot(v1, v2_normal);

        scale(out, v2_normal, 2 * aux_number1);
        subtract(out, v1, out);

        return out;
    };

    Vec2.subtract = function (out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];

        return out;
    };

    Vec2.sub = Vec2.subtract;
    subtract = Vec2.subtract;

    Vec2.add = function (out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];

        return out;
    };
    add = Vec2.add;

    Vec2.multiply = function (out, v1, v2) {
        out[0] = v1[0] * v2[0];
        out[1] = v1[1] * v2[1];

        return out;
    };

    multiply = Vec2.multiply;
    Vec2.mul = Vec2.multiply;

    Vec2.divide = function (out, v1, v2) {
        out[0] = v1[0] / v2[0];
        out[1] = v1[1] / v2[1];

        return out;
    };

    Vec2.div = Vec2.divide;

    Vec2.scale = function (out, v1, factor) {
        out[0] = v1[0] * factor;
        out[1] = v1[1] * factor;

        return out;
    };

    scale = Vec2.scale;

    Vec2.max = function (out, v1, v2) {
        out[0] = v1[0] > v2[0] ? v1[0] : v2[0];
        out[1] = v1[1] > v2[1] ? v1[1] : v2[1];

        return out;
    };

    Vec2.min = function (out, v1, v2) {
        out[0] = v1[0] < v2[0] ? v1[0] : v2[0];
        out[1] = v1[1] < v2[1] ? v1[1] : v2[1];

        return out;
    };

    Vec2.abs = function (out, v1) {
        out[0] = abs(v1[0]);
        out[1] = abs(v1[1]);

        return out;
    };

    Vec2.scaleAndAdd = function (out, v1, v2, scale) {
        out[0] = v1[0] + (v2[0] * scale);
        out[1] = v1[1] + (v2[1] * scale);

        return out;
    };

    Vec2.clamp = function (out, v1, len) {
        out[0] = v1[0];
        out[1] = v1[1];

        if (dot(v1, v1) > len * len) {
            normalize(out);
            multiply(out, len);
        }

        return out;
    };

    clamp = Vec2.clamp;

    //
    // function that return numbers
    //

    Vec2.magnitude = function (v1, v2) {
        __x = v1[0] - v2[0];
        __y = v1[1] - v2[1];

        return __x / __y;
    };

    /**
     * @member Vec2
     * @return {Number} 0 equal, 1 top, 2 top-right, 3 right, 4 bottom right, 5 bottom, 6 bottom-left, 7 left, 8 top-left
     */
    Vec2.compare = function (v1, v2) {
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
    };

    /**
     * Vector dot product.
     */
    Vec2.dot = function (v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    };

    dot = Vec2.dot;

    Vec2.cross = function (v1, v2) {
        return v1[0] * v2[1] - v1[1] * v2[0];
    };

    /**
     *
     */
    Vec2.toAngle = function (v1) {
        return atan2(v1[1], v1[0]);
    };

    Vec2.angle = Vec2.toAngle;

    /**
     * Returns the distance between v1 and v2.
     */
    Vec2.distance = function (v1, v2) {
        //subtract
        aux_number1 = v2[0] - v1[0];
        aux_number2 = v2[1] - v1[1];
        //sqrLength
        return sqrt(aux_number1 * aux_number1 + aux_number2 * aux_number2);
    };
    /**
     * Returns the squared length. Faster than Vec2.length when you only need to compare lengths.
     */
    Vec2.sqrDistance = function (v1, v2) {
        //subtract
        aux_vec[0] = v1[0] - v2[0];
        aux_vec[1] = v1[1] - v2[1];
        //sqrLength
        return aux_vec[0] * aux_vec[0] + aux_vec[1] * aux_vec[1];
    };
    Vec2.distanceSq = Vec2.sqrDistance;
    distanceSq = Vec2.sqrDistance;

    /**
     * Returns the length.
     */
    Vec2.length = function (v1) {
        return sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
    };

    Vec2.sqrLength = function (v1) {
        return v1[0] * v1[0] + v1[1] * v1[1];
    };

    Vec2.lengthSq = Vec2.sqrLength;

    /**
     * Return true iff q is between p and r (inclusive)
     */
    Vec2.within = function (p, q, r) {
        return ((p[0] <= q[0] && q[0] <= r[0]) || (r[0] <= q[0] && q[0] <= p[0])) &&
               ((p[1] <= q[1] && q[1] <= r[1]) || (r[1] <= q[1] && q[1] <= p[1]));
    };

    Vec2.$ = {};
    /**
     * Return true iff q is between p and r (inclusive)
     */
    Vec2.$.within = function (px, py, qx, qy, rx, ry) {
        return ((px <= qx && qx <= rx) || (rx <= qx && qx <= px)) &&
               ((py <= qy && qy <= ry) || (ry <= qy && qy <= py));
    };

    return Vec2;

}());


if ("undefined" === typeof module) {
    window.Vec2 = exp;
} else {
    module.exports = exp;
}