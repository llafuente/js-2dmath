var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../index.js").Vec2,
    Intersection = require("../index.js").Intersection,
    Circle = require("../index.js").Circle,
    Polygon = require("../index.js").Polygon,
    GJK = require("../index.js").Collision.GJK.getPolygonPolygon,
    EPA = require("../index.js").Collision.EPA,
    SAT = require("../index.js").Collision.SAT.getPolygonPolygon,
    Response = require("../index.js").Collision.Response;

function cPoly(circle, npoints, initial_angle) {
    if (circle) {
        this.points = Polygon.fromCircle(circle, npoints, initial_angle);
        this.calc();
    }
}

cPoly.prototype.calc = function () {
    this.edges = Polygon.edges([], this.points);
    this.normals = Polygon.normals([], this.edges);
}
cPoly.prototype.translate = function (vec2) {
    Polygon.translate(this.points, this.points, vec2);
    Polygon.translate(this.edges, this.edges, vec2);
}

//setup

test("Vec2 init", function(t) {
    var A = new cPoly(Circle.create(0, 0, 20), 6, 0),
        B = new cPoly(Circle.create(0, 0, 20), 6, 0);
/*
    var positions = [
        [5, 5],
        [-5, 5],
        [-5, -5],
        [5, -5],
    ];

    var A = new cPoly(),
        B = new cPoly();
    A.points = [[4, 11], [9, 9], [4, 5]];
    A.calc();
    B.points = [[12, 7], [10, 2], [7, 3], [5, 7]];
    B.calc();
*/
    var positions = [
        [5, 5],
    ];


    Intersection.polygon_polygon(A.points, B.points);

    positions.forEach(function(pos) {
        B.translate(pos);

        var out_response = Response.create();

        console.log("");
        console.log("");
        console.log("");
        console.log(pos);
        console.log("");

        var gjk_result = GJK(A.points, B.points);
        //console.log("GJK", gjk_result);

        EPA(out_response, A.points, B.points, gjk_result.simplex);
        console.log("EPA", out_response);

        console.log(SAT(out_response, A.points, A.normals, [0, 0], B.points, B.normals, [0, 0]));
        console.log("SAT", out_response);

        B.translate(Vec2.negate(pos, pos));
    });


    t.end();
});
