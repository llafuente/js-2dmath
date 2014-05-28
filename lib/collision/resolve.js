var Vec2 = require("../vec2.js"),
    vec2_scale = Vec2.scale,
    vec2_dot = Vec2.dot,
    vec2_sub = Vec2.sub,
    abs = Math.abs,
    max = Math.max,
    sqrt = Math.sqrt,
    atan2 = Math.atan2,
    cos = Math.cos,
    sin = Math.sin,
    HALF_PI = Math.HALF_PI;

var mtv_v = [0, 0];
/**
 * Keep your object outside the other
 */
function outside(out_position, out_velocity, penetration_depth, mtv) {
    vec2_scale(mtv_v, mtv, penetration_depth);
    // left-right penetration
    if (mtv_v[0] !== 0) {
        out_position[0] = mtv_v[0];
        out_velocity[0] = 0;
    }

    // up-down penetration
    if (mtv_v[1] !== 0) {
        out_position[1] = mtv_v[1];
        out_velocity[1] = max(out_velocity[1], 0);
    }
}

var aux_vec2 = [0, 0],
    col_impulse = [0, 0],
    fric_impulse = [0, 0],
    impulse = [0, 0],
    tangent_vel = [0, 0],
    rv = [0, 0];
/**
 *
 * @return {Boolean} is the velocity modified ?
 */
function linear(out_a_velocity, a_restitution, a_imass, a_point, out_b_velocity, b_restitution, b_imass, b_point, normal) {
    // Calculate relative velocity
    vec2_sub(rv, out_b_velocity, out_a_velocity);

    // Calculate relative velocity in terms of the normal direction
    var normal_vel = vec2_dot(rv, normal);

    // Do not resolve if velocities are separating
    if (normal_vel > 0) {
        return false;
    }

    // Calculate restitution
    var e = Math.min(a_restitution, b_restitution);

    // Calculate impulse scalar
    var j = -(1 + e) * normal_vel;
    j /= a_imass + b_imass;

    // Apply impulse
    Vec2.scale(col_impulse, normal, j);

    //rv - Dot( rv, normal ) * normal
    vec2_sub(tangent_vel, rv, Vec2.scale(tangent_vel, normal, normal_vel));
    Vec2.normalize(tangent_vel, tangent_vel);

    // Solve for magnitude to apply along the friction vector
    var jt = -vec2_dot(rv, tangent_vel);
    jt /= a_imass + b_imass;

    var a_sfriction = 0.2;
    var b_sfriction = 0.2;

    var a_dfriction = 0.2;
    var b_dfriction = 0.2;

    // PythagoreanSolve = A^2 + B^2 = C^2, solving for C given A and B
    // Use to approximate mu given friction coefficients of each body
    var mu = sqrt(a_sfriction * a_sfriction + b_sfriction * b_sfriction);

    // Clamp magnitude of friction and create impulse vector
    if (abs(jt) < j * mu) {
        Vec2.scale(fric_impulse, tangent_vel, jt);
    } else {
        var dynamicFriction = sqrt(a_dfriction * a_dfriction + b_dfriction * b_dfriction);
        //frictionImpulse = -j * t * dynamicFriction
        Vec2.scale(fric_impulse, tangent_vel, -jt * dynamicFriction);
    }

    Vec2.add(impulse, col_impulse, fric_impulse);

    if (a_imass !== 0) {
        vec2_sub(out_a_velocity, out_a_velocity, Vec2.scale(aux_vec2, impulse, a_imass));
    }

    if (b_imass !== 0) {
        Vec2.add(out_b_velocity, out_b_velocity, Vec2.scale(aux_vec2, impulse, b_imass));
    }


    return true;
}


/*
 * Perform a fully elastic collision between the two objects
 * @reference http://en.wikipedia.org/wiki/Elastic_collision
 * @source https://github.com/benmurrell/node-multiplayer-asteroids
 */
function elastic(a_pos, out_a_velocity, a_mass, b_pos, out_b_velocity, b_mass) {
    // Determine contact angle
    var contactAngle = atan2(a_pos[1] - b_pos[1], a_pos[0] - b_pos[0]);

    // Determine velocities after collision
    var vLeft = sqrt(out_a_velocity[0] * out_a_velocity[0] + out_a_velocity[1] * out_a_velocity[1]);
    var thetaLeft = atan2(out_a_velocity[1], out_a_velocity[0]);

    var vRight = sqrt(out_b_velocity[0] * out_b_velocity[0] + out_b_velocity[1] * out_b_velocity[1]);
    var thetaRight = atan2(out_b_velocity[1], out_b_velocity[0]);

    var lc_tca = cos(thetaLeft - contactAngle),
        rc_tca = cos(thetaRight - contactAngle),
        ls_tca = sin(thetaLeft - contactAngle),
        rs_tca = sin(thetaRight - contactAngle),
        cContactAngle = cos(contactAngle),
        sContactAngle = sin(contactAngle),
        mass_sum = (a_mass + b_mass),
        lmass_dif = (a_mass - b_mass),
        rmass_dif = (b_mass - a_mass),
        left_num = (vLeft * lc_tca * lmass_dif + 2 * b_mass * vRight * rc_tca),
        right_num = (vRight * rc_tca * rmass_dif + 2 * a_mass * vLeft * lc_tca);

    // elastic collision with mass
    out_a_velocity[0] = left_num / mass_sum * cContactAngle + vLeft * ls_tca * cos(contactAngle + HALF_PI);
    out_a_velocity[1] = left_num / mass_sum * sContactAngle + vLeft * ls_tca * sin(contactAngle + HALF_PI);

    out_b_velocity[0] = right_num / mass_sum * cContactAngle + vRight * rs_tca * cos(contactAngle + HALF_PI);
    out_b_velocity[1] = right_num / mass_sum * sContactAngle + vRight * rs_tca * sin(contactAngle + HALF_PI);
}

module.exports = {
    elastic: elastic,
    outside: outside,
    linear: linear
};
