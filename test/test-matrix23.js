var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../lib/vec2.js"),
    Matrix23 = require("../index.js").Matrix23;

//setup

test("Vec2 init", function(t) {
    var m2d1 = Matrix23.create(),
        m2d2 = Matrix23.create(),
        m2d3 = Matrix23.create();

    Matrix23.identity(m2d2);

    t.deepEqual(m2d1, m2d2, "t1");

    Matrix23.translate(m2d2, m2d2, [10, 10]);

    t.deepEqual(m2d2, [1, 0, 0, 1, 10, 10, [1, 1, 0, 0, 0], true], "t1");

    Matrix23.copy(m2d1, m2d2);
    t.deepEqual(m2d1, m2d2, "t1");

    t.end();
});
