var array = require("array-enhancements"),
    pow = Math.pow,
    sin = Math.sin,
    acos = Math.acos,
    cos = Math.cos,
    PI = Math.PI,
    t = {
    },
    k,
    Transitions = {},
    CHAIN = 1,
    STOP = 2,
    IGNORE = 3,
    CANCEL = 4;


function Pow(pos, x) {
    return pow(pos, (x && x[0]) || 6);
}

function Expo(pos) {
    return pow(2, 8 * (pos - 1));
}

function Circ(pos) {
    return 1 - sin(acos(pos));
}

function Sine(pos) {
    return 1 - cos(pos * PI / 2);
}

function Back(pos, x) {
    x = (x && x[0]) || 1.618;
    return pow(pos, 2) * ((x + 1) * pos - x);
}

function Bounce(pos) {
    var value, a, b;
    for (a = 0, b = 1; true; a += b, b /= 2) {
        if (pos >= (7 - 4 * a) / 11) {
            value = b * b - pow((11 - 6 * a - 11 * pos) / 4, 2);
            break;
        }
    }
    return value;
}

function Elastic(pos, x) {
    return pow(2, 10 * --pos) * cos(20 * pos * PI * ((x && x[0]) || 1) / 3);
}



/**
 * Just return what you sent
 */
function linear(pos) {
    return pos;
}

/**
 * Wrap your transaction with In/Out/InOut modifiers.
 */
function create(name, transition) {

    //Transitions[name] = function (pos) {
    //    return transition(pos);
    //};
    //Transitions[name + "In"] = Transitions[name];

    Transitions[name] = transition;

    Transitions[name + "In"] = transition;

    Transitions[name + "Out"] = function (pos) {
        return 1 - transition(1 - pos);
    };

    Transitions[name + "InOut"] = function (pos) {
        return (pos <= 0.5 ? transition(2 * pos) : (2 - transition(2 * (1 - pos)))) / 2;
    };
}

t = {
    Pow: Pow,
    Expo: Expo,
    Circ: Circ,
    Sine: Sine,
    Back: Back,
    Bounce: Bounce,
    Elastic: Elastic
};

for (k in t) {
    create(k, t[k]);
}

["Quad", "Cubic", "Quart", "Quint"].forEach(function (transition, i) {
    create(transition, function (p) {
        return pow(p, i + 2);
    });
});

// tween function

function _def_render(obj, prop, value) {
    obj[prop] = value;
}

function _def_parser(obj, prop) {
    return parseFloat(obj[prop], 10);
}

function _def_factor(k0, k1, rfactor) {
    return ((k1 - k0) * rfactor) + k0;
}

Transitions.LINK_CHAIN  = CHAIN;
Transitions.LINK_STOP   = STOP;
Transitions.LINK_IGNORE = IGNORE;
Transitions.LINK_CANCEL = CANCEL;

function _normalize(obj, input) {
    //get all props

    var keys = Object.keys(input).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }),
        i,
        j,
        prop,
        key,
        fkey,
        prop_list = [],
        props = {},
        last;

    for (i = 0; i < keys.length; ++i) {
        prop_list = array.add(prop_list, Object.keys(input[keys[i]]));
    }
    prop_list = array.unique(prop_list);

    for (j = 0; j < prop_list.length; ++j) {
        prop = prop_list[j];
        props[prop] = {};

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            fkey = parseFloat(keys[i]);

            // first of the sorted list and is not 0%
            // set current value
            if (i === 0 && key !== "0%") {
                props[prop][0] = obj[prop];
            }

            if (input[key][prop] !== undefined) {
                props[prop][fkey] = last = input[key][prop];
            }
        }

        // check that has 100% if not set the last known value
        if (props[prop]["100"] === undefined) {
            props[prop][100] = last;
        }

    }

    return props;
}

/**
 * Animate object properties.
 *
 * *obj* must be writable or at least have defined $__tween
 * *prop* property name to animate
 * *values* keys are numbers from 0 to 100, values could be anything
 * *ioptions*
 * **mandatory**
 *   * **time**: <number> in ms
 *
 * **optional**
 *   * **transition** Transition.XXX, or a valid compatible function Default: linear
 *   * **link** Transition.LINK_XXX Default: CHAIN
 *   * **render** function(obj, property, new_value) {}
 *   * **parser** function(obj, property) { return <value>; }
 *   * **tickEvent** <string> event name Default: "tick"
 *   * **endEvent** <string> event name Default: "animation:end"
 *   * **startEvent** <string> event name Default: "animation:star"
 *   * **chainEvent** <string> event name Default: "animation:chain"
 *
 */
