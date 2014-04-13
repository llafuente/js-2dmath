
var falafel = require('falafel'),
    fs = require("fs");

var methods,
    valid_arguments,
    comments,
    files = {
        Vec2: {
            filename: "./lib/vec2.js",
            valid_arguments:{
                out: "Vec2",

                x: "Number",
                y: "Number",
                v1: "Vec2",
                v2: "Vec2",
                v3: "Vec2",
                length: "Number",
                degrees: "Number (Degrees)",
                radians: "Number (Radians)",
                dist: "Number",
                t: "Number",
                d: "Number",
                angle: "Number",
                center: "Vec2",
                factor: "Number",
                px: "Number",
                py: "Number",
                qx: "Number",
                qy: "Number",
                rx: "Number",
                ry: "Number",
            }
        },
        Line2: {
            filename: "./lib/line2.js",
            valid_arguments:{
                out: "Line2",

                x: "Number",
                y: "Number",
                m: "Number",
                x1: "Number",
                x2: "Number",
                y1: "Number",
                y2: "Number",
                seg2: "Segment2",
                v1: "Vec2",
                l1: "Line2",
            }
        },
        Segment2: {
            filename: "./lib/segment2.js",
            valid_arguments:{
                out: "Segment2",
                seg2: "Segment2",

                x1: "Number",
                x2: "Number",
                x3: "Number",
                y1: "Number",
                y2: "Number",
                y3: "Number",

                out_vec2: "Segment2",
                vec2: "Vec2",
            }
        },
        Rectangle: {
            filename: "./lib/rectangle.js",
            valid_arguments:{
                out: "Rectangle",
                rect: "Rectangle",
                rect2: "Rectangle",
                force: "Boolean",

                out_vec2: "Vec2",
                vec2: "Vec2",

                x1: "Number",
                x2: "Number",
                y1: "Number",
                y2: "Number",

                bb2: "BB2"
            }
        },
        BB2: {
            filename: "./lib/boundingbox2.js",
            valid_arguments:{
                out: "BB2",
                bb2: "BB2",
                bb2_1: "BB2",
                bb2_2: "BB2",
                l: "Number",
                b: "Number",
                r: "Number",
                t: "Number",
                circle: "Circle",
                rect: "Rectangle",
                out_vec2: "Vec2",
                vec2: "Vec2",
                vec2_offset: "Vec2",
                vec2_scale: "Vec2",
                alignament: "Number"
            }
        },
        Circle: {
            filename: "./lib/circle.js",
            valid_arguments:{
                out: "Circle",
                circle: "Circle",
                circle_2: "Circle",
                x: "Number",
                y: "Number",
                radius: "Number",
                vec2: "Vec2",
            }
        },
        Matrix2D: {
            filename: "./lib/matrix2d.js",
            valid_arguments:{
                out: "Matrix2D",
                m2d:  "Matrix2D",
                m2d_2:  "Matrix2D",
                out_vec2: "Vec2",
                vec2: "Vec2",
                vec2_degrees: "Vec2 (Degrees)",
                degrees: "Number (Degrees)",
                radians: "Number (Radians)",
                x: "Number",
                y: "Number",
            }
        },
        Polygon: {
            filename: "./lib/polygon.js",
            valid_arguments:{
                out: "Polygon",
                poly:  "Polygon",
                out_vec2: "Segment2"
            }
        },

        Beizer: {
            filename: "./lib/beizer.js",
            valid_arguments:{
                out: "Beizer",
                curve: "Beizer",
                
                out_vec2: "Segment2",

                t: "Number",
                step: "Number",
                cp0x: "Number",
                cp0y: "Number",
                cp1x: "Number",
                cp1y: "Number",
                cp2x: "Number",
                cp2y: "Number",
                cp3x: "Number",
                cp3y: "Number",
            }
        },

        Triangle: {
            filename: "./lib/triangle.js",
            valid_arguments:{
                out: "Triangle",
                tri: "Triangle",

                out_vec2: "Vec2",
                vec2: "Vec2",

                x1: "Number",
                x2: "Number",
                x3: "Number",
                y1: "Number",
                y2: "Number",
                y3: "Number",

                rect: "Rectangle",
            }
        },
        Intersection: {
            filename: "./lib/intersection.js",
            valid_arguments:{
                num: "Number",
                num2: "Number",
                collision: "Boolean",
                distance: "Boolean",

                x1: "Number",
                x2: "Number",
                x3: "Number",
                x4: "Number",
                y1: "Number",
                y2: "Number",
                y3: "Number",
                y4: "Number",

                cx: "Number",
                cy: "Number",
                r: "Number",

                line2: "Line2",
                line2_1: "Line2",
                line2_2: "Line2",

                seg2: "Segment2",
                seg2_1: "Segment2",
                seg2_2: "Segment2",

                vec2: "Vec2",
                circle: "Circle",
                circle_1: "Circle",
                circle_2: "Circle",

                bb2: "BB2",
                bb2_1: "BB2",
                bb2_2: "BB2",
                rect: "Rectangle",
                rect1: "Rectangle",
                rect2: "Rectangle",
            }
        },
        Distance: {
            filename: "./lib/distance.js",
            valid_arguments:{
                x1: "Number",
                x2: "Number",
                x3: "Number",
                x4: "Number",
                y1: "Number",
                y2: "Number",
                y3: "Number",
                y4: "Number",


                line2: "Line2",

                seg2: "Segment2",

                vec2: "Vec2",
                circle: "Circle",

                bb2: "BB2",
                rect: "Rectangle",
            }
        },
    },
    src,
    module;

