var tap = require("tap"),
    test = tap.test,
    Polygon = require("../index.js").Polygon;

//setup

test("Vec2 init", function(t) {
    var poly1 = Polygon.create([0, 0], [50, 0], [50, 50], [0, 50]),
        poly2 = Polygon.create([5, 5], [50, 0], [50, 50], [0, 50]);
        poly3 = Polygon.create([75, 75], [50, 0], [50, 50], [0, 50]);


    console.log(Polygon.GJK(poly1, poly2));

    t.end();
});
