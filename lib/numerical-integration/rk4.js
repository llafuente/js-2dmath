/**
 * Runge–Kutta 4
 *
 * @reference http://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 * @reference http://www.gaffer.org/articles
 * @source https://github.com/wellcaffeinated/PhysicsJS/blob/master/src/integrators/verlet.js
 * @source http://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
 * @source http://doswa.com/2009/01/02/fourth-order-runge-kutta-numerical-integration.html
 */

var k = 10;
var b = 1;

/**
* @param {Number} x position
* @param {Number} v velocity
* @param {Number} ni_mass negated inverse of mass (-1/m)
* @param {Number} stiffness
* @param {Number} damping
* @param {Number} dt
* @param {Number} hdt dt * 0.5
* @param {Number} idt dt / 0.5
* @return {Array} [new_position, new_velocity]
*/
function rk4(x, v, ni_mass, stiffness, damping, dt, hdt, idt) {
  // Returns final (position, velocity) array after time dt has passed.
  //        x: initial position
  //        v: initial velocity
  //        a: acceleration function a(x,v,dt) (must be callable)
  //        dt: timestep
  var x1 = x;
  var v1 = v;
  var a1 = (stiffness * x1 + damping * v1) * ni_mass;

  var x2 = x + v1 * hdt;
  var v2 = v + a1 * hdt;
  var a2 = -(stiffness * x2 + damping * v2) * ni_mass;

  var x3 = x + v2 * hdt;
  var v3 = v + a2 * hdt;
  var a3 = (stiffness * x3 + damping * v3) * ni_mass;

  var x4 = x + v3 * dt;
  var v4 = v + a3 * dt;
  var a4 = (stiffness * x4 + damping * v4) * ni_mass;

  var xf = x + idt * (v1 + 2 * (v2 + v3) + v4);
  var vf = v + idt * (a1 + 2 * (a2 + a3) + a4);

  return [xf, vf];
}
/*
var ts = 0;
var max_ts = 50;
var dt = 0.1;
var state = [100, 0];
var stiffness = 1;
var damping = 0;

var interval = setInterval(function () {
    ts+=dt;

    state = rk4(state[0], state[1], -1, stiffness, damping, dt, dt * 0.5, dt * 0.166666667);

    console.log(state[0].toFixed(2), state[1].toFixed(2));
    //console.log(state2.position.toFixed(2), " - ", state2.velocity.toFixed(2));
    //console.log();

    if (ts > max_ts) {
        clearInterval(interval);
    }

}, dt * 10);
*/

// node lib/integrators.js > output.dat && gnuplot -e "set term png; set output 'printme.png'; set zeroaxis; plot 'output.dat' using 1:2 with lines; set term x11" && firefox printme.png


module.exports = rk4;