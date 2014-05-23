/**
 * Result of an intersection.
 * Use create or new, instances support instanceof Collision.Response
 *
 * * **a** first object participating
 * * **b** second object participating
 * * **aInB** Is a inside a (only SAT)
 * * **bInA** Is b inside a (only SAT)
 * * **depth** penetration amount
 * * **mtv** Minimum translate vector (**normalized**). If you subtract mtv * depth to a, there will be no collision.
 * * **normal** No used at this moment. This will be used in manifold generation.
 * * **poc** No used at this moment. Point of collision. This will be used in manifold generation.
 */
var Vec2 = require("../vec2.js"),
    vec2_scale = Vec2.scale;

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
 * equivalent to new Collision.Response()
 */
function create() {
    return new Response();
}

/**
 * Restore default values
 *
 * @param out_response {Collision.Response}
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
/**
 * Compute real mtv scaling response.mtv * response.depth
 *
 * @param response {Collision.Response}
 * @return {Vec2}
 */
function mtv(out_vec2, response) {
    vec2_scale(out_vec2, response.mtv, response.depth);
}


module.exports = Response;

Response.create = create;
Response.clear = clear;
Response.mtv = mtv;
