var Vec2 = require("../vec2.js"),
    vec2_scale = Vec2.scale;
/**
 * ## Response
 *
 * An object representing the result of an intersection. Contains:
 *  * The two objects participating in the intersection
 *  * The Vec2 representing the minimum change necessary to extract the first object from the second one (as well as a unit Vec2 in that direction and the magnitude of the overlap)
 *  * Whether the first object is entirely inside the second, and vice versa.
 *
 * @constructor
 */
function Response() {
    this.normal = [0, 0];
    this.mtv = [0, 0];
}

Response.prototype.a = null;
Response.prototype.b = null;
Response.prototype.aInB = true;
Response.prototype.bInA = true;
Response.prototype.depth = Number.MAX_VALUE;
Response.prototype.normal = null;
Response.prototype.mtv = null;

/**
 * Set some values of the response back to their defaults.  Call this between tests if
 * you are going to reuse a single Response object for multiple intersection tests (recommented
 * as it will avoid allcating extra memory)
 *
 * @return {Response}
 */
function clear(out_response) {
    out_response.aInB = true;
    out_response.bInA = true;
    out_response.depth = Number.MAX_VALUE;

    out_response.normal[0] = 0;
    out_response.normal[1] = 0;

    out_response.mtv[0] = 0;
    out_response.mtv[1] = 0;

    return out_response;
}

function mtv(out_vec2, response) {
    vec2_scale(out_vec2, response.mtv, response.depth);
}


module.exports = {
    create: function () {
        return new Response();
    },
    clear: clear,
    mtv: mtv
};

