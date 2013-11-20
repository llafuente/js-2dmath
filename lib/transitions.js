var exp;
(exp = function () {
    "use strict";

    if ("undefined" !== typeof module) {
        require("array-enhancements");
    }

    var pow = Math.pow,
        sin = Math.sin,
        acos = Math.acos,
        cos = Math.cos,
        PI = Math.PI,
        t = {
            Pow: function (p, x) {
                return pow(p, (x && x[0]) || 6);
            },
            Expo: function (p) {
                return pow(2, 8 * (p - 1));
            },
            Circ: function (p) {
                return 1 - sin(acos(p));
            },
            Sine: function (p) {
                return 1 - cos(p * PI / 2);
            },
            Back: function (p, x) {
                x = (x && x[0]) || 1.618;
                return pow(p, 2) * ((x + 1) * p - x);
            },
            Bounce: function (p) {
                var value, a, b;
                for (a = 0, b = 1; true; a += b, b /= 2) {
                    if (p >= (7 - 4 * a) / 11) {
                        value = b * b - pow((11 - 6 * a - 11 * p) / 4, 2);
                        break;
                    }
                }
                return value;
            },
            Elastic: function (p, x) {
                return pow(2, 10 * --p) * cos(20 * p * PI * ((x && x[0]) || 1) / 3);
            }
        },
        k,
        Transitions = {},
        CHAIN = 1,
        STOP = 2,
        IGNORE = 3,
        CANCEL = 4;

    Transitions.linear = function (zero) {
        return zero;
    };

    Transitions.create = function (name, transition) {

        Transitions[name] = function (pos) {
            return transition(pos);
        };

        Transitions[name + "In"] = Transitions[name];

        Transitions[name + "Out"] = function (pos) {
            return 1 - transition(1 - pos);
        };

        Transitions[name + "InOut"] = function (pos) {
            return (pos <= 0.5 ? transition(2 * pos) : (2 - transition(2 * (1 - pos)))) / 2;
        };

    };

    for (k in t) {
        Transitions.create(k, t[k]);
    }

    ['Quad', 'Cubic', 'Quart', 'Quint'].forEach(function (transition, i) {
        Transitions.create(transition, function (p) {
            return pow(p, i + 2);
        });
    });

    // tween function

    function def_render(obj, prop, value) {
        obj[prop] = value;
    }

    function def_parser(obj, prop) {
        return parseFloat(obj[prop]);
    }

    function def_factor(k0, k1, rfactor) {
        return ((k1 - k0) * rfactor) + k0;
    }

    Transitions.LINK = {};
    Transitions.LINK.CHAIN  = CHAIN;
    Transitions.LINK.STOP   = STOP;
    Transitions.LINK.IGNORE = IGNORE;
    Transitions.LINK.CANCEL = CANCEL;

    function normalize(obj, input) {
        //get all props

        var keys = Object.keys(input).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }),
            kk,
            i,
            j,
            prop,
            key,
            fkey,
            prop_list = [],
            props = {},
            last;

        for (i = 0; i < keys.length; ++i) {
            prop_list = Array.add(prop_list, Object.keys(input[keys[i]]));
        }
        prop_list = Array.unique(prop_list);

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
     * @param {Object} obj must be writable or at least have defined $__tween
     * @param {String} prop property name to animate
     * @param {Object} values keys are numbers from 0 to 100, values could be anything
     * @param {Object} options defined as
     *   * mandatory
     *     time: <number> in ms
     *   * optional
     *     transition: Transition.XXX, or a valid compatible function Default: linear
     *     link: Transisition.LINK.XXX Default: CHAIN
     *     render: function(obj, property, new_value) {}
     *     parser: function(obj, property) { return <value>; }
     *     tickEvent: <string> event name Default: "tick"
     *     endEvent: <string> event name Default: "animation:end"
     *     startEvent: <string> event name Default: "animation:star"
     *     chainEvent: <string> event name Default: "animation:chain"
     *
     */
    Transitions.animate = function (obj, prop, values, ioptions) {
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
                render: ioptions.render || def_render,
                parser: ioptions.parser || def_parser,
                applyFactor: ioptions.applyFactor || def_factor,
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
    };

    /**
     *
     */
    Transitions.tween = function (obj, params, options) {
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
        options.render = options.render || def_render;
        options.parser = options.parser || def_parser;
        options.transition = options.transition || Transitions.linear;
        options.link = options.link || CHAIN;
        options.tick = options.tick || "tick";

        // set config
        obj.$__tween = obj.$__tween || {};

        var plist = normalize(obj, params),
            i;

        // animate each property
        for (i in plist) {
            Transitions.animate(obj, i, plist[i], options);
        }

    };


    return Transitions;

}());


if ("undefined" === typeof module) {
    window.Transitions = exp;
} else {
    module.exports = exp;
}