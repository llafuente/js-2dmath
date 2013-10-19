var exp;
(exp = function () {
    "use strict";


    var browser = "undefined" === typeof module,
        Rectangle = browser ? window.Rectangle : require("./rectangle.js"),
        Distance = browser ? window.Distance : require("./distance.js"),
        Vec2 = browser ? window.Vec2 : require("./vec2.js"),
        abs = Math.abs,
        sqrt = Math.sqrt,
        EPS = Math.EPS,
        Intersection,
        aux_vec2 = [0, 0];

    function near(value, cvalue) {
        return value > cvalue - EPS && value < cvalue + EPS;
    }


    Intersection = {
        COLLIDE: 1,
        INSIDE: 2,
        OUTSIDE: 3,
        COINCIDENT: 4,
        PARALLEL: 5,
        TANGENT: 6
    };

    Intersection.bb2_bb2 = function (bb1, bb2) {

        if (bb1[0] <= bb2[0] && bb1[2] >= bb2[2] && bb1[1] <= bb2[1] && bb1[3] >= bb2[3]) {
            return {success : false, reason: Intersection.INSIDE};
        }

        if (bb1[0] <= bb2[2] && bb2[0] <= bb1[2] && bb1[1] <= bb2[3] && bb2[1] <= bb1[3]) {
            return {success : true, reason: Intersection.COLLIDE, points : [], lines : []};
        }

        return {success : false, reason: Intersection.OUTSIDE};
    };

    Intersection.bb2_vec2 = function (bb, vec2) {

        if (bb[0] > vec2[0] && bb[2] < vec2[0] && bb[1] > vec2[1] && bb[3] < vec2[1]) {
            return {success : false, reason: Intersection.OUTSIDE};
        }

        //if (bb[0] <= v[0] && bb[2] >= v[0] && bb[1] <= v[1] && bb[3] >= v[1]);
        if (bb[0] < vec2[0] && bb[2] > vec2[0] && bb[1] < vec2[1] && bb[3] > vec2[1]) {
            return {success : false, reason: Intersection.INSIDE};
        }

        return {success : true, reason: Intersection.COLLIDE, points : [vec2]};
    };


    /**
     * TODO calc points / lines of collision
     */
    Intersection.rectangle_rectangle = function (rectangle_1, rectangle_2, points, distance) {
        points = points === true;
        distance = distance === true;

        var aux,
            outside,
            inside,
            rect1,
            rect2;

        Rectangle.normalize(rectangle_1, rectangle_1);
        Rectangle.normalize(rectangle_2, rectangle_2);


        // r1 should be further left!
        if (rectangle_2[0][0] < rectangle_1[0][0]) {
            rect1 = rectangle_2;
            rect2 = rectangle_1;
        } else {
            rect1 = rectangle_1;
            rect2 = rectangle_2;
        }

        if (
            rect1[0][0] > rect2[1][0] ||
            rect1[1][0] < rect2[0][0] ||
            rect1[0][1] < rect2[1][1] ||
            rect1[1][1] > rect2[0][1]
        ) {
            return {success : false, reason : Intersection.OUTSIDE};
        }

        if (
            rect1[0][0] < rect2[0][0] && // top left
            rect1[0][1] > rect2[0][1] &&
            rect1[1][0] > rect2[1][0] && // bottom right
            rect1[1][1] < rect2[1][1]
        ) {
            return {success : false, reason : Intersection.INSIDE};
        }

        return {success : true, reason: Intersection.COLLIDE, points : [], lines : []};
    };


    /**
     *
     */
    Intersection.rectangle_vec2 = function (rectangle, vec2, points, distance) {
        points = points === true;
        distance = distance === true;

        Rectangle.normalize(rectangle, rectangle);

        if (
            vec2[0] < rectangle[0][0]
                ||
            vec2[0] > rectangle[1][0]
                ||
            vec2[1] > rectangle[0][1]
                ||
            vec2[1] < rectangle[1][1]
        ) {
            return {success: false, reason: Intersection.OUTSIDE, distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null};
        }

        if (
            vec2[0] > rectangle[0][0]
                &&
            vec2[0] < rectangle[1][0]
                &&
            vec2[1] < rectangle[0][1]
                &&
            vec2[1] > rectangle[1][1]
        ) {
            return {success: false, reason: Intersection.INSIDE, distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null};
        }

        return {success: true, reason: Intersection.COLLIDE, points: [vec2], distance: 0};
    };
    /**
     *
     */
    Intersection.circle_vec2 = function (circle, vec2, points, distance) {
        points = points === true;
        distance = distance === true;

        var distance_to_center = abs(Vec2.distance(circle[0], vec2));

        if (near(distance_to_center, circle[1])) {
            return {success: true, reason: Intersection.COLLIDE, points: [vec2]};
        }

        if (distance_to_center < circle[1]) {
            return {success: false, reason: Intersection.INSIDE, distance: abs(distance_to_center - circle[1])};
        }
        return {success: false, reason: Intersection.OUTSIDE, distance: abs(distance_to_center - circle[1])};
    };
    /**
     *
     */
    Intersection.circle_circle = function (acircle, bcircle, points, distance) {
        points = points === true;
        distance = distance === true;

        var result,
            c1 = acircle[0],
            c2 = bcircle[0],
            r1 = acircle[1],
            r2 = bcircle[1],
            // Determine minimum and maximum radius where circles can intersect
            r_max = r1 + r2,
            r_min = abs(r1 - r2),
            // Determine actual distance between circle circles
            c_dist = Vec2.distanceSq(c1, c2),
            a,
            h,
            p,
            b,
            ret_points,
            r1sq,
            z;

        if (c_dist > r_max * r_max) {
            return { success: false, reason: Intersection.OUTSIDE};
        }

        if (c_dist < r_min) {
            return { success: false, reason: Intersection.INSIDE};
        }

        ret_points = [];

        if (ret_points) {
            r1sq = r1 * r1;
            a = (r1sq - r2 * r2 + c_dist * c_dist) / (2 * c_dist);
            z = r1sq - a * a;
            h = sqrt(z > 0 ? z : -z);

            Vec2.lerp(aux_vec2, c1, c2, a / c_dist);

            b = h / c_dist;

            ret_points.push([aux_vec2[0] - b * (c2[1] - c1[1]), aux_vec2[1] + b * (c2[0] - c1[0])]);
            ret_points.push([aux_vec2[0] + b * (c2[1] - c1[1]), aux_vec2[1] - b * (c2[0] - c1[0])]);
        }

        return { success: true, reason: Intersection.COLLIDE, points: ret_points};
    };

    /**
     * @todo inside, outside: test center vs rectangle
    Intersection.circle_rectangle = function (circle, rectangle) {
        Rectangle.normalize(rectangle, rectangle);

        var min        = rectangle[0],
            max        = rectangle[1],
            topRight   = [max[0], min[1]],
            bottomLeft = [min[0], max[1]],
            inter1 = Math.intersection_circle_vs_line2(circle.c, circle.r, min, topRight),
            inter2 = Math.intersection_circle_vs_line2(circle.c, circle.r, topRight, max),
            inter3 = Math.intersection_circle_vs_line2(circle.c, circle.r, max, bottomLeft),
            inter4 = Math.intersection_circle_vs_line2(circle.c, circle.r, bottomLeft, min),
            result = {success: true, points: []};

        if (inter1.success) {
            result.points.append(inter1.points);
        }
        if (inter2.success) {
            result.points.append(inter2.points);
        }
        if (inter3.success) {
            result.points.append(inter3.points);
        }
        if (inter4.success) {
            result.points.append(inter4.points);
        }
        if (result.points.length === 0) {
            return {success: false, reason: "unkown"};
        }

        return result;
    };
    */

    Intersection.circle_segment2 = function (circle, segment2) {
        var c = circle[0],
            a1x = segment2[0],
            a1y = segment2[1],
            a2x = segment2[2],
            a2y = segment2[3],
            result,
            a  = (a2x - a1x) * (a2x - a1x) +
                 (a2y - a1y) * (a2y - a1y),
            b  = 2 * ((a2x - a1x) * (a1x - c.x) +
                       (a2y - a1y) * (a1y - c.y)),
            cc = c.x * c.x + c.y * c.y + a1x * a1x + a1y * a1y -
                 2 * (c.x * a1x + c.y * a1y) - circle.r * circle.r,
            deter = b * b - 4 * a * cc,
            e,
            u1,
            u2;

        if (deter < 0) {
            result = { success: false, reason: Intersection.OUTSIDE};
        } else if (deter === 0) {
            result = { success: false, reason: Intersection.TANGENT};
            // NOTE: should calculate this point
        } else {
            e  = Math.sqrt(deter);
            u1 = (-b + e) / (2 * a);
            u2 = (-b - e) / (2 * a);

            if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
                if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
                    result = { success: false, reason: Intersection.OUTSIDE};
                } else {
                    result = { success: false, reason: Intersection.INSIDE};
                }
            } else {
                result = { success: true, reason: Intersection.COLLIDE, points: []};

                if (0 <= u1 && u1 <= 1) {
                    result.points.push(Vec2.lerp([], [a1x, a1y], [a2x, a2y], u1));
                }

                if (0 <= u2 && u2 <= 1) {
                    result.points.push(Vec2.lerp([], [a1x, a1y], [a2x, a2y], u2));
                }
            }
        }

        return result;
    };

    Intersection.line2_line2 =  function (aline, bline, points, distance) {
        points = points === true;
        distance = distance === true;

        var a1 = [aline[0][0], aline[0][1]],
            a2 = [0, 0], // XXX check! m,1 ??
            b1 = [bline[0][0], bline[0][1]],
            b2 = [0, 0],
            ua_t,
            ub_t,
            u_b,
            ua,
            ub;

        Vec2.add(a2, a1, [aline[1], 1]);
        Vec2.add(b2, b1, [bline[1], 1]);

        ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
        ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
        u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

        if (u_b !== 0) {
            ua = ua_t / u_b;
            ub = ub_t / u_b;

            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                return {success: true, reason: Intersection.COLLIDE, points: points ? [[a1[0] + ua * (a2[0] - a1[0]), a1[1] + ua * (a2[1] - a1[1])]] : null};
            }
            return {success: false, reason: Intersection.OUTSIDE};
        }
        if (ua_t === 0 || ub_t === 0) {
            return {success: false, reason: Intersection.COINCIDENT};
        }
        return {success: false, reason: Intersection.PARALLEL};
    };

    Intersection.segment2_segment2 = function (asegment, bsegment) {
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

        denom  = (bsegment[3] - bsegment[1]) * (asegment[2] - asegment[0]) - (bsegment[2] - bsegment[0]) * (asegment[3] - asegment[1]);
        numera = (bsegment[2] - bsegment[0]) * (asegment[1] - bsegment[1]) - (bsegment[3] - bsegment[1]) * (asegment[0] - bsegment[0]);
        numerb = (asegment[2] - asegment[0]) * (asegment[1] - bsegment[1]) - (asegment[3] - asegment[1]) * (asegment[0] - bsegment[0]);

        /* Are the line coincident? */
        if (Math.abs(numera) < Math.EPS && Math.abs(numerb) < Math.EPS && Math.abs(denom) < Math.EPS) {
            // check if the intersections is a line!
            points = [];
            points.push(Intersection.segment2_vec2(bsegment, new Vec2(asegment[0], asegment[1])));
            points.push(Intersection.segment2_vec2(bsegment, new Vec2(asegment[2], asegment[3])));
            points.push(Intersection.segment2_vec2(asegment, new Vec2(bsegment[0], bsegment[1])));
            points.push(Intersection.segment2_vec2(asegment, new Vec2(bsegment[2], bsegment[3])));
            // now check those intersections, remove no intersections!
            max = points.length;
            minp = { distance: false, point: null};
            maxp = { distance: false, point: null};


            for (i = 0; i < max; ++i) {
                if (points[i].success === false) {
                    points.splice(i, 1);
                    --i;
                    max = points.length;
                } else {

                    dist = Vec2.lengthSquared(points[i].points[0]);

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
                    success : true,
                    reason : Intersection.COLLIDE,
                    points: [],
                    segments: [minp.point[0], minp.point[1], maxp.point[0], maxp.point[1]]
                };
            }

            return {
                success : false,
                reason : Intersection.COINCIDENT
            };
        }

        /* Are the line parallel */
        if (Math.abs(denom) < Math.EPS) {
            return {success: false, reason: Intersection.PARALLEL};
        }

        /* Is the intersection along the the segments */
        mua = numera / denom;
        mub = numerb / denom;
        if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
            return {success: false, reason: Intersection.OUTSIDE};
        }

        return {success: true, reason: Intersection.COLLIDE, points: [[asegment[0] + mua * (asegment[2] - asegment[0]), asegment[1] + mua * (asegment[3] - asegment[1])]]};
    };

    Intersection.segment2_vec2 = function (seg, vec) {
        var dis = Distance.segment2_vec2(seg, vec);

        if (dis === 0) {
            return {
                success : true,
                reason : Intersection.COLLIDE,
                points: [vec]
            };
        }

        return {
            success : false,
            reason : Intersection.OUTSIDE,
            distance: dis
        };
    };


    return Intersection;
}());


if ("undefined" === typeof module) {
    window.Intersection = exp;
} else {
    module.exports = exp;
}