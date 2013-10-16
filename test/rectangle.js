require("../lib/math.js");

var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../lib/vec2.js"),
    Rectangle = require("../lib/rectangle.js");

//setup

test("Vec2 init", function(t) {
    var rec1 = Rectangle.create(0, 0, 10, 10),
        rec2 = Rectangle.create(10, 10, 0, 0),
        rec3 = Rectangle.zero(),
        v = Vec2.zero();

    // normalized
    t.equal(rec1[0][0], 0, "t1");
    t.equal(rec1[0][1], 10, "t2");

    t.equal(rec1[1][0], 10, "t1");
    t.equal(rec1[1][1], 0, "t2");


    t.deepEqual(Rectangle.center(v, rec1), [5,5], "t2");
    t.deepEqual(Rectangle.normalize(rec2, rec2), rec1, "t2");

    t.end();
});
