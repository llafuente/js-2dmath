var Rectangle = require("./rectangle.js"),
    Distance = require("./distance.js"),
    Segment2 = require("./segment2.js"),
    segment2$inside = Segment2.$inside,
    AABB2 = require("./aabb2.js"),
    Vec2 = require("./vec2.js"),
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

/**
 * @param {Number} num
 * @param {Number} num2
 * @return {Boolean}
 */
function near(num, num2) {
    return num > num2 - EPS && num < num2 + EPS;
}

//
// helpers
//

/**
 * x1 < x3
 *
 * @TODO distance
 * @TODO segment collision, maybe using segment-segment collision, this could slow down things!
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} x4
 * @param {Number} y4
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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
/**
 * @param {Number} cx
 * @param {Number} cy
 * @param {Number} r
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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
            return {reason: COLLIDE, points: points};
        }

        return {reason: OUTSIDE};
    }

}
/**
 * @param {Number} cx
 * @param {Number} cy
 * @param {Number} r
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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
/**
 * @param {AABB2} bb2_1
 * @param {AABB2} bb2_2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_bb2(bb2_1, bb2_2, collision, distance) {
    AABB2.normalize(bb2_1, bb2_1);
    AABB2.normalize(bb2_2, bb2_2);

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
/**
 * @param {AABB2} bb2
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_vec2(bb2, vec2, collision, distance) {
    return $rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1], collision === true, distance === true);
}
/**
 * @param {Vec2} vec2
 * @param {AABB2} bb2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_bb2(vec2, bb2, collision, distance) {
    return $rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1], collision === true, distance === true);
}

/**
 * @TODO segments of collision
 *
 * @param {Rectangle} rect1
 * @param {Rectangle} rect2
 * @param {Boolean} collision
 * @param {Boolean} distance
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
 * @TODO segments of collision
 *
 * @param {AABB2} bb2
 * @param {AABB2} rect
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_rectangle(bb2, rect, collision, distance) {
    AABB2.normalize(bb2, bb2);
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
/**
 *
 * @param {AABB2} rect
 * @param {AABB2} bb2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_bb2(rect, bb2, collision, distance) {
    return bb2_rectangle(bb2, rect, collision, distance);
}


/**
 *
 * @param {AABB2} rect
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_vec2(rect, vec2, collision, distance) {
    return $rectangle_vec2(rect[0][0], rect[0][1], rect[1][0], rect[1][1], vec2[0], vec2[1], collision === true, distance === true);
}
/**
 *
 * @param {Vec2} vec2
 * @param {AABB2} rect
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_rectangle(vec2, rect, collision, distance) {
    return $rectangle_vec2(rect[0][0], rect[0][1], rect[1][0], rect[1][1], vec2[0], vec2[1], collision === true, distance === true);
}

/**
 *
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
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
/**
 *
 * @param {Vec2} vec2
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_circle(vec2, circle, collision, distance) {
    circle_vec2(circle, vec2, collision, distance);
}
/**
 *
 * @param {Circle} a_circle
 * @param {Circle} b_circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_circle(a_circle, b_circle, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var c1 = a_circle[0],
        c2 = b_circle[0],
        r1 = a_circle[1],
        r2 = b_circle[1],
        r1sq = r1 * r1,
        r2sq = r2 * r2,
        // Determine minimum and maximum radius where circles can intersect
        r_max = r1 + r2,
        r_min,
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

    r_min = r1 - r2;

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
/**
 *
 * @param {Circle} circle
 * @param {AABB2} bb2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_bb2(circle, bb2, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        bb2[0], bb2[1], bb2[2], bb2[3],
        collision === true, distance === true);
}
/**
 *
 * @param {AABB2} bb2
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_circle(bb2, circle, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        bb2[0], bb2[1], bb2[2], bb2[3],
        collision === true, distance === true);
}
/**
 *
 * @param {Circle} circle
 * @param {Rectangle} rect
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_rectangle(circle, rect, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true, distance === true);
}
/**
 *
 * @param {Rectangle} rect
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_circle(rect, circle, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true, distance === true);
}
/**
 *
 * @param {Circle} circle
 * @param {Segment2} seg2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_segment2(circle, seg2, collision, distance) {
    return $circle_segment2(
        circle[0][0], circle[0][1], circle[1],
        seg2[0], seg2[1], seg2[2], seg2[3],
        collision === true,
        distance === true
    );
}
/**
 *
 * @param {Segment2} seg2
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function segment2_circle(seg2, circle, collision, distance) {
    return $circle_segment2(
        circle[0][0], circle[0][1], circle[1],
        seg2[0], seg2[1], seg2[2], seg2[3],
        collision === true,
        distance === true
    );
}
/**
 *
 * @param {Line2} line2_2
 * @param {Line2} line2_1
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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
/**
 *
 * @param {Segment2} seg2_2
 * @param {Segment2} seg2_1
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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

/**
 *
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
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
/**
 *
 * @param {Vec2} vec2
 * @param {Segment2} seg2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_segment2(vec2, seg2) {
    return segment2_vec2(seg2, vec2);
}
/**
 * @TODO this is just a fast-code-version, no optimization no for real-time
 *
 * @param {Polygon} a_poly
 * @param {Polygon} b_poly
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function polygon_polygon(a_poly, b_poly) {
    var alen = a_poly.length,
        blen = b_poly.length,
        a,
        a2,
        b,
        b2,
        points = [];
    for (a = 0; a < alen; ++a) {
        a2 = a + 1;
        a2 = a2 == alen ? 0 : a2;
        for (b = 0; b < blen; ++b) {
            b2 = b + 1;
            b2 = b2 == blen ? 0 : b2;

            r = segment2_segment2(
                [a_poly[a][0], a_poly[a][1], a_poly[a2][0], a_poly[a2][1]],
                [b_poly[b][0], b_poly[b][1], b_poly[b2][0], b_poly[b2][1]],
                true,
                true
            );
            if (r.points) {
                points.push(r.points[0]);
            }

        }
    }

    if (points.length) {
        return {
            reason : COLLIDE,
            points: points,
        }
    }
    return {
        reason : OUTSIDE
    }
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

    polygon_polygon: polygon_polygon,

    $rectangle_rectangle: $rectangle_rectangle,
    $rectangle_vec2: $rectangle_vec2,
    $circle_segment2: $circle_segment2,
    $circle_rectangle: $circle_rectangle
};


module.exports = Intersection;