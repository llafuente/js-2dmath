require("../lib/math.js");

var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../lib/vec2.js"),
    Matrix2D = require("../lib/matrix2d.js");

//setup

test("Vec2 init", function(t) {
    var m2d1 = Matrix2D.create(),
        m2d2 = Matrix2D.create(),
        m2d3 = Matrix2D.create();

    Matrix2D.identity(m2d2);

    t.deepEqual(m2d1, m2d2, "t1");

    Matrix2D.translate(m2d2, m2d2, [10, 10]);

    t.deepEqual(m2d2, [1, 0, 0, 1, 10, 10, [1, 1, 0, 0, 0], true], "t1");

    Matrix2D.copy(m2d1, m2d2);
    t.deepEqual(m2d1, m2d2, "t1");

    t.end();
});
