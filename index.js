require("./lib/math.js");

module.exports = {
    Vec2: require("./lib/vec2.js"),
    Line2: require("./lib/line2.js"),
    Segment2: require("./lib/segment2.js"),
    Rectangle: require("./lib/rectangle.js"),
    BB2: require("./lib/boundingbox2.js"),
    Circle: require("./lib/circle.js"),
    Beizer: require("./lib/beizer.js"),
    Matrix2D: require("./lib/matrix2d.js"),
    Intersection: require("./lib/intersection.js"),
    Transitions: require("./lib/transitions.js")
};


/*
// todo list
["Vec2", "Line2", "Segment2", "Rectangle", "Circle"].forEach(function(v) {
    //console.log(v, module.exports[v]);
    if("function" !== typeof module.exports[v].distance) {
        console.log(v, " distance is missing");
    }
    if("function" !== typeof module.exports[v].length) {
        console.log(v, " length is missing");
    }
    if("function" !== typeof module.exports[v].area) {
        console.log(v, " area is missing");
    }
});


//fast doc
var i,
    j,
    text;
for (i in module.exports) {
    console.log("### ", i);
    for (j in module.exports[i]) {
        text = module.exports[i][j].toString();
        text = text.split("\n");
        text = text[0].trim();
        text = text.substring(9, text.length - 1).trim();
        console.log("*", j, text);
    }
    console.log();
}
*/