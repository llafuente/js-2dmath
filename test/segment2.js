var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../lib/vec2.js"),
    Segment2 = require("../index.js").Segment2;

//setup

test("Vec2 init", function(t) {
    var segments = [
            Segment2.create(-500, 0, 500, 0),
            Segment2.create(-500, 0, 500, 300),
            Segment2.create(-500, 0, 500, -300)
        ],
        cache_seg2_angle_min,
        cache_seg2_angle_max,
        cp = [0, 0],
        test_point = [0, -500],
        test_point2 = [0, 500],
        aux;


    for (i = 0; i < segments.length; ++i) {
        t.ok(Segment2.isAbove(segments[i], test_point));
        t.ok(!Segment2.isAbove(segments[i], test_point2));
    }

    //t.deepEqual(m2d1, m2d2, "t1");

    t.end();
});
