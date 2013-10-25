var exp;
(exp = function () {
    "use strict";

    var browser = "undefined" === typeof module,
        sqrt = Math.sqrt,
        abs = Math.abs,
        min = Math.min,
        Rectangle = browser ? window.Rectangle : require("./rectangle.js"),
        x = 0,
        y = 0,
        Distance;

    Distance = {};

    Distance.fourPoints = function (x1, y1, x2, y2) {
        x = x1 - x2;
        y = y1 - y2;

        return sqrt(x * x + y * y);
    };

    Distance.sqrFourPoints = function (x1, y1, x2, y2) {
        x = x1 - x2;
        y = y1 - y2;

        return x * x + y * y;
    };

    Distance.fourPointsSq = Distance.sqrFourPoints;

    Distance.line2_vec2 = function (line, point) {
        var __x1 = line[0][0],
            __y1 = line[0][1],
            __x2 = line[0][0] + line[1],
            __y2 = line[0][1] + line[1],
            __px = point[0],
            __py = point[1],
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
    };

    Distance.segment2_vec2 = function (segment, v2) {
        var A = v2[0] - segment[0],
            B = v2[1] - segment[1],
            C = segment[2] - segment[0],
            D = segment[3] - segment[1],
            dot = A * C + B * D,
            len_sq = C * C + D * D,
            param = dot / len_sq,
            xx,
            yy;

        if (param < 0) {
            xx = segment[0];
            yy = segment[1];
        } else if (param > 1) {
            xx = segment[2];
            yy = segment[3];
        } else {
            xx = segment[0] + param * C;
            yy = segment[1] + param * D;
        }

        return Distance.four_points(v2[0], v2[1], xx, yy);
    };

    Distance.rectangle_vec2 = function (rect, vec2) {
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
            Distance.segment2_vec2(s1, vec2),
            Distance.segment2_vec2(s2, vec2),
            Distance.segment2_vec2(s3, vec2),
            Distance.segment2_vec2(s4, vec2)
        );
    };

    return Distance;

}());


if ("undefined" === typeof module) {
    window.Distance = exp;
} else {
    module.exports = exp;
}