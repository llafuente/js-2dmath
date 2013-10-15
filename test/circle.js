require("../lib/math.js");

var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../lib/vec2.js"),
    Circle = require("../lib/circle.js");

//setup

test("Vec2 init", function(t) {
    var c1 = Circle(0, 0, 10);

    // normalized
    t.equal(c1[0][0], 0, "t1");
    t.equal(c1[0][1], 0, "t2");


    t.equal(c1[1], 10, "t3");

    Circle.translate(c1, c1, [10,10]);

    t.equal(c1[0][0], 10, "t1-1");
    t.equal(c1[0][1], 10, "t2-1");


    t.equal(c1[1], 10, "t3-1");

    t.end();
});
