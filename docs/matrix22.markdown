<a name="Matrix22"></a>
## Matrix22
  Stability: 0 (Anything could happen)

  2x2 matrix used for rotations 2D represented as a 5 coordinates array

  [m11:Number, m12:Number, m21:Number, m22:Number, angle:Number]

  Can be used to solve 2x2 matrices problems.

<a name="Matrix22-create"></a>
* **create** (*angle*: Number): Matrix22

<a name="Matrix22-fromAngle"></a>
* **fromAngle** (*angle*: Number): Matrix22

<a name="Matrix22-fromNumbers"></a>
* **fromNumbers** (*m11*: Number, *m12*: Number, *m21*: Number, *m22*: Number): Matrix22

<a name="Matrix22-zero"></a>
* **zero** (): Matrix22

<a name="Matrix22-identity"></a>
* **identity** (): Matrix22

<a name="Matrix22-copy"></a>
* **copy** (*out*: Matrix22, *mat22*: Matrix22): Matrix22

<a name="Matrix22-solve"></a>
* **solve** (*out_vec2*: Vec2, *mat22*: Matrix22, *vec2*: Vec2): Vec2

  Solve A * x = b


<a name="Matrix22-determinant"></a>
* **determinant** (*mat22*: Matrix22): Number

<a name="Matrix22-setRotation"></a>
* **setRotation** (*out*: Matrix22, *angle*: Number): Matrix22

<a name="Matrix22-rotate"></a>
* **rotate** (*out_vec2*: Vec2, *mat22*: Matrix22, *vec2*: Vec2): Vec2

<a name="Matrix22-unrotate"></a>
* **unrotate** (*out_vec2*: Vec2, *mat22*: Matrix22, *vec2*: Vec2): Vec2

<a name="Matrix22-invert"></a>
* **invert** (*out*: Matrix22, *mat22*: Matrix22): Matrix22