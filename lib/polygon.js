var Vec2 = require("./vec2.js"),
    vec2_add = Vec2.add,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,
    vec2_cross = Vec2.cross,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,

    Matrix23 = require("./matrix23.js"),

    Beizer = require("./beizer.js"),
    beizer_getPoints = Beizer.getPoints,
    f,
    sum = 0,
    cross = 0,
    len = 0,
    i = 0,
    x,
    y,
    o,
    p,
    sqrt = Math.sqrt,
    cos = Math.cos,
    sin = Math.sin,
    EPS = Math.EPS;
/**
 * input are many Vec2(s)
 * @returns {Polygon}
 */
function create() {
    var i,
        max = arguments.length,
        out = new Array(max);

    for (i = 0; i < max; ++i) {
        out[i] = arguments[i];
    }

    return out;
}
function fromAABB(aabb2) {
    var out = new Array(4);
    out[0] = [aabb2[0], aabb2[1]];
    out[1] = [aabb2[0], aabb2[3]];
    out[2] = [aabb2[2], aabb2[3]];
    out[3] = [aabb2[2], aabb2[1]];

    return out;
}
function fromRectangle(rect) {
    var out = new Array(4);
    out[0] = [rect[0][0], rect[0][1]];
    out[1] = [rect[0][0], rect[1][1]];
    out[2] = [rect[1][0], rect[1][1]];
    out[3] = [rect[1][0], rect[0][1]];

    return out;
}

function fromBeizer(curve, npoints) {
    return beizer_getPoints(curve, npoints);
}

function translate(out, poly, vec2) {
    len = poly.length - 1;
    x = vec2[0];
    y = vec2[1];

    do {
        p = poly[len];
        o = out[len] = out[len] || [0, 0];
        o[0] = p[0] + x;
        o[1] = p[1] + y;
    } while (len--);

    return out;
}
var cfactor,
    sfactor;

function rotate(out, poly, radians) {
    len = poly.length - 1;

    cfactor = cos(radians);
    sfactor = sin(radians);

    do {
        p = poly[len];
        o = out[len] = out[len] || [0, 0];
        x = p[0];
        y = p[1];

        o[0] = x * cfactor - y * sfactor;
        o[1] = x * sfactor + y * cfactor;
    } while (len--);

    return out;
}

var c_aux = [0, 0],
    c_aux2 = [0, 0];
/**
 * @returns {Vec2}
 */
function centroid(out_vec2, poly) {
    sum = 0;
    out_vec2[0] = 0;
    out_vec2[1] = 1;

    for (i = 0, len = poly.length; i < len; ++i) {
        c_aux[0] = poly[i][0];
        c_aux[1] = poly[i][1];
        f = (i === len) ? 0 : i;
        c_aux2[0] = poly[f][0];
        c_aux2[0] = poly[f][1];

        cross = vec2_cross(c_aux, c_aux2);

        sum += cross;
        vec2_add(c_aux, c_aux, c_aux2);
        vec2_scale(c_aux, c_aux, cross);
        vec2_add(out_vec2, out_vec2, c_aux);
    }

    return vec2_scale(out_vec2, 1 / (3 * sum));
}
var vec2_centroid = [0, 0];
/**
 * @returns {Polygon}
 */
function recenter(out, poly) {
    centroid(vec2_centroid, poly);
    var x = vec2_centroid[0],
        y = vec2_centroid[1];

    for (i = 0, len = poly.length; i < len; ++i) {
        out[i] = out[i] || [0, 0]; // create if needed...
        out[i][0] += x;
        out[i][1] += y;
    }
}
/**
* @TODO review, this doesn't seems to be right!
* Get the circumeter of polygon
* @param {Complex[]} p The polygon
function circumcenter(out, poly) {
    var circ = 0, i = 1;
    for (; i < poly.length; i++) {
      var dx = poly[i].x - poly[i - 1].x;
      var dy = poly[i].y - poly[i - 1].y;
      circ += sqrt(dx * dx + dy * dy);
    }
    return circ;
},
*/
/**
 * @returns {Number}
 */
function area(poly) {
    var value = 0;

    for (i = 0, len = poly.length; i < len; ++i) {
        f = (i === len) ? 0 : i;
        value -= (poly[i][0] * poly[f][0]) - (poly[i][1] * poly[f][1]);
    }

    return value * 0.5;
}


function transform(out, poly, m2d) {
    for (i = 0, len = poly.length; i < len; ++i) {
        Matrix23.transform(out[i] = out[i] || [], m2d, poly[i]);
    }

    return out;
}



function isVec2Inside(poly, vec2) {
    var i,
        j,
        nvert = poly.length,
        c = false;

    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if ((poly[i][1] >= vec2[1]) !== (poly[j][1] >= vec2[1]) &&
            (vec2[0] <= (poly[j][0] - poly[i][0]) * (vec2[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
        ) {
            c = !c;
        }
    }

    return c;
}


/**
 * @class Polygon
 */
var Polygon = {
    create: create,
    fromAABB: fromAABB,
    fromRectangle: fromRectangle,
    fromBeizer: fromBeizer,
    translate: translate,
    rotate: rotate,
    centroid: centroid,
    recenter: recenter,
    //circumcenter: circumcenter,
    area: area,
    transform: transform,
    isVec2Inside: isVec2Inside,

    furthestPoint: furthestPoint,
    furthestMinkowski: furthestMinkowski,
    containsOrigin: containsOrigin,
    GJK: GJK,
    EPA: EPA,
};

module.exports = Polygon;