

<a name="Beizer"></a>
## Beizer

<a name="Beizer-cubic"></a>
* **cubic** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number, *cp3x*: Number, *cp3y*: Number): Beizer

  cp0 - start point

  cp1 - start control point

  cp2 - end control point

  cp3 - end


<a name="Beizer-cubicFrom3Points"></a>
* **cubicFrom3Points** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number)

  Figure 21.2

  http://pomax.github.io/bezierinfo/


<a name="Beizer-quadric"></a>
* **quadric** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number): Beizer

<a name="Beizer-quadricFrom3Points"></a>
* **quadricFrom3Points** (*cp0x*: Number, *cp0y*: Number, *cp1x*: Number, *cp1y*: Number, *cp2x*: Number, *cp2y*: Number)

  Figure 21.1

  http://pomax.github.io/bezierinfo/


<a name="Beizer-get"></a>
* **get** (*out_vec2*: Vec2, *curve*: Beizer, *t*: Number): Vec2

<a name="Beizer-getPoints"></a>
* **getPoints** (*curve*: Beizer, *npoints*: Number): Array

<a name="Beizer-length"></a>
* **length** (*curve*: Beizer, *step*: Number): Number

  Calculate the curve length by incrementally solving the curve every substep=CAAT.Curve.k. This value defaults

  to .05 so at least 20 iterations will be performed.

  @todo some kind of cache maybe it's needed!
