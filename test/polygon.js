var tap = require("tap"),
    test = tap.test,
    Polygon = require("../index.js").Polygon;

//setup

test("Vec2 init", function(t) {
    var poly1 = Polygon.create([0, 0], [50, 0], [50, 50], [0, 50]),
        poly2 = Polygon.create([5, 5], [50, 0], [50, 50], [0, 50]);
        poly3 = [];

    Polygon.translate(poly3, poly1, [100, 100])
console.log(poly1);
console.log(poly3);

    console.log(Polygon.GJK(poly1, poly2, []));
    console.log(Polygon.GJK(poly1, poly3, []));

    t.end();
});
