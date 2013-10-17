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
        PARALLEL: 5
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
        console.log("swap");
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


    return Intersection;
}());


if ("undefined" === typeof module) {
    window.Intersection = exp;
} else {
    module.exports = exp;
}