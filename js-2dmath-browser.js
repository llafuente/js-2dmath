require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Focm2+":[function(require,module,exports){
require("./lib/math.js");

module.exports = {
    Vec2: require("./lib/vec2.js"),
    Line2: require("./lib/line2.js"),
    Segment2: require("./lib/segment2.js"),
    Rectangle: require("./lib/rectangle.js"),
    BB2: require("./lib/boundingbox2.js"),
    Circle: require("./lib/circle.js"),
    Beizer: require("./lib/beizer.js"),
    Matrix2D: require("./lib/matrix2d.js"),
    Intersection: require("./lib/intersection.js"),
    Transitions: require("./lib/transitions.js"),
    Xorshift: require("./lib/xorshift.js"),
    Noise: require("./lib/noise.js"),
    Draw: require("./lib/draw.js"),
    globalize: function(object) {
        var i;
        for (i in this) {
            object[i] = this[i];
        }
    }
};


/*
// todo list
["Vec2", "Line2", "Segment2", "Rectangle", "Circle", "BB2"].forEach(function(v) {
    //console.log(v, module.exports[v]);
    if("function" !== typeof module.exports[v].distance) {
        console.log(v, " distance is missing");
    }
    if("function" !== typeof module.exports[v].length) {
        console.log(v, " length is missing");
    }
    if("function" !== typeof module.exports[v].area) {
        console.log(v, " area is missing");
    }

    ["Vec2", "Line2", "Segment2", "Rectangle", "Circle"].forEach(function(v2) {
        if (v == v2) {
            return;
        }
        if (!module.exports.Intersection[v.toLowerCase() + "_" + v2.toLowerCase()]) {
            console.log(v.toLowerCase() + "_" + v2.toLowerCase(), " intersection is missing");
        }
    });
});


//fast doc
var i,
    j,
    text;
for (i in module.exports) {
    console.log("### ", i);
    for (j in module.exports[i]) {
        text = module.exports[i][j].toString();
        text = text.split("\n");
        text = text[0].trim();
        text = text.substring(9, text.length - 1).trim();
        console.log("*", j, text);
    }
    console.log();
}
*/
},{"./lib/beizer.js":3,"./lib/boundingbox2.js":4,"./lib/circle.js":5,"./lib/draw.js":7,"./lib/intersection.js":8,"./lib/line2.js":9,"./lib/math.js":10,"./lib/matrix2d.js":11,"./lib/noise.js":12,"./lib/rectangle.js":13,"./lib/segment2.js":14,"./lib/transitions.js":15,"./lib/vec2.js":16,"./lib/xorshift.js":17}],"js-2dmath":[function(require,module,exports){
module.exports=require('Focm2+');
},{}],3:[function(require,module,exports){
var sqrt = Math.sqrt,
    cl0 = 0,
    cl1 = 0,
    cl2 = 0,
    cl3 = 0,
    t1 = 0,
    t2 = 0,
    t3 = 0;

/**
 * @returns {Beizer}
 */
function cubic(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y, cp3x, cp3y) {
    return [[cp0x, cp0y], [cp1x, cp1y], [cp2x, cp2y], [cp3x, cp3y]];
}
/**
 * @returns {Beizer}
 */
function quadric(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {
    return [[cp0x, cp0y], [cp1x, cp1y], [cp2x, cp2y]];
}
/**
 * @returns {Vec2}
 */
function get(out_vec2, curve, t) {
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
        get(pt, curve, t);
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
    get: get,
    length: length,
};


module.exports = Beizer;
},{}],4:[function(require,module,exports){
var min = Math.min,
    max = Math.max,
    TOPLEFT = 1,
    TOPMIDDLE = 2,
    TOPRIGHT = 3,

    CENTERLEFT = 4,
    CENTER = 5,
    CENTERRIGHT = 6,

    BOTTOMLEFT = 7,
    BOTTOM = 8,
    BOTTOMRIGHT = 9,

    r = 0,
    x = 0,
    y = 0,

    min_x = 0,
    max_x = 0,
    min_y = 0,
    max_y = 0;

/**
 * BoundingBox2 is an array [left: Number, bottom: Number, right: Number, top: Number, nomalized: Boolean]
 * @returns {BB2}
 */
function create(l, b, r, t) {
    var out = [l, b, r, t, false];
    normalize(out, out);
    return out;
}
/**
 * @returns {BB2}
 */
function fromCircle(circle) {
    r = circle[1];
    x = circle[0][0];
    y = circle[0][1];
    return create(
        x - r,
        y - r,
        x + r,
        y + r
    );
}
/**
 * @returns {BB2}
 */
function fromRectangle(rect) {
    var out = [rect[0][0], rect[0][1], rect[1][0], rect[1][1], false];
    normalize(out, out);
    return out;
}
/**
 * @returns {BB2}
 */
function zero() {
    return [0, 0, 0, 0, true];
}
/**
 * @returns {BB2}
 */
function clone(bb2) {
    return [bb2[0], bb2[1], bb2[2], bb2[3], bb2[4]];
}
/**
 * @returns {BB2}
 */
function copy(out, bb2) {
    out[0] = bb2[0];
    out[1] = bb2[1];
    out[2] = bb2[2];
    out[3] = bb2[3];
    out[4] = bb2[4];

    return out;
}
/**
 * @returns {BB2}
 */
function merge(out, bb2_1, bb2_2) {
    out[0] = min(bb2_1[0], bb2_2[0]);
    out[1] = min(bb2_1[1], bb2_2[1]);
    out[2] = max(bb2_1[2], bb2_2[2]);
    out[3] = max(bb2_1[3], bb2_2[3]);

    return out;
}
/**
 * @returns {BB2}
 */
function offsetMerge(out, bb2_1, bb2_2, vec2_offset) {
    out[0] = min(bb2_1[0], bb2_2[0] + vec2_offset[0]);
    out[1] = min(bb2_1[1], bb2_2[1] + vec2_offset[1]);
    out[2] = max(bb2_1[2], bb2_2[2] + vec2_offset[0]);
    out[3] = max(bb2_1[3], bb2_2[3] + vec2_offset[1]);

    return out;
}
/**
 * offset & scale merge
 * @returns {BB2}
 */
function osMerge(out, bb2_1, bb2_2, vec2_offset, vec2_scale) {
    out[0] = min(bb2_1[0], (bb2_2[0] * vec2_scale[0]) + vec2_offset[0]);
    out[1] = min(bb2_1[1], (bb2_2[1] * vec2_scale[1]) + vec2_offset[1]);
    out[2] = max(bb2_1[2], (bb2_2[2] * vec2_scale[0]) + vec2_offset[0]);
    out[3] = max(bb2_1[3], (bb2_2[3] * vec2_scale[1]) + vec2_offset[1]);

    return out;
}
/**
 * @returns {Number}
 */
function area(bb2) {
    return (bb2.r - bb2.l) * (bb2.t - bb2.b);
}
/**
 * @returns {BB2}
 */
function normalize(out, bb2) {
    min_x = bb2[0] > bb2[2] ? bb2[2] : bb2[0];
    max_x = bb2[0] > bb2[2] ? bb2[0] : bb2[2];
    min_y = bb2[1] > bb2[3] ? bb2[3] : bb2[1];
    max_y = bb2[1] > bb2[3] ? bb2[1] : bb2[3];

    out[0] = min_x;
    out[1] = min_y;

    out[2] = max_x;
    out[3] = max_y;

    out[4] = true;

}
/**
 * @returns {BB2}
 */
function translate(out, bb2, vec2) {
    x = vec2[0];
    y = vec2[1];

    out[0] = bb2[0] + x;
    out[1] = bb2[1] + y;
    out[2] = bb2[2] + x;
    out[3] = bb2[3] + y;

    return out;
}
/**
 * @returns {Vec2}
 */
function clampVec(out_vec2, bb2, vec2) {
    out_vec2[0] = min(max(bb2.l, vec2[0]), bb2.r);
    out_vec2[1] = min(max(bb2.b, vec2[1]), bb2.t);

    return out_vec2;
}

/**
 * alignament values: BB2.TOPLEFT, BB2.TOPMIDDLE, BB2.TOPRIGHT, BB2.CENTERLEFT, BB2.CENTER, BB2.CENTERRIGHT, BB2.BOTTOMLEFT, BB2.BOTTOM, BB2.BOTTOMRIGH
 * @returns {Vec2}
 */
function align(out_vec2, bb2, alignament) {
    switch (alignament) {
    case TOPLEFT:
        // do nothing!
        out_vec2[0] = bb2[0];
        out_vec2[1] = bb2[1];
        break;
    case TOPMIDDLE:
        out_vec2[0] = (bb2[2] - bb2[0]) * 0.5 + bb2[0];
        out_vec2[1] = bb2[1];
        break;
    case TOPRIGHT:
        out_vec2[0] = bb2[2];
        out_vec2[1] = bb2[1];
        break;

    case CENTERLEFT:
        out_vec2[0] = bb2[0];
        out_vec2[1] = (bb2[3] - bb2[1]) * 0.5 + bb2[1];
        break;
    case CENTER:
        out_vec2[0] = (bb2[2] - bb2[0]) * 0.5 + bb2[0];
        out_vec2[1] = (bb2[3] - bb2[1]) * 0.5 + bb2[1];
        break;
    case CENTERRIGHT:
        out_vec2[0] = bb2[2];
        out_vec2[1] = (bb2[3] - bb2[1]) * 0.5 + bb2[1];
        break;

    case BOTTOMLEFT:
        out_vec2[0] = bb2[0];
        out_vec2[1] = bb2[3];
        break;
    case BOTTOM:
        out_vec2[0] = (bb2[2] - bb2[0]) * 0.5 + bb2[0];
        out_vec2[1] = bb2[3];
        break;
    case BOTTOMRIGHT:
        out_vec2[0] = bb2[2];
        out_vec2[1] = bb2[3];
        break;
    }

    return out_vec2;
}

/**
 * @class BB2
 */
var BB2 =  {
    // defines
    TOPLEFT: TOPLEFT,
    TOPMIDDLE: TOPMIDDLE,
    TOPRIGHT: TOPRIGHT,
    CENTERLEFT: CENTERLEFT,
    CENTER: CENTER,
    CENTERRIGHT: CENTERRIGHT,
    BOTTOMLEFT: BOTTOMLEFT,
    BOTTOM: BOTTOM,
    BOTTOMRIGHT: BOTTOMRIGHT,

    create: create,
    fromCircle: fromCircle,
    fromRectangle: fromRectangle,
    zero: zero,
    clone: clone,
    copy: copy,
    merge: merge,
    offsetMerge: offsetMerge,
    osMerge: osMerge,
    area: area,
    normalize: normalize,
    translate: translate,
    clampVec: clampVec,
    align: align,
};


if ("undefined" !== typeof module) {
    module.exports = BB2;
}
},{}],5:[function(require,module,exports){
var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    max = Math.max,
    TWOPI = Math.TWOPI,
    PI = Math.PI;
/**
 * @returns {Circle}
 */
function create(x, y, radius) {
    return [[x, y], radius];
}
/**
 * @returns {Circle}
 */
function clone(circle) {
    return [[circle[0][0], circle[0][1]], circle[1]];
}
/**
 * @returns {Circle}
 */
function copy(out, circle) {
    out[0][0] = circle[0][0];
    out[0][1] = circle[0][1];
    out[1] = circle[1];

    return out;
}
/**
 * @returns {Circle}
 */
function translate(out, circle, vec2) {
    out[0][0] = circle[0][0] + vec2[0];
    out[0][1] = circle[0][1] + vec2[1];
    out[1] = circle[1];

    return out;
}
/**
 * @returns {Number}
 */
function distance(circle, circle_2) {
    return max(0, Vec2.distance(circle[0], circle_2[0]) - circle[1] - circle_2[1]);
}
/**
 * @returns {Number}
 */
function length(circle) {
    return TWOPI * circle[1];
}
/**
 * @returns {Number}
 */
function area(circle) {
    return PI * circle[1] * circle[1];
}
/**
 * @class Circle
 */
var Circle = {
    create: create,
    clone: clone,
    copy: copy,
    translate: translate,
    distance: distance,
    length: length,
    area: area
};


module.exports = Circle;
},{"./vec2.js":16}],6:[function(require,module,exports){
var browser = "undefined" === typeof module,
    sqrt = Math.sqrt,
    abs = Math.abs,
    min = Math.min,
    Rectangle = browser ? window.Rectangle : require("./rectangle.js"),
    x = 0,
    y = 0;

function fourPoints(x1, y1, x2, y2) {
    x = x1 - x2;
    y = y1 - y2;

    return sqrt(x * x + y * y);
}

function sqrFourPoints(x1, y1, x2, y2) {
    x = x1 - x2;
    y = y1 - y2;

    return x * x + y * y;
}

function line2_vec2(line2, vec2) {
    var __x1 = line2[0][0],
        __y1 = line2[0][1],
        __x2 = line2[0][0] + line2[1],
        __y2 = line2[0][1] + line2[1],
        __px = vec2[0],
        __py = vec2[1],
        r_numerator = (__x1 - __x2) * (__px - __x2) + (__y1 - __y2) * (__py - __y2),
        r_denomenator = (__px - __x2) * (__px - __x2) + (__py - __y2) * (__py - __y2),
        r = r_denomenator === 0 ? 0 : (r_numerator / r_denomenator),
        distanceLine,
        px,
        py,
        s;


    if ((r >= 0) && (r <= 1)) {
        return 0;
    }

    //
    px = __x2 + r * (__px - __x2);
    py = __y2 + r * (__py - __y2);
    //
    s = ((__y2 - __y1) * (__px - __x2) - (__x2 - __x1) * (__py - __y2)) / r_denomenator;
    distanceLine = abs(s) * sqrt(r_denomenator);

    return distanceLine;
}

function segment2_vec2(seg2, vec2) {
    var A = vec2[0] - seg2[0],
        B = vec2[1] - seg2[1],
        C = seg2[2] - seg2[0],
        D = seg2[3] - seg2[1],
        dot = A * C + B * D,
        len_sq = C * C + D * D,
        param = dot / len_sq,
        xx,
        yy;

    if (param < 0) {
        xx = seg2[0];
        yy = seg2[1];
    } else if (param > 1) {
        xx = seg2[2];
        yy = seg2[3];
    } else {
        xx = seg2[0] + param * C;
        yy = seg2[1] + param * D;
    }

    return fourPoints(vec2[0], vec2[1], xx, yy);
}

function rectangle_vec2(rect, vec2) {
    Rectangle.normalize(rect, rect);

    /*
    @TODO: Optimize, i cant find the right combination
    var hcat = vec2.x < rect.v1.x ? 0 : ( vec2.x > rect.v2.x ? 2 : 1 );
    var vcat = vec2.y > rect.v1.y ? 0 : ( vec2.y < rect.v2.y ? 2 : 1 );

    if(hcat == 0 && vcat == 0) return distance_vec2_vs_vec2(rect.v1, vec2);
    if(hcat == 2 && vcat == 2) return distance_vec2_vs_vec2(rect.v2, vec2);

    if(hcat == 0 && vcat == 2) return distance_vec2_vs_vec2(new Vec2(rect.v2.x, rect.v1.y), vec2);
    if(hcat == 2 && vcat == 0) return distance_vec2_vs_vec2(new Vec2(rect.v1.x, rect.v2.y), vec2);

    if(hcat == 0 && vcat == 1) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v1.y), new Vec2(rect.v1.x, rect.v2.y));
    if(hcat == 1 && vcat == 0) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v1.y), new Vec2(rect.v2.x, rect.v1.y));

    if(hcat == 2 && vcat == 1) return distance_segment2_vs_vec2(new Vec2(rect.v2.x, rect.v1.y), new Vec2(rect.v2.x, rect.v2.y));
    if(hcat == 1 && vcat == 2) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v2.y), new Vec2(rect.v2.x, rect.v2.y));
    */

    var s1 = [rect[0][0], rect[0][1], rect[0][0], rect[1][1]],
        s2 = [rect[0][0], rect[0][1], rect[1][0], rect[0][1]],

        s3 = [rect[0][0], rect[1][1], rect[1][0], rect[1][1]],
        s4 = [rect[1][0], rect[0][1], rect[1][0], rect[1][1]];

    return min(
        segment2_vec2(s1, vec2),
        segment2_vec2(s2, vec2),
        segment2_vec2(s3, vec2),
        segment2_vec2(s4, vec2)
    );
}

/**
 * @class Distance
 */
var Distance = {
    fourPoints: fourPoints,
    sqrFourPoints: sqrFourPoints,
    line2_vec2: line2_vec2,
    segment2_vec2: segment2_vec2,
    rectangle_vec2: rectangle_vec2,

    //alias
    fourPointsSq: sqrFourPoints
};


module.exports = Distance;
},{"./rectangle.js":13}],7:[function(require,module,exports){
function rectangle(context2d, rect, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.strokeRect(rect[0][0], rect[0][1], rect[1][0] - rect[0][0], rect[1][1] - rect[0][1]);
}

function circle(context2d, circle, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.arc(circle[0][0], circle[0][1], circle[1], 0, 2 * Math.PI, false);
    context2d.stroke();
}

function vec2(context2d, vec2, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(vec2[0] + 2, vec2[1] + 2);
    context2d.lineTo(vec2[0] - 2, vec2[1] - 2);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(vec2[0] - 2, vec2[1] + 2);
    context2d.lineTo(vec2[0] + 2, vec2[1] - 2);
    context2d.stroke();
}

function segment2(context2d, seg2, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(seg2[0], seg2[1]);
    context2d.lineTo(seg2[2], seg2[3]);
    context2d.stroke();

    context2d.beginPath();
    context2d.arc(seg2[0], seg2[1], 1, 0, 2 * Math.PI, false);
    context2d.stroke();

    context2d.beginPath();
    context2d.arc(seg2[2], seg2[3], 1, 0, 2 * Math.PI, false);
    context2d.stroke();

}

function bb2(context2d, bb2, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.strokeRect(bb2[0], bb2[1], bb2[2] - bb2[0], bb2[3] - bb2[1]);
}

function text(context2d, text, vec2, font) {
    font = font || "12pt Consolas";
    context2d.font = font;

    context2d.fillText(text, vec2[0], vec2[1]);
}


var Draw = {
    vec2: vec2,
    rectangle: rectangle,
    circle: circle,
    segment2: segment2,
    bb2: bb2,

    text: text
};

module.exports = Draw;
},{}],8:[function(require,module,exports){
var browser = "undefined" === typeof module,
    Rectangle = browser ? window.Rectangle : require("./rectangle.js"),
    Distance = browser ? window.Distance : require("./distance.js"),
    Segment2 = browser ? window.Segment2 : require("./segment2.js"),
    segment2$inside = Segment2.$.inside,
    BB2 = browser ? window.BB2 : require("./boundingbox2.js"),
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    abs = Math.abs,
    sqrt = Math.sqrt,
    max = Math.max,
    min = Math.min,
    EPS = Math.EPS,
    aux_vec2 = [0, 0],

    //cache
    OUTSIDE = 1, // no collision
    PARALLEL = 2, // no collision
    INSIDE = 4, // no collision
    COLLIDE = 8, // collision
    COINCIDENT = 16,  // collision
    TANGENT = 32; // collision

function near(num, num2) {
    return num > num2 - EPS && num < num2 + EPS;
}

//
// helpers
//

// x1 < x3
// TODO segment collision, maybe using segment-segment collision, this could slow down things!
// TODO distance
function $rectangle_rectangle(x1, y1, x2, y2, x3, y3, x4, y4, collision, distance) {
    var points,
        x_inside,
        y_inside;

    if (x2 < x3 || y1 > y4 || y2 < y3) {
        return {reason : OUTSIDE};
    }

    x_inside = x1 < x3 && x2 > x4;
    y_inside = y1 < y3 && y2 > y4;

    if (x_inside && y_inside) {
        return {reason : INSIDE};
    }

    if (collision === false) {
        return {reason: COLLIDE};
    }

    // complex cases, 4 point collision
    if (y1 > y3 && (x_inside || y_inside)) {
        points = [
            [max(x1, x3), max(y1, y3)],
            [min(x2, x4), min(y2, y4)],
            [min(x2, x4), max(y1, y3)],
            [max(x1, x3), min(y2, y4)]
        ];
    } else {
        //base case
        points = [
            [min(x2, x4), max(y1, y3)],
            [max(x1, x3), min(y2, y4)]
        ];
    }

    return {reason: COLLIDE, points : points};
}

function $rectangle_vec2(x1, y1, x2, y2, x3, y3, collision, distance) {
    if (x1 > x3 || x2 < x3 || y1 > y3 || y2 < y3) {
        return {reason: OUTSIDE};
        // TODO distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null
    }

    //if (bb[0] <= v[0] && bb[2] >= v[0] && bb[1] <= v[1] && bb[3] >= v[1]);
    if (x1 < x3 && x2 > x3 && y1 < y3 && y2 > y3) {
        return {reason: INSIDE};
        // TODO distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null
    }

    return {reason: COLLIDE, points : [[x3, y3]]};
}

function $circle_segment2(cx, cy, r, x1, y1, x2, y2, collision, distance) {

    var cx1 = x1 - cx,
        cy1 = y1 - cy,
        cx2 = x2 - cx,
        cy2 = y2 - cy,

        dx = cx2 - cx1,
        dy = cy2 - cy1,
        a = dx * dx + dy * dy,
        b = 2 * ((dx * cx1) + (dy * cy1)),
        c = (cx1 * cx1) + (cy1 * cy1) - (r * r),
        delta = b * b - (4 * a * c),
        u,
        u1,
        u2,
        deltasqrt,
        p,
        points;

    if (delta < 0) {
        // No intersection
        return {reason: OUTSIDE};
    }

    if (delta === 0) {
        // One intersection
        if (collision === false) {
            return {reason: TANGENT};
        }

        u = -b / (2 * a);

        p = [x1 + (u * dx), y1 + (u * dy)];

        if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
            return {reason: TANGENT, points: [p]};
        }

        return {reason: OUTSIDE};


        /* Use LineP1 instead of LocalP1 because we want our answer in global
           space, not the circle's local space */
    }

    // NOTE do not test collision === false, here, there is no performance gain here.
    if (delta > 0) {
        // Two intersections
        deltasqrt = sqrt(delta);

        u1 = (-b + deltasqrt) / (2 * a);
        u2 = (-b - deltasqrt) / (2 * a);

        points = [];

        p = [x1 + (u1 * dx), y1 + (u1 * dy)];

        if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
            points.push(p);
        }

        p = [x1 + (u2 * dx), y1 + (u2 * dy)];

        if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
            points.push(p);
        }

        if (points.length) {
            return {reason: TANGENT, points: points};
        }

        return {reason: OUTSIDE};
    }

}

