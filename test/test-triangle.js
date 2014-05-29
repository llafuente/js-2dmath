var tap = require("tap"),
    test = tap.test,
    Triangle = require("../index.js").Triangle;

//setup

test("Vec2 init", function(t) {
    var tri = Triangle.create(0, 0, 0, 1, 1, 0);

    t.deepEquals(Triangle.circumcenter([], tri), [0.5,0.5], "circumcenter");
    t.end();
});
