var Vec2 = require("../vec2.js"),
    vec2_sub = Vec2.sub,
    vec2_add = Vec2.add,
    vec2_scale = Vec2.scale,
    aux = [0, 0];

function verlet(out_position, velocity, last_velocity, dt) {
    vec2_add(aux, last_velocity, velocity);
    vec2_scale(aux, aux, 0.5 * dt);

    return vec2_add(out_position, out_position, aux);
}


/**
 * maybe this implementation could be better, some test ?!
 * @source http://lonesock.net/article/verlet.html
 */
function tc_verlet(out_position, velocity, last_velocity, dt, last_dt) {
    vec2_sub(aux, velocity, last_velocity);
    vec2_scale(aux, aux, dt / last_dt);

    vec2_add(aux, velocity, aux);
    vec2_scale(aux, aux, 0.5 * dt);
    vec2_add(out_position, out_position, aux);
}

module.exports = verlet;
