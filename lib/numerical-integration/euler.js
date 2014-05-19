var Vec2 = require("../vec2.js"),
    vec2_add = Vec2.add,
    vec2_scale = Vec2.scale,
    aux = [0, 0];

function euler(position, velocity, dt) {
    vec2_add(position, position, vec2_scale(aux, velocity, dt));
}

module.exports = euler;