function $circle_rectangle(cx, cy, r, x1, y1, x2, y2, collision, distance) {
    var points = [],
        r2,
        collide = false;

    // TODO inside test

    r2 = $circle_segment2(cx, cy, r, x1, y1, x2, y1, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    r2 = $circle_segment2(cx, cy, r, x1, y1, x1, y2, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    r2 = $circle_segment2(cx, cy, r, x1, y2, x2, y2, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    r2 = $circle_segment2(cx, cy, r, x2, y1, x2, y2, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    if (collide) {
        if (points === false) {
            return {reason: COLLIDE};
        }

        return {reason: COLLIDE, points: points};
    }

    return {reason: OUTSIDE};
}

function bb2_bb2(bb2_1, bb2_2, collision, distance) {
    BB2.normalize(bb2_1, bb2_1);
    BB2.normalize(bb2_2, bb2_2);

    // x1 should be further left!
    if (bb2_2[0] < bb2_1[0]) {
        return $rectangle_rectangle(
            bb2_2[0], bb2_2[1], bb2_2[2], bb2_2[3],
            bb2_1[0], bb2_1[1], bb2_1[2], bb2_1[3],
            collision === true,
            distance === true
        );
    }

    return $rectangle_rectangle(
        bb2_1[0], bb2_1[1], bb2_1[2], bb2_1[3],
        bb2_2[0], bb2_2[1], bb2_2[2], bb2_2[3],
        collision === true,
        distance === true
    );
}

function bb2_vec2(bb2, vec2, collision, distance) {
    return $rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1], collision === true, distance === true);
}

function vec2_bb2(vec2, bb2, collision, distance) {
    return $rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1], collision === true, distance === true);
}

