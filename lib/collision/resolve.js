var Vec2 = require("../vec2.js"),
    abs = Math.abs,
    sqrt = Math.sqrt;

/**
 * Velocity will be modified
 *
 * @return {Boolean} is the velocity modified ?
 */
function basic(a_velocity, a_restitution, a_imass, b_velocity, b_restitution, b_imass, normal) {
    // Calculate relative velocity
    var rv = Vec2.sub([0, 0], b_velocity, a_velocity);
    console.log("relative velocity", rv);

    // Calculate relative velocity in terms of the normal direction
    var normal_vel = Vec2.dot(rv, normal);

    // Do not resolve if velocities are separating
    if (normal_vel > 0) {
        console.log("velocities are separating");
        return false;
    }

    // Calculate restitution
    var e = Math.min(a_restitution, b_restitution);
    console.log("restitution", e);

    // Calculate impulse scalar
    var j = -(1 + e) * normal_vel;
    j /= a_imass + b_imass;
    console.log("impulse scalar", j);

    // Apply impulse
    var impulse = Vec2.scale([0, 0], normal, j);
    console.log("impulse", impulse);
    Vec2.sub(a_velocity, a_velocity, Vec2.scale([0, 0], impulse, a_imass));
    Vec2.add(b_velocity, b_velocity, Vec2.scale([0, 0], impulse, b_imass));


    var tangent_vel = [0, 0];
    //rv - Dot( rv, normal ) * normal
    Vec2.sub(tangent_vel, rv, Vec2.scale(tangent_vel, normal, normal_vel));
    Vec2.normalize(tangent_vel);

    // Solve for magnitude to apply along the friction vector
    var jt = -Vec2.dot(rv, tangent_vel);
    jt /= a_imass + b_imass;

    var a_sfriction = 0.2;
    var b_sfriction = 0.2;

    var a_dfriction = 0.2;
    var b_dfriction = 0.2;

    // PythagoreanSolve = A^2 + B^2 = C^2, solving for C given A and B
    // Use to approximate mu given friction coefficients of each body
    var mu = sqrt(a_sfriction * a_sfriction + b_sfriction * b_sfriction);

    // Clamp magnitude of friction and create impulse vector
    var frictionImpulse = [0, 0];

    if (abs(jt) < j * mu) {
        frictionImpulse = Vec2.scale(tangent_vel, jt);
    } else {
        var dynamicFriction = sqrt(a_dfriction * a_dfriction + b_dfriction * b_dfriction);
        //frictionImpulse = -j * t * dynamicFriction
        frictionImpulse = Vec2.scale(tangent_vel, -jt * dynamicFriction);
    }

    Vec2.sub(a_velocity, a_velocity, Vec2.scale([0, 0], frictionImpulse, a_imass));
    Vec2.add(b_velocity, b_velocity, Vec2.scale([0, 0], frictionImpulse, b_imass));


    console.log("velocity a", a_velocity);
    console.log("velocity b", b_velocity);

    return true;
}


module.exports = {
    basic: basic
};