require("./lib/math.js");

module.exports = {
    Vec2: require("./lib/vec2.js"),
    Line2: require("./lib/line2.js"),
    Segment2: require("./lib/segment2.js"),
    Rectangle: require("./lib/rectangle.js"),
    Circle: require("./lib/circle.js"),
    Beizer: require("./lib/beizer.js"),
    Matrix2D: require("./lib/matrix2d.js"),
    Intersection: require("./lib/intersection.js")
};


/*
// todo list
["Vec2", "Line2", "Segment2", "Rectangle", "Circle"].forEach(function(v) {
    //console.log(v, module.exports[v]);
    if("function" !== typeof module.exports[v].distance) {
        console.log(v, " distance is missing");
    }
});
*/