/**
 * TODO segments of collision
 */
function rectangle_rectangle(rect1, rect2, collision, distance) {
    Rectangle.normalize(rect1, rect1);
    Rectangle.normalize(rect2, rect2);

    // r1 should be further left!
    if (rect2[0][0] < rect1[0][0]) {
        return $rectangle_rectangle(
            rect2[0][0], rect2[0][1], rect2[1][0], rect2[1][1],
            rect1[0][0], rect1[0][1], rect1[1][0], rect1[1][1],
            collision === true,
            distance === true
        );
    }

    return $rectangle_rectangle(
        rect1[0][0], rect1[0][1], rect1[1][0], rect1[1][1],
        rect2[0][0], rect2[0][1], rect2[1][0], rect2[1][1],
        collision === true,
        distance === true
    );

}

/**
 * TODO segments of collision
 */
function bb2_rectangle(bb2, rect, collision, distance) {
    BB2.normalize(bb2, bb2);
    Rectangle.normalize(rect, rect);

    // r1 should be further left!
    if (bb2[0] < rect[0][0]) {
        return $rectangle_rectangle(
            rect[0][0], rect[0][1], rect[1][0], rect[1][1],
            bb2[0], bb2[1], bb2[2], bb2[3],
            collision === true,
            distance === true
        );
    }

    return $rectangle_rectangle(
        bb2[0], bb2[1], bb2[2], bb2[3],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true,
        distance === true
    );
}

function rectangle_bb2(rect, bb2, collision, distance) {
    return bb2_rectangle(bb2, rect, collision, distance);
}


/**
 *
 */
function rectangle_vec2(rect, vec2, collision, distance) {
    return $rectangle_vec2(rect[0][0], rect[0][1], rect[1][0], rect[1][1], vec2[0], vec2[1], collision === true, distance === true);
}

function vec2_rectangle(vec2, rect, collision, distance) {
    return $rectangle_vec2(rect[0][0], rect[0][1], rect[1][0], rect[1][1], vec2[0], vec2[1], collision === true, distance === true);
}

/**
 *
 */
function circle_vec2(circle, vec2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var distance_to_center = Vec2.distance(circle[0], vec2);

    if (near(distance_to_center, circle[1])) {
        return {reason: COLLIDE, points: [vec2]};
    }

    if (distance_to_center < circle[1]) {
        return {reason: INSIDE, distance: abs(distance_to_center - circle[1])};
    }
    return {reason: OUTSIDE, distance: abs(distance_to_center - circle[1])};
}

function vec2_circle(vec2, circle, collision, distance) {
    circle_vec2(circle, vec2, collision, distance);
}
/**
 *
 */
function circle_circle(circle_1, circle_2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var c1 = circle_1[0],
        c2 = circle_2[0],
        r1 = circle_1[1],
        r2 = circle_2[1],
        r1sq = r1 * r1,
        r2sq = r2 * r2,
        // Determine minimum and maximum radius where circles can intersect
        r_max = r1sq + r2sq + r1 * r2 * 2,
        r_min = r1 - r2,
        // Determine actual distance between circle circles
        c_dist_sq = Vec2.distanceSq(c1, c2),
        c_dist,
        a,
        h,
        b,
        points,
        z;

    if (c_dist_sq > r_max * r_max) {
        return {reason: OUTSIDE};
    }

    if (c_dist_sq < r_min * r_min) {
        return {reason: INSIDE};
    }

    if (collision === false) {
        return {reason: COLLIDE};
    }

    points = [];

    c_dist = sqrt(c_dist_sq);

    a = (r1sq - r2sq + c_dist_sq) / (2 * c_dist);
    z = r1sq - a * a;
    h = sqrt(z > 0 ? z : -z);

    Vec2.lerp(aux_vec2, c1, c2, a / c_dist);

    b = h / c_dist;

    points.push([aux_vec2[0] - b * (c2[1] - c1[1]), aux_vec2[1] + b * (c2[0] - c1[0])]);
    points.push([aux_vec2[0] + b * (c2[1] - c1[1]), aux_vec2[1] - b * (c2[0] - c1[0])]);

    return {reason: COLLIDE, points: points};
}

function circle_bb2(circle, bb2, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        bb2[0], bb2[1], bb2[2], bb2[3],
        collision === true, distance === true);
}

function bb2_circle(bb2, circle, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        bb2[0], bb2[1], bb2[2], bb2[3],
        collision === true, distance === true);
}

function circle_rectangle(circle, rect, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true, distance === true);
}

function rectangle_circle(rect, circle, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true, distance === true);
}

function circle_segment2(circle, seg2, collision, distance) {
    return $circle_segment2(
        circle[0][0], circle[0][1], circle[1],
        seg2[0], seg2[1], seg2[2], seg2[3],
        collision === true,
        distance === true
    );
}

function segment2_circle(seg2, circle, collision, distance) {
    return $circle_segment2(
        circle[0][0], circle[0][1], circle[1],
        seg2[0], seg2[1], seg2[2], seg2[3],
        collision === true,
        distance === true
    );
}

function line2_line2(line2_1, line2_2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var a1 = [line2_1[0][0], line2_1[0][1]],
        a2 = [0, 0], // XXX check! m,1 ??
        b1 = [line2_2[0][0], line2_2[0][1]],
        b2 = [0, 0],
        ua_t,
        ub_t,
        u_b,
        ua,
        ub;

    Vec2.add(a2, a1, [line2_1[1], 1]);
    Vec2.add(b2, b1, [line2_2[1], 1]);

    ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if (u_b !== 0) {
        ua = ua_t / u_b;
        ub = ub_t / u_b;

        if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            if (collision === false) {
                return {reason: COLLIDE};
            }
            return {reason: COLLIDE, points: [[a1[0] + ua * (a2[0] - a1[0]), a1[1] + ua * (a2[1] - a1[1])]]};
        }
        return {reason: OUTSIDE};
    }
    if (ua_t === 0 || ub_t === 0) {
        return {reason: COINCIDENT};
    }
    return {reason: PARALLEL};
}

function segment2_segment2(seg2_1, seg2_2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var mua,
        mub,
        denom,
        numera,
        numerb,
        points,
        i,
        max,
        minp,
        maxp,
        dist;

    denom  = (seg2_2[3] - seg2_2[1]) * (seg2_1[2] - seg2_1[0]) - (seg2_2[2] - seg2_2[0]) * (seg2_1[3] - seg2_1[1]);
    numera = (seg2_2[2] - seg2_2[0]) * (seg2_1[1] - seg2_2[1]) - (seg2_2[3] - seg2_2[1]) * (seg2_1[0] - seg2_2[0]);
    numerb = (seg2_1[2] - seg2_1[0]) * (seg2_1[1] - seg2_2[1]) - (seg2_1[3] - seg2_1[1]) * (seg2_1[0] - seg2_2[0]);

    /* Are the line coincident? */
    if (Math.abs(numera) < Math.EPS && Math.abs(numerb) < Math.EPS && Math.abs(denom) < Math.EPS) {

        if (collision === false) {
            return {
                reason : COLLIDE
            };
        }

        // check if the intersections is a line!
        points = [];
        points.push(segment2_vec2(seg2_2, [seg2_1[0], seg2_1[1]]));
        points.push(segment2_vec2(seg2_2, [seg2_1[2], seg2_1[3]]));
        points.push(segment2_vec2(seg2_1, [seg2_2[0], seg2_2[1]]));
        points.push(segment2_vec2(seg2_1, [seg2_2[2], seg2_2[3]]));
        // now check those intersections, remove no intersections!
        max = points.length;
        minp = { distance: false, point: null};
        maxp = { distance: false, point: null};


        for (i = 0; i < max; ++i) {
            if (points[i].reason <= COLLIDE) { // no collision
                points.splice(i, 1);
                --i;
                max = points.length;
            } else {

                dist = Vec2.lengthSq(points[i].points[0]);

                if (minp.distance === false || minp.distance > dist) {
                    minp.distance = dist;
                    minp.point = points[i].points[0];
                }

                if (maxp.distance === false || minp.distance < dist) {
                    maxp.distance = dist;
                    maxp.point = points[i].points[0];
                }
            }
        }

        if (points.length > 1) {
            //line intersection!
            return {
                reason : COLLIDE,
                points: [],
                segments: [[minp.point[0], minp.point[1], maxp.point[0], maxp.point[1]]]
            };
        }

        return {
            reason : COINCIDENT
        };
    }

    /* Are the line parallel */
    if (Math.abs(denom) < Math.EPS) {
        return {reason: PARALLEL};
    }

    /* Is the intersection along the the segments */
    mua = numera / denom;
    mub = numerb / denom;
    if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
        return {reason: OUTSIDE};
    }

    if (collision === false) {
        return {reason: COLLIDE};
    }

    return {reason: COLLIDE, points: [[seg2_1[0] + mua * (seg2_1[2] - seg2_1[0]), seg2_1[1] + mua * (seg2_1[3] - seg2_1[1])]]};
}

function segment2_vec2(seg2, vec2) {
    var dis = Distance.segment2_vec2(seg2, vec2);

    if (dis === 0) {
        return {
            reason : COLLIDE,
            points: [vec2]
        };
    }

    return {
        reason : OUTSIDE,
        distance: dis
    };
}

function vec2_segment2(vec2, seg2) {
    return segment2_vec2(seg2, vec2);
}

/**
 * @class Intersection
 */
var Intersection = {
    OUTSIDE: OUTSIDE,
    PARALLEL: PARALLEL,
    COLLIDE: COLLIDE,
    INSIDE: INSIDE,
    COINCIDENT: COINCIDENT,
    TANGENT: TANGENT,

    bb2_bb2: bb2_bb2,
    bb2_vec2: bb2_vec2,
    vec2_bb2: vec2_bb2,
    rectangle_rectangle: rectangle_rectangle,
    bb2_rectangle: bb2_rectangle,
    rectangle_bb2: rectangle_bb2,
    rectangle_vec2: rectangle_vec2,
    vec2_rectangle: vec2_rectangle,
    circle_vec2: circle_vec2,
    vec2_circle: vec2_circle,
    circle_circle: circle_circle,
    circle_bb2: circle_bb2,
    bb2_circle: bb2_circle,
    circle_rectangle: circle_rectangle,
    rectangle_circle: rectangle_circle,
    circle_segment2: circle_segment2,
    segment2_circle: segment2_circle,
    line2_line2: line2_line2,
    segment2_segment2: segment2_segment2,
    segment2_vec2: segment2_vec2,
    vec2_segment2: vec2_segment2,

    $: {
        rectangle_rectangle: $rectangle_rectangle,
        rectangle_vec2: $rectangle_vec2,
        circle_segment2: $circle_segment2,
        circle_rectangle: $circle_rectangle
    }
};