function animate(obj, prop, values, ioptions) {
    // lazy init
    obj.$__tween = obj.$__tween || {};

    //console.log("options", JSON.stringify(options), JSON.stringify(values));
    // <debug>
    if ("function" !== typeof obj.on) {
        throw new Error("obj must be an event-emitter");
    }
    if ("function" !== typeof obj.removeListener) {
        throw new Error("obj must be an event-emitter");
    }
    if ("number" !== typeof ioptions.time) {
        throw new Error("options.time is mandatory");
    }
    // </debug>

        //soft clone and defaults
    var options = {
            render: ioptions.render || _def_render,
            parser: ioptions.parser || _def_parser,
            applyFactor: ioptions.applyFactor || _def_factor,
            transition: ioptions.transition || Transitions.linear,
            link: ioptions.link || CHAIN,
            tickEvent: ioptions.tickEvent || "tick",
            endEvent: ioptions.endEvent || "animation:end",
            startEvent: ioptions.startEvent || "animation:start", // first emit
            chainEvent: ioptions.chainEvent || "animation:chain",
            time: ioptions.time,
            start: Date.now(),
            current: 0
        },
        chain_fn,
        kvalues = Object.keys(values),
        fvalues = kvalues.map(function (val) { return parseFloat(val) * 0.01; }),
        update_fn;

    //console.log("options", JSON.stringify(options), JSON.stringify(values));

    update_fn = function (delta) {
        //console.log(prop, "tween @", delta, options, values);
        if (!delta) {
            throw new Error("trace");
        }
        options.current += delta;



        var factor = options.current / options.time,
            tr_factor,
            i,
            found = false,
            max = kvalues.length,
            k0,
            k1,
            rfactor;

        //clamp
        if (factor > 1) { // end
            factor = 1;
            tr_factor = 1;
        } else {
            tr_factor = options.transition(factor);
        }

        for (i = 0; i < max && !found; ++i) {
            k0 = fvalues[i];
            if (k0 <= tr_factor) {
                if (i === max - 1) {
                    // last element
                    found = true;
                    k0 = fvalues[i - 1];
                    k1 = fvalues[i];
                } else {
                    k1 = fvalues[i + 1];

                    if (k1 > tr_factor) {
                        found = true;
                    }
                }


                if (found === true) {
                    //console.log(prop, "ko", k0, "k1", k1);
                    //console.log(prop, tr_factor);

                    if (tr_factor === 1) {
                        options.render(obj, prop, values["100"]);

                        // this is the end, my only friend, the end...
                        obj.removeListener(options.tickEvent, obj.$__tween[prop]);
                        delete obj.$__tween[prop];
                        obj.emit(options.endEvent, options);
                    } else {
                        rfactor = (tr_factor - k0) / (k1 - k0);
                        //console.log(prop, i, rfactor);

                        //console.log(prop, rfactor, "k0", values[k0], "k1", values[k1]);

                        options.render(obj, prop,
                            options.applyFactor(values[kvalues[i]], values[kvalues[i + 1]], rfactor)
                            );
                    }
                }
            }
        }
    };

    if (obj.$__tween[prop]) {
        // link will told us what to do!
        switch (options.link) {
        case IGNORE:
            return IGNORE;
        case CHAIN:

            chain_fn = function () {
                if (!obj.$__tween[prop]) {
                    obj.$__tween[prop] = update_fn;
                    obj.on(options.tickEvent, obj.$__tween[prop]);
                    obj.removeListener(options.endEvent, chain_fn);
                }
            };

            obj.on(options.endEvent, chain_fn);
            obj.emit(options.chainEvent, options);

            return CHAIN;
        case STOP:
            obj.removeListener(options.tickEvent, obj.$__tween[prop]);
            delete obj.$__tween[prop];

            return STOP;
        case CANCEL:
            obj.removeListener(options.tickEvent, obj.$__tween[prop]);
            delete obj.$__tween[prop];
            // and attach!

            obj.$__tween[prop] = update_fn;
            obj.on(options.tickEvent, obj.$__tween[prop]);
            break;
        }
    } else {
        obj.$__tween[prop] = update_fn;
        obj.on(options.tickEvent, obj.$__tween[prop]);
    }



    return true;
}

/**
 *
 */
function tween(obj, params, options) {
    // <debug>
    if (!params.hasOwnProperty("100%")) {
        throw new Error("100% params must exists");
    }

    if ("function" !== typeof obj.on) {
        throw new Error("obj must be an event-emitter");
    }
    if ("function" !== typeof obj.removeListener) {
        throw new Error("obj must be an event-emitter");
    }
    if ("number" !== typeof options.time) {
        throw new Error("options.time is mandatory");
    }
    // </debug>

    options = options || {};
    // set defaults
    options.render = options.render || _def_render;
    options.parser = options.parser || _def_parser;
    options.transition = options.transition || Transitions.linear;
    options.link = options.link || CHAIN;
    options.tick = options.tick || "tick";

    // set config
    obj.$__tween = obj.$__tween || {};

    var plist = _normalize(obj, params),
        i;

    // animate each property
    for (i in plist) {
        Transitions.animate(obj, i, plist[i], options);
    }

}


Transitions.tween = tween;
Transitions.animate = animate;
Transitions.linear = linear;
Transitions.create = create;

module.exports = Transitions;