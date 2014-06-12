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