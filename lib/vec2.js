var exp;
(exp = function () {
    "use strict";

    var EPS = Math.EPS,
        acos = Math.acos,
        cos  = Math.cos,
        sqrt = Math.sqrt,
        abs  = Math.abs,
        sin  = Math.sin,
        min  = Math.min,
        atan2 = Math.atan2,
        Vec2,

        aux_vec = [0,0],
        __x = 0,
        __y = 0,
        aux_number1 = 0,
        aux_number2 = 0,
        aux_number3 = 0,
        aux_number4 = 0;


    //
    // creation
    //

    Vec2 = function(x, y) {
        return [x, y];
    };

    Vec2.zero = function () {
        return [0, 0];
    };

    Vec2.clone = function(v1) {
        return [v1[0], v1[1]];
    };

    //
    // compare operations
    //

    Vec2.equals = function (v1, v2) {
        return v2[0] === v1[0] && v2[1] === v1[1];
    };

    Vec2.equalsEpsilon = function (v1, v2) {
        aux_number1 = abs(v2[0] - v1[0]);
        aux_number2 = abs(v2[1] - v1[1]);

        return aux_number1 < EPS && aux_number2 < EPS;
    };

    Vec2.gt = function (v1, v2) {
        return v2[0] > v1[0] && v2[1] > v1[1];
    };

    Vec2.lt = function (v1, v2) {
        return v2[0] < v1[0] && v2[1] < v1[1];
    };

    /**
     * Returns true if the distance between v1 and v2 is less than dist.
     */
    Vec2.near = function (v1, v2, dist) {
        // maybe inline
        aux_number1 = Vec2.distanceSq(v1, v2);


        return aux_number1 < dist * dist;
    };

    //
    // validation
    //

    Vec2.isValid = function (v1) {
        return !(v1[0] === Infinity || v1[0] === -Infinity || isNaN(v1[0]) || v1[1] === Infinity || v1[1] === -Infinity || isNaN(v1[1]));
    };

    Vec2.isNaN = function (v1) {
        return isNaN(v1[0]) || isNaN(v1[1]);
    };

    //
    // first parameter is the output
    //

    Vec2.copy = function(out, v1) {
        out[0] = v1[0];
        out[1] = v1[1];

        return out;
    };

    Vec2.negate = function (out, v1) {
        out[0] = -v1[0];
        out[1] = -v1[1];

        return out;
    };

    Vec2.perpendicular = function (out, v1) {
        aux_number1 = v1[0];
        out[0] = -v1[1];
        out[1] = aux_number1;

        return out;
    };

    Vec2.perp = Vec2.perpendicular;
    Vec2.rotateCW = Vec2.perpendicular;

    Vec2.normalize = function(out, v1) {
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
    },
    /**
     * Linearly interpolate between v1 towards v2 by distance d.
     */
    Vec2.lerpconst = function (out, v1, v2, d) {
        out[0] = v2[0] - v1[0];
        out[1] = v2[1] - v1[1];

        Vec2.clamp(out, d);

        out[0] += v1[0];
        out[1] += v1[1];

        return out;
    },

    /**
     * Spherical linearly interpolate between v1 and v2.
     */
    Vec2.slerp = function (out, v1, v2, t) {
        var omega = acos(Vec2.dot(v1, v2)),
            denom,
            comp1;

        if (omega) {
            denom = 1.0 / sin(omega);

            Vec2.scale(out, v1, sin((1.0 - t) * omega) * denom);
            Vec2.scale(aux_vec, sin(t * omega) * denom);

            return Vec2.add(out, out, aux_vec);
        }

        return Vec2.copy(out, v1);
    },

    /**
     * Spherical linearly interpolate between v1 towards v2 by no more than angle a in radians.
     */
    Vec2.slerpconst = function (out, v1, v2, angle) {
        var _angle = acos(Vec2.dot(v1, v2));
        return Vec2.slerp(out, v1, v2, min(angle, _angle) / _angle);
    },

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
        Vec2.multiply(out, v1, v2);
        Vec2.scale(out, Vec2.dot(v1, v2) / Vec2.dot(v2, v2));

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
            Vec2.subtract(out, v1, center);
        } else {
            Vec2.copy(out, v1);
        }

        var s = sin(angle),
            c = cos(angle);
        __x = v1[0];
        __y = v1[1];

        out[0] = __x * c - __y * s;
        out[1] = __y * c + __x * s;

        if (center) {
            Vec2.add(out, out, center);
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
        aux_number1 = Vec2.dot(v1, v2_normal);

        Vec2.scale(out, v2_normal, 2 * aux_number1);
        Vec2.subtract(out, v1, out);

        return out;
    },

    Vec2.subtract = function (out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];

        return out;
    };

    Vec2.sub = Vec2.subtract;

    Vec2.add = function (out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];

        return out;
    };

    Vec2.multiply = function(out, v1, v2) {
        out[0] = v1[0] * v2[0];
        out[1] = v1[1] * v2[1];

        return out;
    };

    Vec2.mul = Vec2.multiply;

    Vec2.divide = function(out, v1, v2) {
        out[0] = v1[0] / v2[0];
        out[1] = v1[1] / v2[1];

        return out;
    };

    Vec2.div = Vec2.divide;

    Vec2.scale = function(out, v1, factor) {
        out[0] = v1[0] * factor;
        out[1] = v1[1] * factor;

        return out;
    };

    Vec2.max = function(out, v1, v2) {
        out[0] = v1[0] > v2[0] ? v1[0] : v2[0];
        out[1] = v1[1] > v2[1] ? v1[1] : v2[1];

        return out;
    };

    Vec2.min = function(out, v1, v2) {
        out[0] = v1[0] < v2[0] ? v1[0] : v2[0];
        out[1] = v1[1] < v2[1] ? v1[1] : v2[1];

        return out;
    };

    Vec2.abs = function (out, v1) {
        out[0] = abs(v1[0]);
        out[1] = abs(v1[1]);

        return out;
    },

    Vec2.scaleAndAdd = function(out, v1, v2, scale) {
        out[0] = v1[0] + (v2[0] * scale);
        out[1] = v1[1] + (v2[1] * scale);

        return out;
    };

    Vec2.clamp = function (out, v1, len) {
        out[0] = v1[0];
        out[1] = v1[1];

        if (Vec2.dot(v1, v1) > len * len) {
            Vec2.normalize(out);
            Vec2.multiply(out, len);
        }

        return out;
    };

    //
    // function that return numbers
    //

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

    return Vec2;

/*
    intersect: function (whoknows) {
        return Math.intersection(this, whoknows);
    },

    distance: function (whoknows) {
        return Math.intersection(this, whoknows);
    }
*/



}());


if ("undefined" === typeof module) {
    window.Vec2 = exp;
} else {
    module.exports = exp;
}