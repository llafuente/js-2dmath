var js2math = require("./index.js");

["Triangle", "Rectangle", "Circle", "AABB2", "Polygon"].forEach(function(geom) {
    ["isVec2Inside", "area", "perimeter", "contains"].forEach(function(fname) {
        console.log(geom+"."+fname, js2math[geom][fname] ? "done" : "todo");
    });
});

["Triangle", "Rectangle", "Circle", "Polygon"].forEach(function(geom) {
    if (!js2math.AABB2["from" + geom]) {
        console.log("AABB2.from" + geom);
    }
});



// todo list
["Vec2", "Line2", "Segment2", "Rectangle", "Circle", "AABB2"].forEach(function(v) {
    //console.log(v, js2math[v]);
    if("function" !== typeof js2math[v].distance) {
        console.log(v, " distance is missing");
    }
    if("function" !== typeof js2math[v].length) {
        console.log(v, " length is missing");
    }
    if("function" !== typeof js2math[v].area) {
        console.log(v, " area is missing");
    }

    ["Vec2", "Line2", "Segment2", "Rectangle", "Circle"].forEach(function(v2) {
        if (v == v2) {
            return;
        }
        if (!js2math.Intersection[v.toLowerCase() + "_" + v2.toLowerCase()]) {
            console.log(v.toLowerCase() + "_" + v2.toLowerCase(), " intersection is missing");
        }
    });
});