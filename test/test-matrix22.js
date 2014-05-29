var tap = require("tap"),
    test = tap.test,
    Matrix22 = require("../index.js").Matrix22;

//setup

test("Mat22 test 01", function(t) {

    var mat22 = Matrix22.fromNumbers(-1, 2, 4, -6);
    var vec2 = [-12,20];
    var out_vec2 = [0, 0];
    Matrix22.solve(out_vec2, mat22, vec2);

    t.equals(out_vec2[0], 4);
    t.equals(out_vec2[1], -2);

    t.end();
});