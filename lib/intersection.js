var exp;
(exp = function () {
    "use strict";


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
        Intersection,
        aux_vec2 = [0, 0],

        //cache
        OUTSIDE = 1,
        INSIDE = 2,
        PARALLEL = 1,
        COLLIDE = 4,
        COINCIDENT = 5,
        TANGENT = 6;

    function near(value, cvalue) {
        return value > cvalue - EPS && value < cvalue + EPS;
    }


    Intersection = {
        OUTSIDE: 1,
        INSIDE: 2,
        PARALLEL: 1,
        COLLIDE: 4,
        COINCIDENT: 5,
        TANGENT: 6
    };

    //
    // helpers
    //

    // x1 < x3
    // TODO segment collision, maybe using segment-segment collision, this could slow down things!
    // TODO distance
    function rectangle_rectangle(x1, y1, x2, y2, x3, y3, x4, y4, collision, distance) {
        var points,
            x_inside,
            y_inside;

        if (x1 > x4 || x2 < x3 || y1 < y4 || y2 > y3) {
            return {success : false, reason : OUTSIDE};
        }

        x_inside = x1 < x3 && x2 > x4;
        y_inside = y1 > y3 && y2 < y4;

        if (x_inside && y_inside) {
            return {success : false, reason : INSIDE};
        }

        if (collision === false) {
            return {success : true, reason: COLLIDE};
        }

        //base case
        points = [
            [max(x1, x3), min(y1, y3)],
            [min(x2, x4), max(y2, y4)]
        ];

        // complex cases, 4 point collision

        if (x_inside || y_inside) {
            points.push([min(x2, x4), min(y1, y3)]);
            points.push([max(x1, x3), max(y2, y4)]);
        }

        return {success : true, reason: COLLIDE, points : points};

    }

    function rectangle_vec2(x1, y1, x2, y2, x3, y3, collision, distance) {
        if (x1 > x3 && x2 < x3 && y1 > y3 && y2 < y3) {
            return {success : false, reason: OUTSIDE};
            // TODO distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null
        }

        //if (bb[0] <= v[0] && bb[2] >= v[0] && bb[1] <= v[1] && bb[3] >= v[1]);
        if (x1 < x3 && x2 > x3 && y1 < y3 && y2 > y3) {
            return {success : false, reason: INSIDE};
            // TODO distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null
        }

        return {success : true, reason: COLLIDE, points : [x3, y3]};
    }

    function circle_segment(cx, cy, r, x1, y1, x2, y2, collision, distance) {

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
            return { success: false, reason: OUTSIDE};
        }

        if (delta === 0) {
            // One intersection
            if (collision === false) {
                return { success: true, reason: TANGENT};
            }

            u = -b / (2 * a);

            p = [x1 + (u * dx), y1 + (u * dy)];

            if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
                return { success: true, reason: TANGENT, points: [p]};
            }

            return { success: false, reason: OUTSIDE};


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
                return { success: true, reason: TANGENT, points: points};
            }

            return { success: false, reason: OUTSIDE};
        }

    }

    function circle_rectangle(c1, c2, r, x1, y1, x2, y2, collision, distance) {
        var points = [],
            r2,
            collide = false;

        // TODO inside test

        r2 = circle_segment(c1, c2, r, x1, y1, x2, y1, collision, distance);

        if (r2.reason >= COLLIDE) {
            collide = true;
            if (collision === true) {
                points.push(r2.points[0]);
                if (r2.points.length === 2) {
                    points.push(r2.points[1]);
                }
            }
        }

        r2 = circle_segment(c1, c2, r, x1, y1, x1, y2, collision, distance);

        if (r2.reason >= COLLIDE) {
            collide = true;
            if (collision === true) {
                points.push(r2.points[0]);
                if (r2.points.length === 2) {
                    points.push(r2.points[1]);
                }
            }
        }

        r2 = circle_segment(c1, c2, r, x1, y2, x2, y2, collision, distance);

        if (r2.reason >= COLLIDE) {
            collide = true;
            if (collision === true) {
                points.push(r2.points[0]);
                if (r2.points.length === 2) {
                    points.push(r2.points[1]);
                }
            }
        }

        r2 = circle_segment(c1, c2, r, x2, y1, x2, y2, collision, distance);

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
                return {success: true, reason: COLLIDE};
            }

            return {success: true, reason: COLLIDE, points: points};
        }

        return {success: false, reason: OUTSIDE};
    }

    Intersection.bb2_bb2 = function (bb1, bb2, collision, distance) {
        var _bb1,
            _bb2;

        BB2.normalize(bb1, bb1);
        BB2.normalize(bb2, bb2);

        // x1 should be further left!
        if (bb2[0] < bb1[0]) {
            _bb1 = bb2;
            _bb2 = bb1;
        } else {
            _bb1 = bb1;
            _bb2 = bb2;
        }

        return rectangle_rectangle(
            bb1[0], bb1[1], bb1[2], bb1[3],
            bb2[0], bb2[1], bb2[2], bb2[3],
            collision === true,
            distance === true
        );
    };

    Intersection.bb2_vec2 = function (bb, vec2, collision, distance) {
        return rectangle_vec2(bb[0], bb[1], bb[2], bb[3], vec2[0], vec2[1], collision === true, distance === true);
    };

    /**
     * TODO calc points / lines of collision
     */
    Intersection.rectangle_rectangle = function (rectangle_1, rectangle_2, collision, distance) {
        var rect1,
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

        return rectangle_rectangle(
            rect1[0][0], rect1[0][1], rect1[1][0], rect1[1][1],
            rect2[0][0], rect2[0][1], rect2[1][0], rect2[1][1],
            collision === true,
            distance === true
        );
    };


    /**
     *
     */
    Intersection.rectangle_vec2 = function (rectangle, vec2, collision, distance) {
        return rectangle_vec2(rectangle[0][0], rectangle[0][1], rectangle[1][0], rectangle[1][1], vec2[0], vec2[1], collision === true, distance === true);
    };

    /**
     *
     */
    Intersection.circle_vec2 = function (circle, vec2, collision, distance) {
        collision = collision === true;
        distance = distance === true;

        var distance_to_center = abs(Vec2.distance(circle[0], vec2));

        if (near(distance_to_center, circle[1])) {
            return {success: true, reason: COLLIDE, points: [vec2]};
        }

        if (distance_to_center < circle[1]) {
            return {success: false, reason: INSIDE, distance: abs(distance_to_center - circle[1])};
        }
        return {success: false, reason: OUTSIDE, distance: abs(distance_to_center - circle[1])};
    };
    /**
     *
     */
    Intersection.circle_circle = function (acircle, bcircle, collision, distance) {
        collision = collision === true;
        distance = distance === true;

        var result,
            c1 = acircle[0],
            c2 = bcircle[0],
            r1 = acircle[1],
            r2 = bcircle[1],
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
            p,
            b,
            points,
            z;

        if (c_dist_sq > r_max * r_max) {
            return { success: false, reason: OUTSIDE};
        }

        if (c_dist_sq < r_min * r_min) {
            return { success: false, reason: INSIDE};
        }

        if (collision === false) {
            return { success: true, reason: COLLIDE};
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

        return { success: true, reason: COLLIDE, points: points};
    };

    Intersection.circle_bb2 = function (circle, bb, collision, distance) {
        return circle_rectangle(circle[0][0], circle[0][1], circle[1],
            bb[0], bb[1], bb[2], bb[3],
            collision === true, distance === true);
    };

    Intersection.circle_rectangle = function (circle, rect, collision, distance) {
        return circle_rectangle(circle[0][0], circle[0][1], circle[1],
            rect[0][0], rect[0][1], rect[1][0], rect[1][1],
            collision === true, distance === true);
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

    Intersection.circle_segment2 = function (circle, segment2, collision, distance) {
        return circle_segment(
            circle[0][0], circle[0][1], circle[1],
            segment2[0], segment2[1], segment2[2], segment2[3],
            collision === true,
            distance === true
        );
    };

    Intersection.line2_line2 =  function (aline, bline, collision, distance) {
        collision = collision === true;
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
                if (collision === false) {
                    return {success: true, reason: COLLIDE};
                }
                return {success: true, reason: COLLIDE, points: [[a1[0] + ua * (a2[0] - a1[0]), a1[1] + ua * (a2[1] - a1[1])]]};
            }
            return {success: false, reason: OUTSIDE};
        }
        if (ua_t === 0 || ub_t === 0) {
            return {success: false, reason: COINCIDENT};
        }
        return {success: false, reason: PARALLEL};
    };

    Intersection.segment2_segment2 = function (asegment, bsegment, collision, distance) {
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

        denom  = (bsegment[3] - bsegment[1]) * (asegment[2] - asegment[0]) - (bsegment[2] - bsegment[0]) * (asegment[3] - asegment[1]);
        numera = (bsegment[2] - bsegment[0]) * (asegment[1] - bsegment[1]) - (bsegment[3] - bsegment[1]) * (asegment[0] - bsegment[0]);
        numerb = (asegment[2] - asegment[0]) * (asegment[1] - bsegment[1]) - (asegment[3] - asegment[1]) * (asegment[0] - bsegment[0]);

        /* Are the line coincident? */
        if (Math.abs(numera) < Math.EPS && Math.abs(numerb) < Math.EPS && Math.abs(denom) < Math.EPS) {

            if (collision === false) {
                return {
                    success : true,
                    reason : COLLIDE
                };
            }

            // check if the intersections is a line!
            points = [];
            points.push(Intersection.segment2_vec2(bsegment, [asegment[0], asegment[1]]));
            points.push(Intersection.segment2_vec2(bsegment, [asegment[2], asegment[3]]));
            points.push(Intersection.segment2_vec2(asegment, [bsegment[0], bsegment[1]]));
            points.push(Intersection.segment2_vec2(asegment, [bsegment[2], bsegment[3]]));
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
                    success : true,
                    reason : COLLIDE,
                    points: [],
                    segments: [[minp.point[0], minp.point[1], maxp.point[0], maxp.point[1]]]
                };
            }

            return {
                success : false,
                reason : COINCIDENT
            };
        }

        /* Are the line parallel */
        if (Math.abs(denom) < Math.EPS) {
            return {success: false, reason: PARALLEL};
        }

        /* Is the intersection along the the segments */
        mua = numera / denom;
        mub = numerb / denom;
        if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
            return {success: false, reason: OUTSIDE};
        }

        if (collision === false) {
            return {success: true, reason: COLLIDE};
        }

        return {success: true, reason: COLLIDE, points: [[asegment[0] + mua * (asegment[2] - asegment[0]), asegment[1] + mua * (asegment[3] - asegment[1])]]};
    };

    Intersection.segment2_vec2 = function (seg, vec) {
        var dis = Distance.segment2_vec2(seg, vec);

        if (dis === 0) {
            return {
                success : true,
                reason : COLLIDE,
                points: [vec]
            };
        }

        return {
            success : false,
            reason : OUTSIDE,
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