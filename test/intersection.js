var path = require("path"),
    tap = require("tap"),
    test = tap.test,
    Intersection = require("../index.js").Intersection,
    Vec2 = require("../index.js").Vec2.create,
    Circle = require("../index.js").Circle.create,
    Line2 = require("../index.js").Line2.create,
    Rectangle = require("../index.js").Rectangle.create;

function near(a, b) {
    return a > b - Math.EPS && a < b + Math.EPS;
}

test("intersection_circle_vs_circle", function(t) {
    var c1 = Circle(0,0,5),
        c2 = Circle(5,5,1),
        c3 = Circle(2,2,5),
        c4 = Circle(0,0,2);

    t.deepEqual(Intersection.circle_circle(c1, c2, true, true),
        {reason: Intersection.COLLIDE, points: [
            [2.609128788536429,4.790871211463569],
            [4.790871211463569,2.609128788536429]
        ]},
        "intersection_circle_vs_circle outside");

    t.deepEqual(Intersection.circle_circle(c1, c4, true),
        {reason: Intersection.INSIDE },
        "intersection_circle_vs_circle inside");

    t.deepEqual(Intersection.circle_circle(c1, c3, true, true),
        { reason: Intersection.COLLIDE,

        "points" : [
          [
            -2.3911649915626336,
            4.391164991562634
          ],
          [
            4.391164991562634,
            -2.3911649915626336
          ]
        ]},"intersection_circle_vs_circle intersects");

    t.end();
});

test("distance_line2_vs_line2", function(t) {
    var l1 = Line2(0, 0, 1),
        l2 = Line2(0, 0, -1),
        l3 = Line2(1, 1, -1),
        l4 = Line2(5, 0, 1);

    t.deepEqual(Intersection.line2_line2(l1, l2, true, true),
        {reason: Intersection.COLLIDE, points: [[0, 0]] },
        "intersection_line2_vs_line2 collide");

    t.deepEqual(Intersection.line2_line2(l1, l1),
        {reason: Intersection.COINCIDENT },
        "intersection_line2_vs_line2 coincident");

    t.deepEqual(Intersection.line2_line2(l1, l4),
        {reason: Intersection.PARALLEL },
        "intersection_line2_vs_line2 parallel");

    t.end();
});

/*
test("intersection_circle_vs_line2", function(t) {
    var c1 = new Circle(0, 0, 5),
        s1 = new Segment2(0, 0, 5, 5),
        s2 = new Segment2(0, 0, 1, 1),
        s3 = new Segment2(10, 10, 15, 15);

    t.deepEqual(Math.intersection_circle_vs_segment2(c1, s1),
        {reason: "collide", points: [ { x: 3.5355339059327378, y: 3.5355339059327378 } ] },
        "intersection_circle_vs_circle collide");

    t.deepEqual(Math.intersection_circle_vs_segment2(c1, s2),
        {reason: "inside" },
        "intersection_circle_vs_circle inside");

    t.deepEqual(Math.intersection_circle_vs_segment2(c1, s3),
        {reason: "outside" },
        "intersection_circle_vs_circle outside");
    t.end();
});

test("distance_rectangle_vs_rectangle", function(t) {
    var s1 = new Segment2(0, 0, 5, 5)
        s2 = new Segment2(0.5, 0.5, 1.5, 1.5)
        p1 = new Polygon([0,0, 2,0, 2,2, 0,2]);

    t.deepEqual(Math.intersection_segment_vs_polygon(s1, p1),
        {reason: 'collide', points: [ { x: 0, y: 0 }, { x: 2, y: 2 } ] },
        "intersection_segment_vs_polygon collide");

    t.deepEqual(Math.intersection_segment_vs_polygon(s2, p1),
        {reason: 'no-intersection'},
        "intersection_segment_vs_polygon no collide");
    t.end();
});
*/

