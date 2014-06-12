require("./lib/math.js");

module.exports = {
    Vec2: require("./debug/vec2.js"),
    Line2: require("./debug/line2.js"),
    Segment2: require("./debug/segment2.js"),
    //geom
    Rectangle: require("./debug/rectangle.js"),
    AABB2: require("./debug/aabb2.js"),
    Circle: require("./debug/circle.js"),
    Triangle: require("./debug/triangle.js"),
    Polygon: require("./debug/polygon.js"),

    Beizer: require("./debug/beizer.js"),
    Matrix23: require("./debug/matrix23.js"),
    Matrix22: require("./debug/matrix22.js"),
    Collide: require("./lib/collide.js"),
    Intersection: require("./debug/intersection.js"),
    Transitions: require("./debug/transitions.js"),
    Xorshift: require("./debug/xorshift.js"),
    Noise: require("./debug/noise.js"),
    Draw: require("./lib/draw.js"),

    NMtree: require("./lib/nmtree.js"),
    globalize: function(object) {
        var i;
        for (i in this) {
            object[i] = this[i];
        }
    }
};

module.exports.Polygon.GJK = require("./lib/gjk.js");
module.exports.Polygon.EPA = require("./lib/epa.js");
module.exports.Polygon.edgeClipping = require("./lib/edge-clipping.js");