module.exports = Intersection;
},{"./boundingbox2.js":4,"./distance.js":6,"./rectangle.js":13,"./segment2.js":14,"./vec2.js":16}],9:[function(require,module,exports){
/**
 * @returns {Line2}
 */
function create(x, y, m) {
    return [[x, y], m];
}
/**
 * @returns {Line2}
 */
function fromPoints(x1, y1, x2, y2) {
    return [[x1, y1], (x1 - x2) / (y1 - y2)];
}
/**
 * @returns {Line2}
 */
function fromSegment2(seg2) {
    return [[seg2[0], seg2[1]], (seg2[0] - seg2[2]) / (seg2[1] - seg2[3])];
}
/**
 * @returns {Line2}
 */
function copy(out, l1) {
    out[0][0] = l1[0][0];
    out[0][1] = l1[0][1];
    out[1] = l1[1];

    return out;
}
/**
 * @returns {Line2}
 */
function clone(l1) {
    return [[l1[0][0], l1[0][1]], l1[1]];
}
/**
 * @returns {Line2}
 */
function add(out, l1, v1) {
    out[0][0] = l1[0][0] + v1[0];
    out[0][1] = l1[0][1] + v1[1];
    out[1] = l1[1];

    return out;
}
/**
 * @returns {Line2}
 */
function subtract(out, l1, v1) {
    out[0][0] = l1[0][0] - v1[0];
    out[0][1] = l1[0][1] - v1[1];
    out[1] = l1[1];

    return out;
}
/**
 * @returns {Line2}
 */
function parallel(out, l1) {
    out[0][0] = l1[0][0];
    out[0][1] = l1[0][1];
    out[1] = 1 / l1[1];

    return out;
}

/**
 * @class Line2
 */
var Line2 = {
    create: create,
    fromPoints: fromPoints,
    fromSegment2: fromSegment2,
    copy: copy,
    clone: clone,
    add: add,
    subtract: subtract,
    parallel: parallel,

    // alias
    translate: add,
    sub: subtract
};


module.exports = Line2;
},{}],10:[function(require,module,exports){
(function () {
    "use strict";

    var clamp,
        sqrt = Math.sqrt,
        random = Math.random,
        ceil = Math.ceil,
        floor = Math.floor;

    Math.QUATER_PI = 0.25 * Math.PI;
    Math.HALF_PI = 0.5 * Math.PI;
    Math.TWO_PI = 2 * Math.PI;
    Math.TWO_HALF_PI = (2 * Math.PI) + Math.HALF_PI;
    Math.EPS = 10e-3;
    Math.INV_PI = 1 / Math.PI;
    Math.RAD_TO_DEG = 180 / Math.PI;
    Math.DEG_TO_RAD = Math.PI / 180;

    Math.cross = function (x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    };

    Math.dot = function (x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    };

    /// Clamp @c f to be between @c min and @c max.
    Math.clamp = clamp = function (f, minv, maxv) {
        return f < minv ? minv : (f > maxv ? maxv : f);
    };

    /// Clamp @c f to be between 0 and 1.
    Math.clamp01 = function (f) {
        return f < 0 ? 0 : (f > 1 ? 1 : f);
    };

    /// Linearly interpolate (or extrapolate) between @c f1 and @c f2 by @c t percent.
    Math.lerp = function (f1, f2, t) {
        return f1 * (1 - t) + f2 * t;
    };

    /// Linearly interpolate from @c f1 to @c f2 by no more than @c d.
    Math.lerpconst = function (f1, f2, d) {
        return f1 + clamp(f2 - f1, -d, d);
    };

    Math.length = function (x, y) {
        return sqrt(x * x + y * y);
    };

    Math.lengthSq = function (x, y) {
        return x * x + y * y;
    };
    Math.sqrLength = Math.lengthSq;


    Math.randRange = function (max, min) {
        if (max === undefined) {
            return random();
        }
        min = min || 0;

        return random() * (max - min) + min;
    };

    Math.randInt = function (max, min) {
        min = min || 0;

        return floor(random() * (max - min + 1) + min);
    };

    Math.snap = function (value, snapSize) {
        return Math.floor(value / snapSize) * snapSize;
    };


    Math.snapRound = function (value, snapSize) {
        var steps = value / snapSize | 0,
            remain = value - (steps * snapSize),
            rounder = remain > (snapSize / 2) ? ceil : floor;

        return rounder(value / snapSize) * snapSize;
    };


}());
},{}],11:[function(require,module,exports){
// cache variables
var DEG_TO_RAD = Math.DEG_TO_RAD,
    PI = Math.PI,
    cos = Math.cos,
    sin = Math.sin,
    tan = Math.tan,
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

//
// TODO dSetSkewX / dSetSkewY
//

/**
 * Creates a new identity 2x3 matrix
 * @returns {Matrix2D} 
 */
function create() {
    return [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false];
}

/**
 * Creates a new matrix given 4 points(a Rectangle)
 *
 * @returns {Matrix2D} a new 2x3 matrix
 */
/// @TODO http://jsfiddle.net/dFrHS/1/
function fromPoints() {
}

/**
 * Copy m2d into out
 *
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @returns {Matrix2D} out 2x3 matrix
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
 * @param {Matrix2D} out destiny matrix
 * @returns {Matrix2D} out 2x3 matrix
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
 * Rotates a Matrix2D by the given angle in degrees(increment rotation)
 * @note increment rotation
 *
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} degrees Degrees
 * @returns {Matrix2D} out 2x3 matrix
 */
function dRotate(out, m2d, degrees) {
    return rotate(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Rotates a Matrix2D by the given angle in radians(increment rotation)
 * @note increment rotation
 *
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} radians Radians
 * @returns {Matrix2D} out 2x3 matrix
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

    out[6][4] += radians;

    out[7] = true;

    if (out[4] === false || isNaN(out[4])) {
        throw new Error("wtf!");
    }

    return out;
}

/**
 * Set rotation of a Matrix2D by the given angle in degrees(set rotation)
 * @note set rotation
 *
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} degree Degrees
 * @returns {Matrix2D} out 2x3 matrix
 */
function dRotation(out, m2d, degrees) {
    return rotation(out, m2d, degrees * DEG_TO_RAD);
}

/**
 * Set rotation of a Matrix2D by the given angle in radians(set rotation)
 * @note set rotation
 *
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} radians Radians
 * @returns {Matrix2D} out 2x3 matrix
 */
function rotation(out, m2d, radians) {
    c = radians - out[6][4];

    rotate(out, m2d, c);

    out[6][4] = radians;
    out[7] = true;

    if (out[4] === false || isNaN(out[4])) {
        throw new Error("wtf!");
    }

    return out;
}

/**
 * Translates given Matrix2D by the dimensions in the given vec2
 * @note This translation is affected by rotation/skew
 * @note increment position
 * @see gTranslate
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2 amount to be translated
 * @returns {Matrix2D} out 2x3 matrix
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

    // <debug>
    if (out[4] === false || isNaN(out[4])) {
        throw new Error("wtf!");
    }
    // </debug>

    return out;
}

/**
 * Translates given Matrix2D by the dimensions in the given vec2
 * @note This translation is NOT affected by rotation/skew
 * @note increment position
 * @see translate
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2 amount to be translated
 * @returns {Matrix2D} out 2x3 matrix
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

    // <debug>
    if (out[4] === false || isNaN(out[4])) {
        throw new Error("wtf!");
    }
    // </debug>

    return out;
}

/**
 * Set Matrix2D position
 * @note This translation is NOT affected by rotation/skew
 * @note set position
 * @see gTranslate
 * @see translate
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @returns {Matrix2D} out 2x3 matrix
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

    // <debug>
    if (out[4] === false || isNaN(out[4])) {
        throw new Error("wtf!");
    }
    // </debug>

    return out;
}

/**
 * Scales the Matrix2D by the dimensions in the given vec2

 * @note incremental scale
 * @note do not affect position
 * @see scalation
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} v1 destiny position
 * @returns {Matrix2D} out 2x3 matrix
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
 * Set the Matrix2D scale by the dimensions in the given vec2

 * @note set scale
 * @note do not affect position
 * @see scale
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @returns {Matrix2D} out 2x3 matrix
 */
function scalation(out, m2d, vec2) {
    return scale(out, m2d, [vec2[0] / m2d[6][0], vec2[1] / m2d[6][1]]);
}

/**
 * Increment the Matrix2D x-skew by given degrees
 *
 * @note increment skewX
 * @see skewX
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} degrees Degrees to skew
 * @returns {Matrix2D} out 2x3 matrix
 */
function dSkewX(out, m2d, degrees) {
    return skewX(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Increment the Matrix2D x-skew by given radians
 *
 * @note increment skewX
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} radians Radians to skew
 * @returns {Matrix2D} out 2x3 matrix
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
 * Increment the Matrix2D y-skew by given degrees
 *
 * @note increment skewY
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} degrees Degrees to skew
 * @returns {Matrix2D} out 2x3 matrix
 */
function dSkewY(out, m2d, degrees) {
    return skewY(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Increment the Matrix2D y-skew by given radians
 *
 * @note increment skewY
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Number} radians Radians to skew
 * @returns {Matrix2D} out 2x3 matrix
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
 * Increment the Matrix2D skew y by given degrees in vec2_degrees
 *
 * @note increment skew
 * @see dSetSkew
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2_degrees Degrees to skew
 * @returns {Matrix2D} out 2x3 matrix
 */
function dSkew(out, m2d, vec2_degrees) {
    aux_vec[0] = vec2_degrees[0] * DEG_TO_RAD;
    aux_vec[1] = vec2_degrees[1] * DEG_TO_RAD;

    return skew(out, m2d, aux_vec);
}

/**
 * Increment the Matrix2D skew y by given radians in vec2
 *
 * @note increment skew
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2 Radians to skew
 * @returns {Matrix2D} out 2x3 matrix
 */
function skew(out, m2d, vec2) {
    c = tan(vec2[0]);
    s = tan(vec2[1]);

    out[0] = m2d[0] + m2d[2] * s;
    out[1] = m2d[1] + m2d[3] * s;
    out[2] = m2d[2] + m2d[0] * c;
    out[3] = m2d[3] + m2d[1] * c;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2] + vec2[0];
    out[6][3] = m2d[6][3] + vec2[1];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}
/**
 * Set the Matrix2D skew y by given degrees in vec2_degrees
 *
 * @note set skew
 * @see setSkew
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2_degrees Degrees to skew
 * @returns {Matrix2D} out 2x3 matrix
 */
function dSetSkew(out, m2d, vec2_degrees) {
    aux_vec[0] = vec2_degrees[0] * DEG_TO_RAD;
    aux_vec[1] = vec2_degrees[1] * DEG_TO_RAD;

    return setSkew(out, m2d, aux_vec);
}

/**
 * Set the Matrix2D skew y by given radians in vec2
 *
 * @note set skew
 * @param {Matrix2D} out destiny matrix
 * @param {Matrix2D} m2d source matrix
 * @param {Vec2} vec2 Radians to skew
 * @returns {Matrix2D} out 2x3 matrix
 */
function setSkew(out, m2d, vec2) {
    c = tan(vec2[0] - m2d[6][2]);
    s = tan(vec2[1] - m2d[6][3]);

    out[0] = m2d[0] + m2d[2] * s;
    out[1] = m2d[1] + m2d[3] * s;
    out[2] = m2d[2] + m2d[0] * c;
    out[3] = m2d[3] + m2d[1] * c;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = vec2[0];
    out[6][3] = vec2[1];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}


/**
 * Multiplies two Matrix2D's
 *
 * @param {Matrix2D} out destiny matrix(A*B)
 * @param {Matrix2D} m2d A matrix
 * @param {Matrix2D} m2d_2 B matrix
 * @returns {Matrix2D} out 2x3 matrix
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
 * Multiplies a Matrix2D and a Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix2D} m2d source Matrix2D
 * @param {Vec2} vec2
 * @returns {Vec2} out_vec2, result Vec2
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
 * @param {Matrix2D} m2d source Matrix2D
 * @returns {Vec2} out_vec2, result Vec2
 */
function getPosition(out_vec2, m2d) {
    //<debug>
    if (m2d[4] === false || isNaN(m2d[4])) {
        throw new Error("wtf!");
    }
    //</debug>

    out_vec2[0] = m2d[4];
    out_vec2[1] = m2d[5];

    return out_vec2;
}

/**
 * Retrieve current scale as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix2D} m2d source Matrix2D
 * @returns {Vec2} out_vec2, result Vec2
 */
function getScale(out_vec2, m2d) {
    if (m2d[6][0] === false || isNaN(m2d[6][0])) {
        throw new Error("wtf!");
    }
    out_vec2[0] = m2d[6][0];
    out_vec2[1] = m2d[6][1];

    return out_vec2;
}

/**
 * Retrieve current skew as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix2D} m2d source Matrix2D
 * @returns {Vec2} out_vec2, result Vec2
 */
function getSkew(out_vec2, m2d) {
    if (m2d[6][0] === false || isNaN(m2d[6][0])) {
        throw new Error("wtf!");
    }
    out_vec2[0] = m2d[6][2];
    out_vec2[1] = m2d[6][3];

    return out_vec2;
}

/**
 * Alias of rotate 180º(PI)
 *
 * @param {Matrix2D} out destiny Matrix2D
 * @param {Matrix2D} m2d source Matrix2D
 * @returns {Matrix2D} out 2x3 matrix
 */
function reflect(out, m2d) {
    return rotate(out, m2d, PI);
}

/// @TODO this a transformation matrix, what inverse means for us, mirror ?
function inverse(out, m2d) {
}

/// @TODO needed ?
function transpose(out, m2d) {
}

/// @TODO review
function determinant(out, m2d) {
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
 * @returns {Matrix2D} a new 2x3 matrix
 */
function translationMatrix(x, y) {
    return [ 1, 0, 0, 1, x, y ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given degrees.
 *
 * @param {Number} degrees
 * @returns {Matrix2D} a new 2x3 matrix
 */
function dSkewXMatrix(degrees) {
    return [ 1, 0, tan(degrees * 0.017453292519943295769236907684886), 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @returns {Matrix2D} a new 2x3 matrix
 */
function skewXMatrix(radians) {
    return [ 1, 0, tan(radians), 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given degrees.
 *
 * @param {Number} degrees
 * @returns {Matrix2D} a new 2x3 matrix
 */
function dSkewYMatrix(degrees) {
    return [ 1, tan(degrees * 0.017453292519943295769236907684886), 0, 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @returns {Matrix2D} a new 2x3 matrix
 */
function skewYMatrix(radians) {
    return [ 1, tan(radians), 0, 1, 0, 0 ];
}


/**
 * Returns a 3x2 2D column-major scaling matrix for sx and sy.
 *
 * @param {Number} sx
 * @param {Number} sy
 */
function scalingMatrix(x, y) {
    return [ x, 0, 0, y, 0, 0 ];
}



/**
 * Transformation matrix used for 2D(column-major), AKA matrix2X3
 * matrix example:
 * [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false]
 * 0-6 data 2x3 matrix is here
 * 6 cached data, cached data to support setRotation, setScale, setSkew and other functions
 * 7 is modified, user must ser this boolean to false after recalculations
 */
var Matrix2D =  {
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
    inverse: inverse,
    transpose: transpose,
    determinant: determinant,
    translationMatrix: translationMatrix,
    dSkewXMatrix: dSkewXMatrix,
    skewXMatrix: skewXMatrix,
    dSkewYMatrix: dSkewYMatrix,
    skewYMatrix: skewYMatrix,
    scalingMatrix: scalingMatrix,

    // alias
    dSetRotation: dRotation,
    setRotation: rotation,
    setPosition: position,
    setScale: scalation,
};

module.exports = Matrix2D;
},{}],12:[function(require,module,exports){
var exp;
(exp = function () {
    "use strict";

    var browser = "undefined" === typeof module,
        object = require("object-enhancements"),
        Xorshift = browser ? window.Xorshift : require("./xorshift.js"),
        GRAD3 = [
            [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
        ],

        GRAD4 = [
            [0, 1, 1, 1],  [0, 1, 1, -1],  [0, 1, -1, 1],  [0, 1, -1, -1],
            [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1],
            [1, 0, 1, 1],  [1, 0, 1, -1],  [1, 0, -1, 1],  [1, 0, -1, -1],
            [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1],
            [1, 1, 0, 1],  [1, 1, 0, -1],  [1, -1, 0, 1],  [1, -1, 0, -1],
            [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1],
            [1, 1, 1, 0],  [1, 1, -1, 0],  [1, -1, 1, 0],  [1, -1, -1, 0],
            [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]
        ],

        SIMPLEX = [
            [0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0],
            [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0],
            [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
            [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0],
            [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0],
            [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
            [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0],
            [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]
        ],
        sqrt = Math.sqrt,
        floor = Math.floor,
        random = Math.random,
        sqrt_of_3 = sqrt(3),

        Noise = {};

    // from: http://jsdo.it/akm2/fhMC/js
    // don't know the author, if you are contact me.
    // I just lint the code (a little)... and adapt it to the lib philosophy (that means remove 3d noises)
    // TODO optimize, there is performance gain everywhere!


    // Common helpers

    function dot2d(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    function dot3d(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }

    // Simplex helper

    function dot4d(g, x, y, z, w) {
        return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
    }

    // Classic helpers

    function mix(a, b, t) {
        return (1 - t) * a + t * b;
    }

    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }



    /**
     * @see http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
     *
     * Tiling Example (heavy...)
     *
     * var perlinNoise = new PerlinNoise();
     *
     * function tilingNoise2d(x, y, w, h) {
     *     return (perlinNoise.noise(x, y) * (w - x) * (h - y) +
     *         perlinNoise.noise(x - w, y) * x * (h - y) +
     *         perlinNoise.noise(x - w, y - h) * x * y +
     *         perlinNoise.noise(x, y - h) * (w - x) * y) / (w * h);
     */


    /**
     * ClassicNoise
     */
    function ClassicNoise(seed) {
        this.seed(seed);
    }

    ClassicNoise.prototype = {
        _octaves: 4,
        _fallout: 0.5,

        seed: function (seed) {
            var random = Xorshift.create(seed || new Date().getTime()).random,
                i,
                p = [],
                perm = [];

            for (i = 0; i < 256; i++) {
                p[i] = floor(random() * 256);
            }

            for (i = 0; i < 512; i++) {
                perm[i] = p[i & 255];
            }

            this._perm = perm;
        },

        octaves: function (octaves) {
            if (!arguments.length) {
                return this._octaves;
            }
            return this._octaves = octaves;
        },

        fallout: function (fallout) {
            if (!arguments.length) {
                return this._fallout;
            }
            return this._fallout = fallout;
        },

        noise: function (x, y) {
            var result = 0,
                noise,
                f = 1,
                oct = this._octaves,
                amp = 0.5,
                fallout = this._fallout,
                i;

            for (i = 0; i < oct; ++i) {
                result += (1 + this.noise2d(x * f, y * f)) * amp * 0.5;
                amp *= fallout;
                f *= 2;
            }

            return result;
        },

        noise2d: function (x, y) {
            var X = floor(x),
                Y = floor(y),
                perm = this._perm;

            x = x - X;
            y = y - Y;

            X = X & 255;
            Y = Y & 255;


            var gi00 = perm[X + perm[Y]] % 12,
                gi01 = perm[X + perm[Y + 1]] % 12,
                gi10 = perm[X + 1 + perm[Y]] % 12,
                gi11 = perm[X + 1 + perm[Y + 1]] % 12,

                n00 = dot2d(GRAD3[gi00], x, y),
                n10 = dot2d(GRAD3[gi10], x - 1, y),
                n01 = dot2d(GRAD3[gi01], x, y - 1),
                n11 = dot2d(GRAD3[gi11], x - 1, y - 1),

                u = fade(x),
                v = fade(y),

                nx0 = mix(n00, n10, u),
                nx1 = mix(n01, n11, u),

                nxy = mix(nx0, nx1, v);

            return nxy;
        }
    };


    /**
     * SimplexNoise
     *
     * @super ClassicNoise
     */
    function SimplexNoise(seed) {
        this.seed(seed);
    }

    SimplexNoise.prototype = object.extend({}, ClassicNoise.prototype, {
        noise: function (x, y, z, w) {
            var result = 0,
                noise,
                f = 1,
                oct = this._octaves,
                amp = 0.5,
                fallout = this._fallout,
                i;

            for (i = 0; i < oct; ++i) {
                result += (1 + this.noise2d(x * f, y * f)) * amp * 0.5;
                amp *= fallout;
                f *= 2;
            }

            return result;
        },

        noise2d: function (x, y) {
            var n0,
                n1,
                n2,

                F2 = 0.5 * (sqrt_of_3 - 1),
                s = (x + y) * F2,
                i = floor(x + s),
                j = floor(y + s),

                G2 = (3 - sqrt_of_3) / 6,
                t = (i + j) * G2,
                X0 = i - t,
                Y0 = j - t,
                x0 = x - X0,
                y0 = y - Y0,

                i1,
                j1,

                perm = this._perm;

            if (x0 > y0) {
                i1 = 1;
                j1 = 0;
            } else {
                i1 = 0;
                j1 = 1;
            }

            var x1 = x0 - i1 + G2,
                y1 = y0 - j1 + G2,

                x2 = x0 - 1 + 2 * G2,
                y2 = y0 - 1 + 2 * G2,

                ii = i & 255,
                jj = j & 255,

                gi0 = perm[ii + perm[jj]] % 12,
                gi1 = perm[ii + i1 + perm[jj + j1]] % 12,
                gi2 = perm[ii + 1 + perm[jj + 1]] % 12,

                t0 = 0.5 - x0 * x0 - y0 * y0;

            if (t0 < 0) {
                n0 = 0;
            } else {
                t0 *= t0;
                n0 = t0 * t0 * dot2d(GRAD3[gi0], x0, y0);
            }

            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) {
                n1 = 0;
            } else {
                t1 *= t1;
                n1 = t1 * t1 * dot2d(GRAD3[gi1], x1, y1);
            }

            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) {
                n2 = 0;
            } else {
                t2 *= t2;
                n2 = t2 * t2 * dot2d(GRAD3[gi2], x2, y2);
            }

            return 70 * (n0 + n1 + n2);
        }
    });

    Noise.GRAD3 = GRAD3;
    Noise.GRAD4 = GRAD4;
    Noise.SIMPLEX = SIMPLEX;

    Noise.createClassic = function (seed) {
        return new ClassicNoise(seed);
    };

    Noise.createSimpleX = function (seed) {
        return new SimplexNoise(seed);
    };


    return Noise;

}());


if ("undefined" === typeof module) {
    window.Noise = exp;
} else {
    module.exports = exp;
}
},{"./xorshift.js":17,"object-enhancements":20}],13:[function(require,module,exports){
var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
    vec2_distance = Vec2.distance,
    max = Math.max,
    min = Math.min,
    aux_vec2_1 = [0, 0],
    aux_vec2_2 = [0, 0],
    a = 0,
    b = 0;
/**
 * Rectangle is an array with [a: Vec2, b: Vec2, normalized: Boolean]
 * @returns {Rectangle}
 */
function create(x1, y1, x2, y2) {
    var out = [[x1, y1], [x2, y2], false];
    normalize(out, out);
    return out;
}
/**
 * @returns {Rectangle}
 */
function fromBB(bb2) {
    return create(bb2[0], bb2[1], bb2[2], bb2[3]);
}
/**
 * @returns {Rectangle}
 */
function zero() {
    return [[0, 0], [0, 0], true];
}
/**
 * @returns {Rectangle}
 */
function clone(rect) {
    return [[rect[0][0], rect[0][1]], [rect[1][0], rect[1][1]], rect[2]];
}
/**
 * @returns {Rectangle}
 */
function copy(out, rect) {
    out[0][0] = rect[0][0];
    out[0][1] = rect[0][1];

    out[1][0] = rect[1][0];
    out[1][1] = rect[1][1];

    out[2] = rect[2];

    return out;
}

/**
 * a -> bottom-left
 * a -> top-right
 * @returns {Rectangle}
 */
function normalize(out, rect, force) {
    force = force || rect[2] === false || false;

    if (!force) {
        copy(out, rect);
        return out;
    }

    a = min(rect[0][0], rect[1][0]);
    b = max(rect[0][0], rect[1][0]);

    out[0][0] = a;
    out[1][0] = b;

    a = min(rect[0][1], rect[1][1]);
    b = max(rect[0][1], rect[1][1]);

    out[0][1] = a;
    out[1][1] = b;

    out[2] = true;

    return out;
}
/**
 * @returns {Vec2}
 */
function center(out_vec2, rect) {
    out_vec2[0] = (rect[0][0] + rect[1][0]) * 0.5;
    out_vec2[1] = (rect[0][1] + rect[1][1]) * 0.5;

    return out_vec2;
}
/**
 * @returns {Rectangle}
 */
function translate(out, rect, vec2) {
    out[0][0] = rect[0][0] + vec2[0];
    out[0][1] = rect[0][1] + vec2[1];

    out[1][0] = rect[1][0] + vec2[0];
    out[1][1] = rect[1][1] + vec2[1];

    return out;
}
/**
 * @returns {Number}
 */
function distance(rect, rect2) {
    center(aux_vec2_1, rect);
    center(aux_vec2_2, rect2);

    return vec2_distance(aux_vec2_2, aux_vec2_1);
}
/**
 * @returns {Number}
 */
function area(rect) {
    a = rect[0][0] - rect[1][0];
    b = rect[0][1] - rect[1][1];
    a *= b;

    return a < 0 ? -a : a; //needed id normalized ?
}

/**
 * @class Rectangle
 */
var Rectangle = {
    fromBB: fromBB,
    create: create,
    zero: zero,
    clone: clone,
    copy: copy,
    normalize: normalize,
    center: center,
    translate: translate,
    distance: distance,
    area: area
};


module.exports = Rectangle;
},{"./vec2.js":16}],14:[function(require,module,exports){
var browser = "undefined" === typeof module,
    Vec2 = browser ? window.Vec2 : require("./vec2.js"),
    within = Vec2.$.within,
    sqrt = Math.sqrt,
    __x,
    __y,
    u = 0;
/**
 * @returns {Segment2}
 */
function create(x1, y1, x2, y2) {
    return [x1, y1, x2, y2];
}
/**
 * @returns {Segment2}
 */
function clone(seg2) {
    return [seg2[0], seg2[1], seg2[2], seg2[3]];
}
/**
 * @returns {Segment2}
 */
function copy(out, seg2) {
    out[0] = seg2[0];
    out[1] = seg2[1];
    out[2] = seg2[2];
    out[3] = seg2[3];

    return out;
}
/**
 * @returns {Segment2}
 */
function translate(out, seg2, vec2) {
    out[0] = seg2[0] + vec2[0];
    out[1] = seg2[1] + vec2[1];
    out[2] = seg2[2] + vec2[0];
    out[3] = seg2[3] + vec2[1];

    return out;
}
/**
 * @returns {Number}
 */
function length(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return sqrt(__x * __x + __y * __y);
}
/**
 * @returns {Number}
 */
function sqrLength(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return __x * __x + __y * __y;
}


/**
 * @returns {Number}
 */
function cross(seg2, vec2) {
    return (seg2[0] - vec2[0]) * (seg2[3] - vec2[1]) - (seg2[1] - vec2[1]) * (seg2[2] - vec2[0]);
}
/**
 * @returns {Boolean}
 */
function collinear(seg2, vec2) {
    return (seg2[2] - seg2[0]) * (vec2[1] - vec2[1]) === (vec2[0] - seg2[0]) * (seg2[3] - seg2[1]);
}

/**
 * @returns {Boolean}
 */
function inside(seg2, vec2) {
    return collinear(seg2, vec2) && Vec2.within([seg2[0], seg2[1]], vec2, [seg2[2], seg2[3]]);
}
/**
 * @returns {Vec2}
 */
function closestPoint(out_vec2, seg2, vec2) {
    return $closestPoint(out_vec2, seg2[0], seg2[1], seg2[2], seg2[3], vec2[0], vec2[1]);
}

/**
 * @returns {Vec2}
 */
function $closestPoint(out_vec2, x1, y1, x2, y2, x3, y3) {
    __x = x2 - x1;
    __y = y2 - y1;

    u = ((x3 - x1) * __x + (y3 - y1) * __y) / (__x * __x + __y * __y);

    if (u > 1) {
        u = 1;
    } else if (u < 0) {
        u = 0;
    }

    out_vec2[0] = (x1 + u * __x);
    out_vec2[1] = (y1 + u * __y);

    return out_vec2;
}

/**
 * @returns {Boolean}
 */
function $collinear(x1, y1, x2, y2, x3, y3) {
    return (x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1);
}
/**
 * @returns {Boolean}
 */
function $inside(x1, x2, y1, y2, x3, y3) {
    return $collinear(x1, x2, y1, y2, x3, y3) && within(x1, x2, x3, y3, y1, y2);
}

/**
 * @class Segment2
 */
var Segment2 =  {
    create: create,
    clone: clone,
    copy: copy,
    translate: translate,
    length: length,
    sqrLength: sqrLength,
    cross: cross,
    collinear: collinear,
    closestPoint: closestPoint,
    inside: inside,
    $: {
        inside: $inside,
        collinear: $collinear,
        closestPoint: $closestPoint
    },
};


module.exports = Segment2;
},{"./vec2.js":16}],15:[function(require,module,exports){
var exp;
(exp = function () {
    "use strict";

    var array = require("array-enhancements");

    var pow = Math.pow,
        sin = Math.sin,
        acos = Math.acos,
        cos = Math.cos,
        PI = Math.PI,
        t = {
            Pow: function (p, x) {
                return pow(p, (x && x[0]) || 6);
            },
            Expo: function (p) {
                return pow(2, 8 * (p - 1));
            },
            Circ: function (p) {
                return 1 - sin(acos(p));
            },
            Sine: function (p) {
                return 1 - cos(p * PI / 2);
            },
            Back: function (p, x) {
                x = (x && x[0]) || 1.618;
                return pow(p, 2) * ((x + 1) * p - x);
            },
            Bounce: function (p) {
                var value, a, b;
                for (a = 0, b = 1; true; a += b, b /= 2) {
                    if (p >= (7 - 4 * a) / 11) {
                        value = b * b - pow((11 - 6 * a - 11 * p) / 4, 2);
                        break;
                    }
                }
                return value;
            },
            Elastic: function (p, x) {
                return pow(2, 10 * --p) * cos(20 * p * PI * ((x && x[0]) || 1) / 3);
            }
        },
        k,
        Transitions = {},
        CHAIN = 1,
        STOP = 2,
        IGNORE = 3,
        CANCEL = 4;

    Transitions.linear = function (zero) {
        return zero;
    };

    Transitions.create = function (name, transition) {

        Transitions[name] = function (pos) {
            return transition(pos);
        };

        Transitions[name + "In"] = Transitions[name];

        Transitions[name + "Out"] = function (pos) {
            return 1 - transition(1 - pos);
        };

        Transitions[name + "InOut"] = function (pos) {
            return (pos <= 0.5 ? transition(2 * pos) : (2 - transition(2 * (1 - pos)))) / 2;
        };

    };

    for (k in t) {
        Transitions.create(k, t[k]);
    }

    ['Quad', 'Cubic', 'Quart', 'Quint'].forEach(function (transition, i) {
        Transitions.create(transition, function (p) {
            return pow(p, i + 2);
        });
    });

    // tween function

    function def_render(obj, prop, value) {
        obj[prop] = value;
    }

    function def_parser(obj, prop) {
        return parseFloat(obj[prop]);
    }

    function def_factor(k0, k1, rfactor) {
        return ((k1 - k0) * rfactor) + k0;
    }

    Transitions.LINK = {};
    Transitions.LINK.CHAIN  = CHAIN;
    Transitions.LINK.STOP   = STOP;
    Transitions.LINK.IGNORE = IGNORE;
    Transitions.LINK.CANCEL = CANCEL;

    function normalize(obj, input) {
        //get all props

        var keys = Object.keys(input).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }),
            kk,
            i,
            j,
            prop,
            key,
            fkey,
            prop_list = [],
            props = {},
            last;

        for (i = 0; i < keys.length; ++i) {
            prop_list = array.add(prop_list, Object.keys(input[keys[i]]));
        }
        prop_list = array.unique(prop_list);

        for (j = 0; j < prop_list.length; ++j) {
            prop = prop_list[j];
            props[prop] = {};

            for (i = 0; i < keys.length; ++i) {
                key = keys[i];

                fkey = parseFloat(keys[i]);

                // first of the sorted list and is not 0%
                // set current value
                if (i === 0 && key !== "0%") {
                    props[prop][0] = obj[prop];
                }

                if (input[key][prop] !== undefined) {
                    props[prop][fkey] = last = input[key][prop];
                }
            }

            // check that has 100% if not set the last known value
            if (props[prop]["100"] === undefined) {
                props[prop][100] = last;
            }

        }

        return props;
    }

    /**
     * Animate object properties.
     *
     * @param {Object} obj must be writable or at least have defined $__tween
     * @param {String} prop property name to animate
     * @param {Object} values keys are numbers from 0 to 100, values could be anything
     * @param {Object} options defined as
     *   * mandatory
     *     time: <number> in ms
     *   * optional
     *     transition: Transition.XXX, or a valid compatible function Default: linear
     *     link: Transisition.LINK.XXX Default: CHAIN
     *     render: function(obj, property, new_value) {}
     *     parser: function(obj, property) { return <value>; }
     *     tickEvent: <string> event name Default: "tick"
     *     endEvent: <string> event name Default: "animation:end"
     *     startEvent: <string> event name Default: "animation:star"
     *     chainEvent: <string> event name Default: "animation:chain"
     *
     */
    Transitions.animate = function (obj, prop, values, ioptions) {
        // lazy init
        obj.$__tween = obj.$__tween || {};

        //console.log("options", JSON.stringify(options), JSON.stringify(values));
        // <debug>
        if ("function" !== typeof obj.on) {
            throw new Error("obj must be an event-emitter");
        }
        if ("function" !== typeof obj.removeListener) {
            throw new Error("obj must be an event-emitter");
        }
        if ("number" !== typeof ioptions.time) {
            throw new Error("options.time is mandatory");
        }
        // </debug>

            //soft clone and defaults
        var options = {
                render: ioptions.render || def_render,
                parser: ioptions.parser || def_parser,
                applyFactor: ioptions.applyFactor || def_factor,
                transition: ioptions.transition || Transitions.linear,
                link: ioptions.link || CHAIN,
                tickEvent: ioptions.tickEvent || "tick",
                endEvent: ioptions.endEvent || "animation:end",
                startEvent: ioptions.startEvent || "animation:start", // first emit
                chainEvent: ioptions.chainEvent || "animation:chain",
                time: ioptions.time,
                start: Date.now(),
                current: 0
            },
            chain_fn,
            kvalues = Object.keys(values),
            fvalues = kvalues.map(function (val) { return parseFloat(val) * 0.01; }),
            update_fn;

        //console.log("options", JSON.stringify(options), JSON.stringify(values));

        update_fn = function (delta) {
            //console.log(prop, "tween @", delta, options, values);
            if (!delta) {
                throw new Error("trace");
            }
            options.current += delta;



            var factor = options.current / options.time,
                tr_factor,
                i,
                found = false,
                max = kvalues.length,
                k0,
                k1,
                rfactor;

            //clamp
            if (factor > 1) { // end
                factor = 1;
                tr_factor = 1;
            } else {
                tr_factor = options.transition(factor);
            }

            for (i = 0; i < max && !found; ++i) {
                k0 = fvalues[i];
                if (k0 <= tr_factor) {
                    if (i === max - 1) {
                        // last element
                        found = true;
                        k0 = fvalues[i - 1];
                        k1 = fvalues[i];
                    } else {
                        k1 = fvalues[i + 1];

                        if (k1 > tr_factor) {
                            found = true;
                        }
                    }


                    if (found === true) {
                        //console.log(prop, "ko", k0, "k1", k1);
                        //console.log(prop, tr_factor);

                        if (tr_factor === 1) {
                            options.render(obj, prop, values["100"]);

                            // this is the end, my only friend, the end...
                            obj.removeListener(options.tickEvent, obj.$__tween[prop]);
                            delete obj.$__tween[prop];
                            obj.emit(options.endEvent, options);
                        } else {
                            rfactor = (tr_factor - k0) / (k1 - k0);
                            //console.log(prop, i, rfactor);

                            //console.log(prop, rfactor, "k0", values[k0], "k1", values[k1]);

                            options.render(obj, prop,
                                options.applyFactor(values[kvalues[i]], values[kvalues[i + 1]], rfactor)
                                );
                        }
                    }
                }
            }
        };

        if (obj.$__tween[prop]) {
            // link will told us what to do!
            switch (options.link) {
            case IGNORE:
                return IGNORE;
            case CHAIN:

                chain_fn = function () {
                    if (!obj.$__tween[prop]) {
                        obj.$__tween[prop] = update_fn;
                        obj.on(options.tickEvent, obj.$__tween[prop]);
                        obj.removeListener(options.endEvent, chain_fn);
                    }
                };

                obj.on(options.endEvent, chain_fn);
                obj.emit(options.chainEvent, options);

                return CHAIN;
            case STOP:
                obj.removeListener(options.tickEvent, obj.$__tween[prop]);
                delete obj.$__tween[prop];

                return STOP;
            case CANCEL:
                obj.removeListener(options.tickEvent, obj.$__tween[prop]);
                delete obj.$__tween[prop];
                // and attach!

                obj.$__tween[prop] = update_fn;
                obj.on(options.tickEvent, obj.$__tween[prop]);
                break;
            }
        } else {
            obj.$__tween[prop] = update_fn;
            obj.on(options.tickEvent, obj.$__tween[prop]);
        }



        return true;
    };

    /**
     *
     */
    Transitions.tween = function (obj, params, options) {
        // <debug>
        if (!params.hasOwnProperty("100%")) {
            throw new Error("100% params must exists");
        }

        if ("function" !== typeof obj.on) {
            throw new Error("obj must be an event-emitter");
        }
        if ("function" !== typeof obj.removeListener) {
            throw new Error("obj must be an event-emitter");
        }
        if ("number" !== typeof options.time) {
            throw new Error("options.time is mandatory");
        }
        // </debug>

        options = options || {};
        // set defaults
        options.render = options.render || def_render;
        options.parser = options.parser || def_parser;
        options.transition = options.transition || Transitions.linear;
        options.link = options.link || CHAIN;
        options.tick = options.tick || "tick";

        // set config
        obj.$__tween = obj.$__tween || {};

        var plist = normalize(obj, params),
            i;

        // animate each property
        for (i in plist) {
            Transitions.animate(obj, i, plist[i], options);
        }

    };


    return Transitions;

}());


if ("undefined" === typeof module) {
    window.Transitions = exp;
} else {
    module.exports = exp;
}
},{"array-enhancements":18}],16:[function(require,module,exports){
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
 * Negate v1 and return it into out
 *
 * @param {Vec2} out
 * @param {Vec2} v1
 * @returns {Vec2}
 */
function perpendicular(out, v1) {
    aux_number1 = v1[0];
    out[0] = -v1[1];
    out[1] = aux_number1;

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
function rperpendicular(out, v1) {
    aux_number1 = v1[0];
    out[0] = v1[1];
    out[1] = -aux_number1;

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
 * Rotates the point by the given angle around an optional center point.
 * The object itself is not modified.
 *
 * Read more about angle units and orientation in the description of the
 * {@link #angle} property.
 * @returns {Vec2}
 */
function rotate(out, v1, radians, center) {
    if (center) {
        subtract(out, v1, center);
    } else {
        copy(out, v1);
    }

    var s = sin(radians),
        c = cos(radians);
    __x = v1[0];
    __y = v1[1];

    out[0] = __x * c - __y * s;
    out[1] = __y * c + __x * s;

    if (center) {
        add(out, out, center);
    }

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
 * Vector dot product.
 * @returns {Number}
 */
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * @returns {Number}
 */
function cross(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
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
 * @returns {Number}
 */
function within(v1, v2, v3) {
    return ((v1[0] <= v2[0] && v2[0] <= v3[0]) || (v3[0] <= v2[0] && v2[0] <= v1[0])) &&
          ((v1[1] <= v2[1] && v2[1] <= v3[1]) || (v3[1] <= v2[1] && v2[1] <= v1[1]));
}

/**
 * Return true if q is between p and r(inclusive)
 * @returns {Number}
 */
function $within(px, py, qx, qy, rx, ry) {
    return ((px <= qx && qx <= rx) || (rx <= qx && qx <= px)) &&
          ((py <= qy && qy <= ry) || (ry <= qy && qy <= py));
}

Vec2 = {
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
    rperpendicular: rperpendicular,
    rerp: rperpendicular,
    rotateCCW: rperpendicular,
    lerp: lerp,
    interpolate: lerp,
    lerpconst: lerpconst,
    slerp: slerp,
    slerpconst: slerpconst,
    forAngle: forAngle,
    project: project,
    rotate: rotate,
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
    max: max,
    min: min,
    abs: abs,
    scaleAndAdd: scaleAndAdd,
    clamp: clamp,
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
    $: {
        within: $within
    }
};

module.exports = Vec2;
},{}],17:[function(require,module,exports){
var exp;
(exp = function () {
    "use strict";

    // from: http://jsdo.it/akm2/fhMC/js
    // don't know the author, if you are contact me.
    // I just lint the code... and adapt it to the lib philosophy

    // Helper

    function mash(data) {
        data = data.toString();
        var n = 0xefc8249d,
            i,
            len,
            h;

        for (i = 0, len = data.length; i < len; i++) {
            n += data.charCodeAt(i);
            h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000;
        }
        return (n >>> 0) * 2.3283064365386963e-10;
    }

    var Xorshift = {};

    /**
     * Random numbers generator
     *
     * @see http://baagoe.com/en/RandomMusings/javascript/
     * @see http://en.wikipedia.org/wiki/Xorshift
     */
    Xorshift.create = function () {
        var self = this,
            seeds = (arguments.length) ? Array.prototype.slice.call(arguments) : [new Date().getTime()],

            x = 123456789,
            y = 362436069,
            z = 521288629,
            w = 88675123,
            v = 886756453,
            i,
            len,
            seed,
            t;

        for (i = 0, len = seeds.length; i < len; i++) {
            seed = seeds[i];
            x ^= mash(seed) * 0x100000000;
            y ^= mash(seed) * 0x100000000;
            z ^= mash(seed) * 0x100000000;
            v ^= mash(seed) * 0x100000000;
            w ^= mash(seed) * 0x100000000;
        }

        return {
            uint32: function () {
                t = (x ^ (x >>> 7)) >>> 0;
                x = y;
                y = z;
                z = w;
                w = v;
                v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
                return ((y + y + 1) * v) >>> 0;
            },

            random: function () {
                return self.uint32() * 2.3283064365386963e-10;
            },

            fract53: function () {
                return self.random() + (self.uint32() & 0x1fffff) * 1.1102230246251565e-16;
            }
        };
    };

    return Xorshift;

}());


if ("undefined" === typeof module) {
    window.Xorshift = exp;
} else {
    module.exports = exp;
}
},{}],18:[function(require,module,exports){
(function () {
    "use strict";

    module.exports = require("./lib/arrays.js");

}());
},{"./lib/arrays.js":19}],19:[function(require,module,exports){
(function () {
    "use strict";

/**
* TODO
* - some mozilla functions use .call but thisp could be "undefined" so -> can be replaced by direct call ?!
*
*/

    var slice = Array.prototype.slice,
        hasOwnProperty = Object.hasOwnProperty,
        __clone,
        __rfilter;

    /**
     * Create an array given any type of argument
     *
     * @param {Mixed} item
     * @returns {Array}
     */
    module.exports.ize = function (item) {
        if (item === null || item === undefined) {
            return [];
        }

        if (item instanceof Array) {
            return item;
        }

        if (hasOwnProperty.call(item, "callee")) {
            return slice.call(item);
        }

        // TODO deal with Iterable objects like Collections!

        return [ item ];
    };

    module.exports.from = Array.ize;

    /**
     * Append any given number of arrays into a new one
     * @todo support any type of arguments
     *
     * @returns Array
    */
    module.exports.add = function () {
        var i,
            j,
            ret = [],
            ar;

        for (i = 0; i < arguments.length; ++i) {
            ar = arguments[i];
            for (j = 0; j < ar.length; ++j) {
                ret.push(ar[j]);
            }
        }

        return ret;
    };
    /**
     * Clone (could be recursive) a dense array
     * Note: only loop arrays not objects
     *
     * @param Array ar
     * @param Boolean deep
     * @returns Array
    */
    module.exports.clone = __clone = function (ar, deep) {
        var i = ar.length,
            clone = new Array(i);
        while (i--) {
            if (deep && ar[i] instanceof Array) {
                clone[i] = __clone(ar[i], true);
            } else {
                clone[i] = ar[i];
            }
        }
        return clone;
    };
    /**
     * Add an element at the specified index
     *
     * @param {Array} ar
     * @param {Mixed} o The object to add
     * @param {int} index The index position the element has to be inserted
     * @return {Boolean} true if o is successfully inserted
     */
    module.exports.insertAt = function (ar, o, index) {
        if (index > -1 && index <= ar.length) {
            ar.splice(index, 0, o);
            return true;
        }
        return false;
    };
    /**
     * Get a random value, the array must be dense
     *
     * @param {Array} arr
     * @returns {Mixed}
     */
    module.exports.random = function (arr) {
        var l = Math.floor(Math.random() * arr.length);
        return arr[l];
    };
    /**
     * Create a new array removing duplicated values
     *
     * @param {Array} arr
     * @returns {Array}
     */
    module.exports.unique = function (arr) {
        var ret = [],
            i;

        for (i = 0; i < arr.length; ++i) {
            if (ret.indexOf(arr[i]) === -1) {
                ret.push(arr[i]);
            }
        }

        return ret;
    };

    /**
     * sort an array (must be dense)
     *
     * @param {Array} arr
     * @returns {Array}
     */
    module.exports.sortObject = function (arr, key) {
        arr.sort(function (a, b) {
            if ("string" === (typeof a[key])) {
                return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
            }
            return a[key] - b[key];
        });

        return arr;
    };
    /**
     * This function shuffles (randomizes the order of the elements in) an array.
     * credits -  http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
     * @note Given array is modified!
     * @param {Array} arr
     * @returns {Array}
     */
    module.exports.shuffle = function (arr) {
        var currentIndex = arr.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle..
        while (0 !== currentIndex) {

            // Pick a remaining element..
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }

        return arr;
    };

    /**
     * Iterates over each value in the array passing them to the callback function.
     * Returns an array with all the callback results
     * @param {Array} arr
     * @param {Function} fun
     * @returns {Array}
     */
    module.exports.rfilter = __rfilter = function (arr, fun /*, thisp */) {
        if (arr === null) {
            throw new TypeError();
        }

        var t = Object(arr),
            len = t.length >>> 0,
            res,
            thisp,
            i,
            val,
            r;

        if ("function" !== typeof fun) {
            throw new TypeError();
        }

        res = [];
        thisp = arguments[1];
        for (i = 0; i < len; i++) {
            if (i in t) {
                val = t[i]; // in case fun mutates this
                r = fun.call(thisp, val, i, t);
                if (r !== undefined) {
                    res.push(r);
                }
            }
        }

        return res;
    };

    module.exports.chunk = function (arr, size, preserve_keys) {
        preserve_keys = preserve_keys || false;

        var i = 0,
            j = 0,
            key,
            val,
            chunks = [[]];

        //while( @list( $key, $value ) = @each( arr ) ) {
        for (key = 0; key < arr.length; ++key) {
            val = arr[key];


            if (chunks[i].length < size) {
                if (preserve_keys) {
                    chunks[i][key] = val;
                    j++;
                } else {
                    chunks[i].push(val);
                }
            } else {
                i++;
                chunks.push([]);

                if (preserve_keys) {
                    chunks[i][key] = val;
                    j++;
                } else {
                    j = 0;
                    chunks[i][j] = val;
                }
            }
        }

        return chunks;
    };
    /**
     * returns the values from a single column of the array-of-objects/arrays, identified by the column_key.
     * Optionally, you may provide an index_key to index the values in the returned array by the values from the index_key column in the input array.
     */
    module.exports.column = function (arr, field) {
        return Array.rfilter(arr, function (x) { return x ? x[field] : undefined; });
    };
    /**
     * Append any number of arrays into the first one
     *
     * @param {Array} dst
     * @returns {Array}
     */
    module.exports.combine = function (dst) {
        var i,
            j,
            ar;

        for (j = 1; j < arguments.length; ++j) {
            ar = arguments[j];

            for (i = 0; i < ar.length; ++i) {
                dst.push(ar[i]);
            }
        }
    };
    /**
     * Counts all the values of an array
     */
    module.exports.countValues = function (arr, ci) {
        ci = ci || false;
        var i,
            counter = {},
            val;

        for (i = 0; i < arr.length; ++i) {
            val = arr[i];
            if (ci && "string" === typeof val) {
                val = val.toLowerCase();
            }

            if (counter[val]) {
                ++counter[val];
            } else {
                counter[val] = 1;
            }
        }

        return counter;
    };
    /**
     * Returns a copy of the array padded to size specified by size with value value. If size is positive then the array is padded on the right, if it"s negative then on the left. If the absolute value of size is less than or equal to the length of the array then no padding takes place
     */
    module.exports.pad = function (arr, size, value) {
        if (Math.abs(size) <= arr.length) {
            return arr;
        }
        var out = [],
            i,
            len;

        if (size > 0) {
            for (i = 0;  i < size; ++i) {
                out[i] = i < arr.length ? arr[i] : value;
            }
        } else {
            size = Math.abs(size);
            len = size - arr.length;
            for (i = 0;  i < size; ++i) {
                out[i] = i < len ? value : arr[i - len];
            }
        }

        return out;
    };
    /**
     * Calculate the product of values in an array
     */
    module.exports.product = function (arr) {
        var sum = 1,
            len = arr.length,
            i;

        for (i = 0; i < len; i++) {
            sum *= parseFloat(arr[i]); // be sure it"s a number..
        }

        return sum;
    };
    /**
     * Picks one or more random entries out of an array, and returns the key (or keys) of the random entries.
     */
    module.exports.rand = function (arr, len) {
        var out = [],
            i;
        len = len || 1;

        for (i = 0; i < len; ++i) {
            out.push(Math.floor(Math.random() * arr.length));
        }

        return out;
    };

    module.exports.dense = function (arr) {
        var out = [];

        arr.forEach(function (val) {
            out.push(val);
        });

        return out;
    };

    module.exports.sum = function (arr) {
        var sum = 0,
            len = arr.length,
            i;

        for (i = 0; i < len; i++) {
            sum += parseFloat(arr[i]); // be sure it"s a number..
        }

        return sum;
    };

    /**
     * Fill an array with values
     */
    module.exports.fill = function (start, count, value) {
        var arr = [],
            len = start + count,
            i;

        for (i = start; i < len; ++i) {
            arr[i] = value;
        }

        return arr;
    };
    /**
     * Return the values from a single column in the input array
     */
    module.exports.column = function (arr, field) {
        return __rfilter(arr, function (x) { return x[field]; });
    };

    /**
     * returns an object with the same values keys given a property of the object
     * @throws if the field is undefined!
     */
    module.exports.kmap = function (arr, field) {
        var ret = {};

        arr.forEach(function (v) {
            if (!v[field]) {
                console.log(v);
                throw new Error("field not found in v");
            }

            ret[v[field]] = v;
        });

        return ret;
    };


    module.exports.oFilter = function (arr, obj) {
        if (!arr) return [];

        var res = [],
            i,
            f,
            j,
            max = arr.length;

        for (i = 0; i < max; ++i) {
            if (arr[i]) {
                f = true;
                for (j in obj) {
                    if (arr[i][j] !== obj[j]) {
                        f = false;
                    }
                }
                if (f) {
                    res.push(arr[i]);
                }
            }
        }

        return res;
    };

    /**
     * Returns the key of the object contained in the array that has the same value in given key.
     * @throws if the field is undefined!
     */
    module.exports.search = function (arr, key, value) {
        if (!arr || !arr.length) {
            return -1;
        }

        var i,
            max = arr.length;

        for (i = 0; i < max; ++i) {
            if (arr[i] && arr[i][key] == value) {
                return i;
            }
        }

        return -1;
    };


    module.exports.mapAsync = function (arr, callback, donecallback, thisArg) {
        if (!arr || !arr.length) {
            return donecallback();
        }

        var i,
            max = arr.length,
            done_count = 0,
            ret = [],
            done = function(value, key) {
                if (ret.length === 0 && key) {
                    ret = {};
                }

                // no first
                key = key || done_count;
                ret[key] = value;


                if (++done_count === max) {
                    donecallback(ret);
                }
            };

        for (i = 0; i < max; ++i) {
            if (thisArg) {
                callback.call(thisArg, arr[i], i, done);
            } else {
                callback(arr[i], i, done);
            }

        }
    };

    module.exports.mapSerial = function (arr, callback, donecallback, thisArg) {
        if (!arr || !arr.length) {
            return donecallback();
        }

        var i = 0,
            max = arr.length,
            ret = [],
            next = function(value, key) {
                // change ret to object if first call has key
                if (i === 1 && key) {
                    ret = {};
                }


                // no first
                if (i !== 0) {
                    key = key || i;
                    ret[key] = value;
                }

                var ci = i,
                    ct = arr[i];

                if (++i > max) {
                    return donecallback(ret);
                }

                if (thisArg) {
                    callback.call(thisArg, ct, ci, next, end);
                } else {
                    callback(ct, ci, next, end);
                }

            },
            end = function(value, key) {
                key = key || i;
                ret[key] = value;

                donecallback(ret);
            };

        next();
    };
}());
},{}],20:[function(require,module,exports){
(function () {
    "use strict";

    module.exports = require("./lib/objects.js");

}());
},{"./lib/objects.js":21}],21:[function(require,module,exports){
(function () {
    "use strict";

    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable("toString"),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length,
        ArrayPush = Array.prototype.push,
        ObjectConstructor = Object.prototype.constructor,
        __typeof,
        __merge,
        __depth,
        __rfilter,
        __debug = true;

    module.exports["typeof"] = __typeof = function (val) {
        if (val === null || val === undefined) {
            return "null";
        }
        // dont deal with undefine...
        if (val === true || val === false) {
            return "boolean";
        }

        var type = typeof val;

        if (type === "object") {
            // for performance, we check if it"s a plain object first
            if (type.constructor === ObjectConstructor) {
                return type;
            }

            if (val.push === ArrayPush && val.length != null) { // != null is ok!
                return "array";
            }
            // for performance, I will keep this insecure
            // if (hasOwnProperty.call(val, "callee")) {
            if (val.hasOwnProperty && val.hasOwnProperty("callee")) {
                return "arguments";
            }
            if (val instanceof Date) {
                return "date";
            }
            if (val instanceof RegExp) {
                return "regexp";
            }

            // this is an instance of something?
        } else if (type === "number" && isNaN(val)) {
            return "null";
        }

        return type;
    };

    //
    // Object
    //

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = function (obj) {
            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.keys called on non-object");
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }

    // define Object.defineProperty if not found, no functionality just a replacement so your code not throw!
    if (!Object.defineProperty) {
        Object.defineProperty = function (obj, name, prop) {
            if (prop.get || prop.set) {
                throw new Error("this is not supported in your js.engine");
            }
            obj[name] = prop.value;
        };
    }


    // define Object.seal if not found, no functionality just a replacement so your code not throw!
    if (!Object.seal) {
        Object.seal = function (obj) {
            return obj;
        };
    }

    module.exports.values = function (obj) {
        if (__debug) {
            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.values called on non-object");
            }
        }

        var result = [],
            prop;

        for (prop in obj) {
            if (!__debug || hasOwnProperty.call(obj, prop)) {
                result.push(obj[prop]);
            }
        }

        return result;
    };


    /**
     * get the keys of an object (or anything iterable for...in) note: remove prototype key
     *
     * @param {Object} object
     * @param {Function} fn
     * @returns {Object} object
     */
    function __each(object, fn) {
        var key = null;

        for (key in object) {
            fn(object[key], key);
        }

        return object;
    }

    module.exports.each = __each;

    module.exports.forEach = __each;

    module.exports.clone = function (obj) {
        return __merge({}, obj, true, false);
    };

    /**
     * merge two object
     *
     *
     * @params {Object} to, this parameter is modified
     * @params {Object} from
     * @params {Boolean} clone
     * @params {Boolean} must_exists do not allow undefined in the objects
     */
    module.exports.merge = __merge = function (to, from, clone, must_exists) {
        //console.log("Object.merge", from);
        clone = clone || false;
        must_exists = must_exists || false;

        var ftype = __typeof(from),
            key,
            ret;

        switch (ftype) {
        case "string":
            return clone ? "" + from : from;
        case "number":
            return clone ? 0 + from : from;
        case "array": // maybe need more deep clone ?

            if (clone) {
                ret = [];
                for (key = 0; key < from.length; ++key) {
                    ret[key] = __merge(to[key] || {}, from[key], clone, must_exists);
                }

                return ret;
            }

            return from;
        case "boolean":
            return clone ? (from ? true : false) : from;
        case "null":
            return null;
        case "function":
            return from;
        case "object":
            // to it not an object, overwrite!
            ret = __typeof(to) !== "object" ? {} : to || {};
            // if has prototype just copy
            key = null;

            for (key in from) {
                if (key !== "prototype") {
                    if (ret[key] === undefined) {
                        if (must_exists) {
                            continue;
                        }
                        ret[key] = {};
                    }
                    ret[key] = __merge(ret[key] || {}, from[key], clone, must_exists);
                }
            }

            return ret;
        case "regexp":
            return new RegExp(from.source);
        case "date":
            return clone ? new Date(from) : from;
        }
        // unknown type... just return
        return from;
    };

    module.exports.combine = function (keys, values) {
        values = values || [];
        var i,
            ret = {};

        for (i = 0; i < keys.length; ++i) {
            ret[keys[i]] = values[i] === undefined ? null : values[i];
        }
        return ret;
    };

    module.exports.ksort = function (from) {
        var keys = Object.keys(from),
            i,
            ret = {};

        for (i = 0; i < keys.length; ++i) {
            ret[keys[i]] = from[keys[i]];
        }

        return ret;
    };

    module.exports.extend = function () {
        var target = arguments[0] || {},
            o,
            p,
            i,
            len;

        for (i = 1, len = arguments.length; i < len; i++) {
            o = arguments[i];

            if ("object" === typeof o && o !== null) {
                for (p in o) {
                    target[p] = o[p];
                }
            }
        }

        return target;
    };

    module.exports.extract = function (from, keys, default_value) {
        var i,
            ret = {};

        default_value = default_value === undefined ? null : default_value;

        for (i = 0; i < keys.length; ++i) {
            ret[keys[i]] = from[keys[i]] === undefined ? default_value : from[keys[i]];
        }

        return ret;
    };

    module.exports.empty = function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };

    module.exports.depth = __depth = function (obj) {
        var i,
            max,
            props = false,
            d = 0;

        if (obj === null || obj === undefined) {
            return 0;
        }

        if (Array.isArray(obj)) {
            // array

            for (i = 0, max = obj.length; i < max; ++i) {
                d = Math.max(d, __depth(obj[i]));
            }
            props = max > 0;
        } else if ("object" === typeof obj) {
            // object

            for (i in obj) {
                props = true;
                d = Math.max(d, __depth(obj[i]));
            }
        }

        return (props ? 1 : 0) + d;
    };

    module.exports.rFilter = __rfilter = function (obj, callback, loop_arrays) {
        var i,
            max;
        loop_arrays = loop_arrays === true;

        if (Array.isArray(obj)) {
            // array
            if (!loop_arrays) {
                obj = callback(obj);
            } else {
                for (i = 0, max = obj.length; i < max; ++i) {
                    obj[i] = __rfilter(obj[i], callback, loop_arrays);
                }
            }

            return obj;
        }

        if ("object" === typeof obj) {
            // object
            if (!(obj instanceof Date || obj instanceof RegExp)) {

                for (i in obj) {
                    obj[i] = __rfilter(obj[i], callback, loop_arrays);
                }
                return obj;
            }
        }

        return callback(obj);
    };

    module.exports.prefixKeys = function (obj, prefix, ignore_keys) {
        ignore_keys = ignore_keys || [];
        var i,
            ret = {};

        if (ignore_keys.length) {
            for (i in obj) {
                if (ignore_keys.indexOf(i) === -1) {
                    ret[prefix + i] = obj[i];
                } else {
                    ret[i] = obj[i];
                }
            }
        } else {
            for (i in obj) {
                ret[prefix + i] = obj[i];
            }
        }

        return ret;
    };

    module.exports.remPrefixKeys = function (obj, prefix, ignore_keys) {
        ignore_keys = ignore_keys || [];
        var i,
            prefix_len = prefix.length,
            ret = {};

        if (ignore_keys.length) {
            for (i in obj) {
                if (ignore_keys.indexOf(i) === -1) {
                    if (i.indexOf(prefix) === 0) {
                        ret[i.substring(prefix_len)] = obj[i];
                    } else {
                        ret[i] = obj[i];
                    }
                } else {
                    ret[i] = obj[i];
                }
            }
        } else {
            for (i in obj) {
                if (i.indexOf(prefix) === 0) {
                    ret[i.substring(prefix_len)] = obj[i];
                } else {
                    ret[i] = obj[i];
                }
            }
        }

        return ret;
    };


    module.exports.diff = function (obj) {
        var ret = {},
            argl = arguments.length,
            k1,
            i,
            found;

        for (k1 in obj) {
            found = false;
            for (i = 1; i < argl && !found; ++i) {
                if (obj[k1] === arguments[i][k1]) {
                    found  = true;
                }
            }

            if (!found) {
                ret[k1] = obj[k1];
            }

        }

        return ret;

    };

}());
},{}]},{},[])