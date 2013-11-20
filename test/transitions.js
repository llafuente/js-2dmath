require("../lib/math.js");

var tap = require("tap"),
    test = tap.test,
    Vec2 = require("../lib/vec2.js"),
    Transitions = require("../index.js").Transitions;

//setup
var util = require("util");
var events = require("events");

function Vector() {
    events.EventEmitter.call(this);
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

util.inherits(Vector, events.EventEmitter);

function Movable() {
    events.EventEmitter.call(this);
    this.position = [0, 0];
}

util.inherits(Movable, events.EventEmitter);


test("Transitions", function (t) {
    var v = new Vector();

    Transitions.tween(v, {
        "100%" : {
            "x": 100
        },
        "75%" : {
            "x": 75,
            "y": 100,
            "z": 100
        },
        "50%" : {
            "x": 75,
            "y": 75,
            "z": 100
        },
        "25%" : {
            "x": 50,
            "y": 50,
            "z": 75
        }
    }, {time: 1000});

    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.equal(v.x, 0, "x is 0");
    t.equal(v.y, 0, "y is 0");
    t.equal(v.z, 0, "z is 0");

    v.emit("tick", 250);
    t.equal(v.x, 50, "x is 50");
    t.equal(v.y, 50, "y is 50");
    t.equal(v.z, 75, "z is 75");

    v.emit("tick", 250);
    t.equal(v.x, 75, "x is 75");
    t.equal(v.y, 75, "y is 75");
    t.equal(v.z, 100, "z is 100");

    v.emit("tick", 250);
    t.equal(v.x, 75, "x is 75");
    t.equal(v.y, 100, "y is 100");
    t.equal(v.z, 100, "z is 100");

    v.emit("tick", 1000);
    t.equal(v.x, 100, "x is 100");
    t.equal(v.y, 100, "y is 100");
    t.equal(v.z, 100, "z is 100");


    t.end();
});


test("Transitions", function (t) {
    var v = new Vector();

    Transitions.tween(v, {
        "100%" : {
            "x": 100
        },
        "75%" : {
            "x": 75,
            "y": 100,
            "z": 100
        },
        "50%" : {
            "x": 75,
            "y": 75,
            "z": 100
        },
        "25%" : {
            "x": 50,
            "y": 50,
            "z": 75
        }
    }, {time: 1000});

    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.equal(v.x, 0, "x is 0");
    t.equal(v.y, 0, "y is 0");
    t.equal(v.z, 0, "z is 0");

    v.emit("tick", 125);
    t.equal(v.x, 25, "x is 25");
    t.equal(v.y, 25, "y is 25");
    t.equal(v.z, 37.5, "z is 37.5");

    v.emit("tick", 250);
    t.equal(v.x, 62.5, "x is 62.5");
    t.equal(v.y, 62.5, "y is 62.5");
    t.equal(v.z, 87.5, "z is 87.5");

    v.emit("tick", 250);
    t.equal(v.x, 75, "x is 75");
    t.equal(v.y, 87.5, "y is 87.5");
    t.equal(v.z, 100, "z is 100");

    v.emit("tick", 1000);
    t.equal(v.x, 100, "x is 100");
    t.equal(v.y, 100, "y is 100");
    t.equal(v.z, 100, "z is 100");


    t.end();
});

test("Transitions chain", function (t) {
    var v = new Vector();

    Transitions.tween(v, {
        "100%" : {
            "x": 100
        }
    }, {time: 1000});

    Transitions.tween(v, {
        "100%" : {
            "x": 200
        }
    }, {time: 1000, link: Transitions.LINK.CHAIN});

    Transitions.tween(v, {
        "100%" : {
            "x": 300
        }
    }, {time: 1000, link: Transitions.LINK.CHAIN});

    Transitions.tween(v, {
        "100%" : {
            "x": 400
        }
    }, {time: 1000, link: Transitions.LINK.CHAIN});

    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.equal(v.x, 0, "x is 0");

    v.emit("tick", 1000);
    t.equal(v.x, 100, "x is 100");
    v.emit("tick", 1000);
    t.equal(v.x, 200, "x is 200");
    v.emit("tick", 1000);
    t.equal(v.x, 300, "x is 300");
    v.emit("tick", 1000);
    t.equal(v.x, 400, "x is 400");



    t.end();
});


test("Transitions cancel", function (t) {
    var v = new Vector();

    Transitions.tween(v, {
        "100%" : {
            "x": 100
        }
    }, {time: 1000});

    Transitions.tween(v, {
        "100%" : {
            "x": 200
        }
    }, {time: 1000, link: Transitions.LINK.CANCEL});


    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.equal(v.x, 0, "x is 0");

    v.emit("tick", 1000);

    t.equal(v.x, 200, "x is 200");
    t.end();
});

test("Transitions ignore", function (t) {
    var v = new Vector();

    Transitions.tween(v, {
        "100%" : {
            "x": 100
        }
    }, {time: 1000});

    Transitions.tween(v, {
        "100%" : {
            "x": 200
        }
    }, {time: 1000, link: Transitions.LINK.IGNORE});


    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.equal(v.x, 0, "x is 0");

    v.emit("tick", 1000);

    t.equal(v.x, 100, "x is 100");
    t.end();
});

test("Transitions stop", function (t) {
    var v = new Vector();

    Transitions.tween(v, {
        "100%" : {
            "x": 100
        }
    }, {time: 1000});

    Transitions.tween(v, {
        "100%" : {
            "x": 200
        }
    }, {time: 1000, link: Transitions.LINK.STOP});


    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.equal(v.x, 0, "x is 0");

    v.emit("tick", 1000);

    t.equal(v.x, 0, "x is 0");
    t.end();
});



test("array input/output", function (t) {
    var v = new Movable();

    Transitions.tween(v, {
        "100%" : {
            "position": [100, 100]
        }
    }, {
        time: 1000,
        //apply factor to a vector
        applyFactor: function (k0, k1, rfactor) {
            return [
                ((k1[0] - k0[0]) * rfactor) + k0[0],
                ((k1[1] - k0[1]) * rfactor) + k0[1]
            ];
        },
        //render to a vector
        render: function (obj, prop, value) {
            obj[prop][0] = value[0];
            obj[prop][1] = value[1];
        }
    });


    // x 100-50-75
    // y 100-100-100
    // z 0-50-50
    t.deepEqual(v.position, [0, 0], "x is [0,0]");

    v.emit("tick", 500);
    t.deepEqual(v.position, [50, 50], "x is [50,50]");

    v.emit("tick", 500);
    t.deepEqual(v.position, [100, 100], "x is [100,100]");
    t.end();
});