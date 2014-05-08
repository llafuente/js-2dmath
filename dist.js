var falafel = require("falafel"),
    object = require("object-enhancements"),
    fs = require("fs");

var methods,
    valid_arguments,
    comments,
    common = require("./config.json").docs.arguments,
    files = require("./config.json").components,
    src,
    mod_required;

function isAssertCall(node) {
    return node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "assert";
}

function isComment(node) {
    return node.type === "Block" && node.parent.type === "Program";
}

function isFunction(node) {
    return node.type === "FunctionDeclaration" && node.id && node.id.name;
}

function getArguments(node, white_list) {
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
            if (!white_list[arg]) {
                console.log(node);
                throw new Error(files[cls].filename + ":" + arg + " is an invalid argument name, not in whitelist");
            }
            args.push({name: arg, type: white_list[arg]});
        }
    }

    return args;
}

function parse_comments(list) {
    var comments = [];

    list.forEach(function (c) {
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
        } else if (c.indexOf("@reference") !== -1) {
            line = c.trim().replace(/^\*(\s+)/, "").replace(/^\*$/, "");
            line = line.substring(11);
            comments.push("  **reference**: [" + line + "](" + line + ")");
        } else if (c.indexOf("@param") !== -1) {
            //ignore
        } else {
            line = c.trim().replace(/^\*(\s{0,1})/, "").replace(/^\*$/, "");
            if (line.length) {
                comments.push("  " + line);
            }
        }
    });

    return comments.join("\n\n");
}

function create_number_validator(post_str) {
    post_str = post_str || "";
    return "if (%var%" + post_str + " == undefined) { console.log(%var%); throw new Error('%var%" + post_str + " is undefined/null'); }\n" +
           "if (Number.isNaN(%var%" + post_str + ")) { console.log(%var%); throw new Error('%var%" + post_str + " is nan'); }\n";
}


var validators = {
    "Number": create_number_validator()
};

validators.Vec2 = [0, 1].map(function (i) {return create_number_validator("[" + i + "]"); }).join("\n");

validators.Matrix23 = [0, 1, 2, 3, 4, 5].map(function (i) {return create_number_validator("[" + i + "]"); }).join("\n");

validators.Matrix22 = [0, 1, 2, 3].map(function (i) {return create_number_validator("[" + i + "]"); }).join("\n");

validators.AABB2 = validators.Segment2 = validators.Matrix22;

validators.Rectangle = [0, 1].map(function (i) {
    return [0, 1].map(function (j) {
        return create_number_validator("[" + i + "][" + j + "]");
    }).join("\n");
}).join("\n");

validators.Triangle = [0, 1, 2].map(function (i) {
    return [0, 1].map(function (j) {
        return create_number_validator("[" + i + "][" + j + "]");
    }).join("\n");
}).join("\n");


var cls_list = [],
    cls,
    i,
    description;

for (cls in files) {
    cls_list.push("[" + cls + "](#" + cls + ")");

}

function isFileDesccription(node) {
    return node.loc.start.line === 1;
}

function getNearestFunction(node) {
    // search nearest function
    var fn = null,
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

    return fn;
}


for (cls in files) {

    console.log("* [" + cls + "](https://github.com/llafuente/js-2dmath/blob/master/" + files[cls].doc_file.replace("./", "") + ")");
    console.log("");

    description = null;

    methods = {};
    src = fs.readFileSync(files[cls].filename, "utf-8");

    mod_required = require(files[cls].filename);

    // test
    //src = fs.readFileSync("doc-test.js", "utf-8");

    valid_arguments = object.merge(common, files[cls].valid_arguments);

    //
    // - documentation
    //
    falafel(src, {comment: true, loc: true}, function (node) {
        //console.log(node);

        if (isFunction(node) && node.id.name[0] != "_") {
            methods[node.id.name] = {
                arguments: getArguments(node, valid_arguments),
                comments: [],
                returns: null,
                loc: node.loc
            };
        }

        if (isComment(node)) {
            if (isFileDesccription(node)) {
                description = node.value.split("\n");
            } else {

                var fn = getNearestFunction(node);

                if (fn) {
                    methods[fn.id.name].comments = node.value.split("\n");
                }
            }
        }
    });

    //
    // - debug
    //
    var output = falafel(src, function (node) {
        // anti-nan
        if (isFunction(node)) {
            var args = getArguments(node, valid_arguments),
                fn_txt = node.body.source().trim().substring(1),
                validations = [],
                i;

            for (i in args) {
                if (validators[args[i].type] && args[i].name.indexOf("out") !== 0) {
                    validations.push(validators[args[i].type].replace(/\%var\%/g, args[i].name));
                }
            }

            node.body.update("{\n" + validations.join("\n") + fn_txt);
        }
    });

    fs.writeFileSync(files[cls].debug_file, output, "utf-8");

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

                        isFunction(node);
                    });
                } catch (e) {
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

    var contents = [],
        i;
    contents.push("<a name=\"" + cls + "\"></a>");
    contents.push("## " + cls);

    if (description) {
        contents.push(parse_comments(description));
    }

    // DEFINES
    for (i in mod_required) {
        if ("function" !== typeof mod_required[i]) {
            if ("object" !== typeof mod_required[i]) {
                contents.push("* **" + i + "** = " + mod_required[i]);
            }
        }
    }

    for (i in methods) {
        if (methods[i].comments.length) {
            methods[i].comments = parse_comments(methods[i].comments);
        }

        contents.push("");
        contents.push("<a name=\"" + cls + "-" + i + "\"></a>");


        if (!methods[i].arguments) {
            console.log(i);
            console.log(methods[i]);
            process.exit();
        }

        var args_str = methods[i].arguments.map(function (a) {
            return "*" + a.name + "*: " + a.type;
        }).join(", ");

        if (methods[i].returns) {
            contents.push("* **" + i + "** (" + args_str + "): " + methods[i].returns);
        } else {
            contents.push("* **" + i + "** (" + args_str + ")");
        }

        if (methods[i].comments.length) {
            contents.push("");
            contents.push(methods[i].comments);
            contents.push("");
        }
    }

    fs.writeFileSync(files[cls].doc_file, contents.join("\n"), "utf-8");
}
