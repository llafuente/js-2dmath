
var falafel = require("falafel"),
    object = require("object-enhancements"),
    fs = require("fs");

var methods,
    valid_arguments,
    comments,
    common = {
        m2d:  "Matrix2D",
        circle: "Circle",
        line2: "Line2",
        vec2: "Vec2",
        out_vec2: "Vec2",
        seg2: "Segment2",
        rect: "Rectangle",
        tri: "Triangle",
        curve: "Beizer",
        bb2: "BB2",
    },
    files = {
        Vec2: {
            filename: "./lib/vec2.js",
            valid_arguments: {
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
            valid_arguments: {
                out: "Line2",
                l2: "Line2",

                offset: "Number",
                x: "Number",
                y: "Number",
                m: "Number",
                x1: "Number",
                x2: "Number",
                y1: "Number",
                y2: "Number",
                seg2: "Segment2",
                v1: "Vec2",
                v2: "Vec2",
            }
        },
        Segment2: {
            filename: "./lib/segment2.js",
            valid_arguments: {
                out: "Segment2",
                seg2_2: "Segment2",

                x1: "Number",
                x2: "Number",
                x3: "Number",
                y1: "Number",
                y2: "Number",
                y3: "Number",
            }
        },
        Rectangle: {
            filename: "./lib/rectangle.js",
            valid_arguments: {
                out: "Rectangle",
                rect: "Rectangle",
                rect2: "Rectangle",
                force: "Boolean",

                x1: "Number",
                x2: "Number",
                y1: "Number",
                y2: "Number",

                bb2: "BB2"
            }
        },
        BB2: {
            filename: "./lib/boundingbox2.js",
            valid_arguments: {
                out: "BB2",
                bb2: "BB2",
                bb2_1: "BB2",
                bb2_2: "BB2",
                l: "Number",
                b: "Number",
                r: "Number",
                t: "Number",

                vec2_offset: "Vec2",
                vec2_scale: "Vec2",
                alignament: "Number"
            }
        },
        Circle: {
            filename: "./lib/circle.js",
            valid_arguments: {
                out: "Circle",
                circle_2: "Circle",
                x: "Number",
                y: "Number",
                radius: "Number",
                inside: "Boolean",
                circumcenter: "Boolean",
            }
        },
        Matrix2D: {
            filename: "./lib/matrix2d.js",
            valid_arguments: {
                out: "Matrix2D",
                m2d_2:  "Matrix2D",

                vec2_degrees: "Vec2 (Degrees)",
                degrees: "Number (Degrees)",
                radians: "Number (Radians)",
                factor: "Number",
                x: "Number",
                y: "Number",
            }
        },
        Polygon: {
            filename: "./lib/polygon.js",
            valid_arguments: {
                out: "Polygon",
                poly:  "Polygon",
            }
        },

        Beizer: {
            filename: "./lib/beizer.js",
            valid_arguments: {
                out: "Beizer",

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
            valid_arguments: {
                out: "Triangle",

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
            valid_arguments: {
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

                line2_1: "Line2",
                line2_2: "Line2",

                seg2_1: "Segment2",
                seg2_2: "Segment2",

                circle_1: "Circle",
                circle_2: "Circle",

                bb2_1: "BB2",
                bb2_2: "BB2",

                rect1: "Rectangle",
                rect2: "Rectangle",
            }
        },
        Distance: {
            filename: "./lib/distance.js",
            valid_arguments: {
                x1: "Number",
                x2: "Number",
                x3: "Number",
                x4: "Number",
                y1: "Number",
                y2: "Number",
                y3: "Number",
                y4: "Number",




                bb2: "BB2",
                rect: "Rectangle",
            }
        },
        Transitions: {
            filename: "./lib/transitions.js",
            valid_arguments: {
                pos: "Number",
                x: "Number",
                name: "String",
                transition: "Function",
                obj: "Object",
                prop: "String",
                values: "Mixed",
                ioptions: "Object",
                params: "Object",
                options: "Object"
            }
        },
        Xorshift: {
            filename: "./lib/xorshift.js",
            valid_arguments: {
                seeds: "[, Number...]"
            }
        },
        Noise: {
            filename: "./lib/noise.js",
            valid_arguments: {
                seed: "Number"
            }
        },
    },
    src,
    mod_required;


function is_fn(node) {
    var args = [],
        arg,
        i,
        max;

    if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
        if (node.id.name[0] === "_") {
            //internal skip!
            return;
        }

        // define a new function!


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
}


var cls_list = [],
    cls,
    i;

for (cls in files) {
    cls_list.push("[" + cls + "](#" + cls + ")");

}

console.log(cls_list.join(", "));
console.log("");
console.log("");

for (cls in files) {

    methods = {};
    src = fs.readFileSync(files[cls].filename, "utf-8");

    mod_required = require(files[cls].filename);

    // test
    //src = fs.readFileSync("doc-test.js", "utf-8");

    valid_arguments = object.merge(common, files[cls].valid_arguments);

    falafel(src, {comment: true, loc: true}, function (node) {
        //console.log(node);

        var fname;

        is_fn(node);

        // comment at first level!
        if (node.type === "Block" && node.parent.type === "Program") {
            // search nearest
            var fn,
                min_diff = 9999;

            node.parent.body.every(function (subnode) {
                if (subnode.type === "FunctionDeclaration") {
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


    // DEFINES
    for (i in mod_required) {
        if ("function" === typeof mod_required[i] && !methods[i]) {
            // check if it"s an alias
            if (methods[mod_required[i].name]) {
                //alias!
                methods[i] = object.clone(methods[mod_required[i].name]);
                methods[i].comments = ["@see " + mod_required[i].name];
            } else {
                // this is for complex cases - generated code
                try {
                    falafel(mod_required[i], {comment: true, loc: true}, function (node) {
                        //console.log(node);

                        is_fn(node);
                    });
                } catch(e) {
                    methods[i] = {
                        arguments: [],
                        comments: [],
                        returns: null,
                        loc: null
                    };
                }
            }
        }
    }


    console.log("");
    console.log("");
    console.log("<a name=\"" + cls + "\"></a>");
    console.log("## " + cls);

    // DEFINES
    for (i in mod_required) {
        if ("function" !== typeof mod_required[i]) {
            if ("object" !== typeof mod_required[i]) {
                console.log("* **" + i + "** = " + mod_required[i]);
            }
        }
    }

    for (i in methods) {
        if (methods[i].comments.length) {
            comments = [];

            methods[i].comments.forEach(function (c) {
                var line;

                if (c.indexOf("@returns") !== -1) {
                    c = c.substring(c.indexOf("{"));
                    c = c.substring(1, c.indexOf("}"));
                    methods[i].returns = c;
                } else if (c.indexOf("@see") !== -1) {
                    line = c.trim().replace(/^\*(\s+)/, "").replace(/^\*$/, "");
                    line = line.substring(5);
                    if (line.indexOf("http") === 0) {
                        comments.push("  **link**: [" + line + "](" + line + ")");
                    } else {
                        comments.push("  **see**: [" + line + "](#" + cls + "-" + line + ")");
                    }
                } else if (c.indexOf("@source") !== -1) {
                    line = c.trim().replace(/^\*(\s+)/, "").replace(/^\*$/, "");
                    line = line.substring(8);
                    comments.push("  **source**: [" + line + "](" + line + ")");
                } else if (c.indexOf("@param") !== -1) {
                    //ignore
                } else {
                    line = c.trim().replace(/^\*(\s{0,1})/, "").replace(/^\*$/, "");
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