test("intersection_rectangle_vs_vec2", function(t) {
    var r1 = Rectangle(0, 0, 5, 5),
        v1 = Vec2(-1, -1),
        v2 = Vec2(0, 1),
        v3 = Vec2(3, 3),
        v4 = Vec2(10, 10),

        v5 = Vec2(2, -5), // down
        v6 = Vec2(2, 10), // up

        v7 = Vec2(-5, 2), // left
        v8 = Vec2(10, 2), // right

        v9 = Vec2(10, 10),
        v10 = Vec2(-10, -10);

    t.deepEqual(Intersection.rectangle_vec2(r1, v1),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v2, true, true),
        {reason: Intersection.COLLIDE, points: [v2]},
        "rectangle_vec2 collide");

    t.deepEqual(Intersection.rectangle_vec2(r1, v3),
        {reason: Intersection.INSIDE},
        "rectangle_vec2 inside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v4),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v5),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v6),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v7),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v8),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v9),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.deepEqual(Intersection.rectangle_vec2(r1, v10),
        {reason: Intersection.OUTSIDE},
        "rectangle_vec2 outside");

    t.end();
});

test("distance_rectangle_vs_rectangle", function(t) {
    var c1 = Circle(0, 0, 5),
        v1 = Vec2(3.5355339059327378, 3.5355339059327378),
        v2 = Vec2(0, 0),
        v3 = Vec2(10, 10);


    t.deepEqual(Intersection.circle_vec2(c1, v1, true, true),
        {reason: Intersection.COLLIDE, points: [[3.5355339059327378, 3.5355339059327378]]},
        "intersection_circle_vs_vec2 collide");

    t.deepEqual(Intersection.circle_vec2(c1, v2),
        {reason: Intersection.INSIDE, distance: 5 },
        "intersection_circle_vs_vec2 inside");

    t.deepEqual(Intersection.circle_vec2(c1, v3),
        {reason: Intersection.OUTSIDE, distance: 9.142135623730951 },
        "intersection_circle_vs_vec2 outside");

    t.end();
});

test("intersection_rectangle_vs_rectangle", function(t) {
    var r1 = Rectangle(0, 0, 5, 5),
        r2 = Rectangle(1, 1, 6, 6),
        r3 = Rectangle(1, 1, 2, 2),
        r4 = Rectangle(6, 6, 7, 7);

    t.deepEqual(Intersection.rectangle_rectangle(r1, r2, true, true),
        {reason: Intersection.COLLIDE, points: [[5,1], [1,5]]},
        "intersection_rectangle_vs_rectangle collide");

    t.deepEqual(Intersection.rectangle_rectangle(r1, r3),
        {reason: Intersection.INSIDE },
        "intersection_rectangle_vs_rectangle inside");

    t.deepEqual(Intersection.rectangle_rectangle(r1, r4),
        {reason: Intersection.OUTSIDE },
        "intersection_rectangle_vs_rectangle outside");

    t.end();
});

/*
test("intersection_segment2_vs_vec2", function(t) {
    var s1 = new Segment2(0,0, 5,5),
        v1 = new Vec2(1,1),
        v2 = new Vec2(6,6),
        v3 = new Vec2(1,5);

    t.deepEqual(Math.intersection_segment2_vs_vec2(s1, v1),
        {reason: 'collide', points: [ { x: 1, y: 1 } ] },
        "intersection_segment2_vs_vec2 collide");

    t.deepEqual(Math.intersection_segment2_vs_vec2(s1, v2),
        {reason: 'outside', distance: 1.4142135623730951 },
        "intersection_segment2_vs_vec2 outside");

    t.deepEqual(Math.intersection_segment2_vs_vec2(s1, v3),
        {reason: 'outside', distance: 2.8284271247461903 },
        "intersection_segment2_vs_vec2 outside");

    t.end();
});


test("intersection_segment2_vs_vec2", function(t) {
    var s1 = new Segment2(0,0, 5,5),
        s2 = new Segment2(-1,-1, 6,6),
        s3 = new Segment2(2,0, -2,2),
        s4 = new Segment2(0,1, 5,6);

    t.deepEqual(Math.intersection_segment2_vs_segment2(s1, s2),
        {reason: 'coincident', points: [], segments: [{x1:0, y1:0, x2: 5, y2: 5}] },
        "intersection_segment2_vs_vec2 collide");

    t.deepEqual(Math.intersection_segment2_vs_segment2(s1, s3),
        {reason: 'collide', points: [{x: 0.6666666666666666, y: 0.6666666666666666}] },
        "intersection_segment2_vs_vec2 outside");

    t.deepEqual(Math.intersection_segment2_vs_segment2(s1, s4),
        {reason: 'parallel'},
        "intersection_segment2_vs_vec2 parallel");

    t.end();

    setTimeout(function() {
        process.exit();
    },0);
});
*/