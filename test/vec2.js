var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../index.js").Vec2;

//setup

test("Vec2 init", function(t) {
    var v1 = Vec2.create(10, 15),
        v2 = Vec2.create(15, 10),
        out = Vec2.zero();

    t.equal(v1[0], 10, "t1");
    t.equal(v1[1], 15, "t2");

    t.equal(v2[0], 15, "t3");
    t.equal(v2[1], 10, "t4");

    t.equal(Vec2.equals(v1, v2), false, "t5");
    t.equal(Vec2.equals(v1, v1), true, "t6");

    t.equal(Vec2.equalsEpsilon(v1, v2), false, "t5-2");
    t.equal(Vec2.equalsEpsilon(v1, v1), true, "t6-2");

    //t.equal(Vec2.gt([10,10], [5,10]), false, "t7");
    //t.equal(Vec2.gt([10,10], [10,10]), false, "t8");
    //t.equal(Vec2.gt([10,10], [15,15]), true, "t9");
    //
    //t.equal(Vec2.lt([10,10], [5,10]), true, "t10"); // fail
    //t.equal(Vec2.lt([10,10], [10,10]), false, "t11");
    //t.equal(Vec2.lt([10,10], [15,15]), false, "t12");


    // test: add, sub
    Vec2.add(out, v1, v2);
    t.equal(out[0], 25, "t12");
    t.equal(out[1], 25, "t13");

    Vec2.sub(out, v1, v2);
    t.equal(out[0], -5, "t14");
    t.equal(out[1], 5, "t15");

    // test: add, sub (self)
    Vec2.add(v1, v1, v2);
    t.equal(v1[0], 25, "t16");
    t.equal(v1[1], 25, "t17");

    //reset
    v1 = Vec2.create(10, 15);
    Vec2.sub(v1, v1, v2);
    t.equal(v1[0], -5, "t18");
    t.equal(v1[1], 5, "t19");


    t.equal(Vec2.near([10,10], [10,15], 6), true, "t20");
    t.equal(Vec2.near([10,10], [10,15], 4), false, "t21");

    t.deepEqual(Vec2.negate(v1, v1), [5, -5], "t22");
    t.deepEqual(Vec2.negate([], v1), [-5, 5], "t23");


    t.deepEqual(Vec2.compare([0,0], [0,0]), 0, "t24");

    t.deepEqual(Vec2.compare([0,0], [0,10]), 1, "t25");
    t.deepEqual(Vec2.compare([0,0], [10,10]), 2, "t26");

    t.deepEqual(Vec2.compare([0,0], [10,0]), 3, "t27");
    t.deepEqual(Vec2.compare([0,0], [10,-10]), 4, "t28");

    t.deepEqual(Vec2.compare([0,0], [0,-10]), 5, "t29");
    t.deepEqual(Vec2.compare([0,0], [-10,-10]), 6, "t30");

    t.deepEqual(Vec2.compare([0,0], [-10,0]), 7, "t31");
    t.deepEqual(Vec2.compare([0,0], [-10,10]), 8, "t32");


    t.equal(Vec2.angle([10,10]) - Math.QUATER_PI < 0.001, true, "t33");

    t.end();
});
