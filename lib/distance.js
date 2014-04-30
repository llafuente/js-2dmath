var sqrt = Math.sqrt,
    abs = Math.abs,
    min = Math.min,
    Rectangle = require("./rectangle.js"),
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
/*
 * Figure 26.1
 * http://pomax.github.io/bezierinfo/
 * @todo
 */

function beizer_vec2() {

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