var cls_list = [];
for (cls in files) {
    cls_list.push("[" + cls + "](#" + cls + ")");

}
console.log(cls_list.join(", "));
console.log("");
console.log("");

for (cls in files) {

    methods = {};
    src = fs.readFileSync(files[cls].filename, 'utf-8');

    module = require(files[cls].filename);

    // test
    //src = fs.readFileSync("doc-test.js", 'utf-8');

    valid_arguments = files[cls].valid_arguments;

    falafel(src, {comment: true, loc: true}, function (node) {
        //console.log(node);

        if (node.type == 'FunctionDeclaration' && node.id && node.id.name) {
            // define a new function!
            var args = [],
                i,
                max;

            for (i = 0, max = node.params.length; i < max; ++i) {
                arg = node.params[i].name;
                if (!valid_arguments[arg]) {
                    console.log(node);
                    throw new Error(files[cls].filename + ":" + arg + " is an invalid argument name, not in whitelist");
                }
                args.push("*" + arg + "*: " + valid_arguments[arg]);
            }

            methods[node.id.name] = {
                arguments: args,
                comments: [],
                returns: null,
                loc: node.loc
            };
        }

        // comment at first level!
        if (node.type == 'Block' && node.parent.type == "Program") {
            // search nearest
            var fn,
                min_diff = 9999;

            node.parent.body.every(function(subnode) {
                if (subnode.type == "FunctionDeclaration") {
                    var diff = subnode.loc.start.line - node.loc.end.line;

                    if (diff > 0 && diff < min_diff) {
                        min_diff = diff;
                        fn = subnode;
                    }
                }

                return true;

            });
            if (fn) {
                fname = fn.id.name;

                methods[fname].comments = node.value.split("\n");
            }
        }

    });
    var args;
    console.log("");
    console.log("");
    console.log("<a name=\"" + cls + "\"></a>");
    console.log("## " + cls);

    // DEFINES
    for (i in module) {
        if ("function" !== typeof module[i]) {
            if ("object" !== typeof module[i]) {
                console.log("* **" + i + "** = " + module[i]);
            }
        }
    }

    for (i in methods) {
        if (methods[i].comments.length) {
            comments = [];

            methods[i].comments.forEach(function(c) {
                if (c.indexOf("@returns") !== -1) {
                    c = c.substring(c.indexOf("{"));
                    c = c.substring(1, c.indexOf("}"));
                    methods[i].returns = c;
                } else if (c.indexOf("@see") !== -1) {
                    var line = c.trim().replace(/^\*(\s+)/, "").replace(/^\*$/, "");
                    line = line.substring(5);
                    if (line.indexOf("http") === 0) {
                        comments.push("  **link**: [" + line + "](" + line +")");
                    } else {
                        comments.push("  **see**: [" + line + "](#" + cls + "-" + line +")");
                    }
                } else if (c.indexOf("@param") !== -1) {
                    //ignore
                } else {
                    var line = c.trim().replace(/^\*(\s+)/, "").replace(/^\*$/, "");
                    if (line.length) {
                        comments.push("  " + line);
                    }
                }
            });

            methods[i].comments = comments.join("\n\n");
        }


        console.log("");
        console.log("<a name=\"" + cls + "-" + i + "\"></a>");
        if (methods[i].returns) {
            console.log("* **" + i + "** (" + methods[i].arguments.join(", ") + "): " + methods[i].returns);
        } else {
            console.log("* **" + i + "** (" + methods[i].arguments.join(", ") + ")");
        }

        if (methods[i].comments.length) {
            console.log("");
            console.log(methods[i].comments);
            console.log("");
        }
    }

}
