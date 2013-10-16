require("../lib/math.js");

var tap = require("tap"),
    test = tap.test,
    Line2 = require("../lib/line2.js");

//setup

test("Line2 init", function(t) {
    var l1 = Line2.create(0, 0, 1);

    // normalized
    t.equal(l1[0][0], 0, "t1-1");
    t.equal(l1[0][1], 0, "t2-1");
    t.equal(l1[1], 1, "t3-1");


    Line2.translate(l1, l1, [10,10]);

    t.equal(l1[0][0], 10, "t1-2");
    t.equal(l1[0][1], 10, "t2-2");
    t.equal(l1[1], 1, "t3-2");


    Line2.parallel(l1, l1, [10,10]);

    t.equal(l1[0][0], 10, "t1-3");
    t.equal(l1[0][1], 10, "t2-3");
    t.equal(l1[1], 1, "t3-");

    t.end();
});
