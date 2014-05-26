<a name="Beizer"></a>
## Beizer
  Stability: 1 (Only additions & fixes)

  **reference**: [http://pomax.github.io/bezierinfo/](http://pomax.github.io/bezierinfo/)

  **reference**: [https://github.com/jackcviers/Degrafa/blob/master/Degrafa/com/degrafa/geometry/utilities/BezierUtils.as](https://github.com/jackcviers/Degrafa/blob/master/Degrafa/com/degrafa/geometry/utilities/BezierUtils.as)

  **reference**: [http://cagd.cs.byu.edu/~557/text/ch7.pdf](http://cagd.cs.byu.edu/~557/text/ch7.pdf)

  **reference**: [http://algorithmist.wordpress.com/2009/02/02/degrafa-closest-point-on-quad-bezier/](http://algorithmist.wordpress.com/2009/02/02/degrafa-closest-point-on-quad-bezier/)

  **reference**: [http://algorithmist.wordpress.com/2009/01/26/degrafa-bezierutils-class/](http://algorithmist.wordpress.com/2009/01/26/degrafa-bezierutils-class/)

<a name="Beizer-cubic"></a>
* **cubic** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number, *cp3x*: Number, *cp3y*: Number): Beizer

  cp0 - start point

  cp1 - start control point

  cp2 - end control point

  cp3 - end


<a name="Beizer-from3Points"></a>
* **from3Points** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number)

  Figure 21.2

  http://pomax.github.io/bezierinfo/

  *todo*: DO IT!


<a name="Beizer-quadric"></a>
* **quadric** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number): Beizer

<a name="Beizer-quadricFrom3Points"></a>
* **quadricFrom3Points** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number)

  Figure 21.1

  **reference**: [http://pomax.github.io/bezierinfo/](http://pomax.github.io/bezierinfo/)


<a name="Beizer-solve"></a>
* **solve** (*out_vec2*: Vec2, *curve*: Beizer, *t*: Number): Vec2

  Solves the curve (quadric or cubic) for any given parameter t.

  **source**: [https://github.com/hyperandroid/CAAT/blob/master/src/Math/Bezier.js](https://github.com/hyperandroid/CAAT/blob/master/src/Math/Bezier.js)


<a name="Beizer-getPoints"></a>
* **getPoints** (*curve*: Beizer, *npoints*: Number): Array

  **see**: [Polygon.fromBeizer](#Beizer-Polygon.fromBeizer)


<a name="Beizer-length"></a>
* **length** (*curve*: Beizer, *step*: Number)

  Calculate the curve length by incrementally solving the curve every substep=CAAT.Curve.k. This value defaults

  to .05 so at least 20 iterations will be performed.

  *todo*: some kind of cache maybe it's needed!
