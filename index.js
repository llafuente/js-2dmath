require("./lib/math.js");

module.exports = {
    Vec2: require("./lib/vec2.js"),
    Line2: require("./lib/line2.js"),
    Segment2: require("./lib/segment2.js"),
    //geom
    Rectangle: require("./lib/rectangle.js"),
    AABB2: require("./lib/aabb2.js"),
    Circle: require("./lib/circle.js"),
    Triangle: require("./lib/triangle.js"),
    Polygon: require("./lib/polygon.js"),

    Beizer: require("./lib/beizer.js"),
    Matrix23: require("./lib/matrix23.js"),
    Matrix22: require("./lib/matrix22.js"),
    Collide: require("./lib/collide.js"),
    Intersection: require("./lib/intersection.js"),
    Transitions: require("./lib/transitions.js"),
    Xorshift: require("./lib/xorshift.js"),
    Noise: require("./lib/noise.js"),
    Draw: require("./lib/draw.js"),

    NMtree: require("./lib/nmtree.js"),

    Collision : {
        Response: require("./lib/collision/response.js"),
        GJK: require("./lib/collision/gjk.js"),
        EPA: require("./lib/collision/epa.js"),
        Manifold: require("./lib/collision/manifold.js"),
        SAT: require("./lib/collision/sat.js"),
        Resolve: require("./lib/collision/resolve.js")
    },

    NumericalIntegration: {
        RK4: require("./lib/numerical-integration/rk4.js"),
        Verlet: require("./lib/numerical-integration/verlet.js"),
        Euler: require("./lib/numerical-integration/euler.js")
    },

    globalize: function (object) {
        var i;
        for (i in this) {
            object[i] = this[i];
        }
    }
};

