<a name="Matrix23"></a>
## Matrix23
  Stability: 1 (Only additions & fixes)

  2x3 Transformation matrix used in 2D represented as a 8 coordinates array

  [m11:Number, m12:Number, m13:Number, m21:Number, m22:Number, m23:Number, **cache**:Array(5), dirty:Boolean]

  cache = [xScale:Number, yScale:Number, xSkew:Number, yScale:Number, rotation:Number]

  why cache? Speed improvements in exchange of memory to avoid tan/atan2/sqrt.

  why dirty? Matrix.transform could be expensive with large polygons, keep track of this variable to transform only when necessary.

<a name="Matrix23-create"></a>
* **create** (): Matrix23

  Creates a new identity 2x3 matrix


<a name="Matrix23-fromPoints"></a>
* **fromPoints** (): Matrix23

  Creates a new matrix given 4 points(a Rectangle)

  **see**: [http://jsfiddle.net/dFrHS/1/](#Matrix23-http://jsfiddle.net/dFrHS/1/)


<a name="Matrix23-fromAngle"></a>
* **fromAngle** (): Matrix23

  Creates a new matrix given 4 points(a Rectangle)

  **see**: [http://jsfiddle.net/dFrHS/1/](#Matrix23-http://jsfiddle.net/dFrHS/1/)


<a name="Matrix23-copy"></a>
* **copy** (*out*: Matrix23, *m2d*: Matrix23): Matrix23

  Copy m2d into out


<a name="Matrix23-identity"></a>
* **identity** (*out*: Matrix23): Matrix23

  Copy m2d into out


<a name="Matrix23-dRotate"></a>
* **dRotate** (*out*: Matrix23, *m2d*: Matrix23, *degrees*: Number (Degrees)): Matrix23

  Rotates a Matrix23 by the given angle in degrees(increment rotation)

  *note*: increment rotation

  *todo*: increment rotation


<a name="Matrix23-rotate"></a>
* **rotate** (*out*: Matrix23, *m2d*: Matrix23, *radians*: Number (Radians)): Matrix23

  Rotates a Matrix23 by the given angle in radians(increment rotation)

  *note*: increment rotation

  *todo*: increment rotation


<a name="Matrix23-dRotation"></a>
* **dRotation** (*out*: Matrix23, *m2d*: Matrix23, *degrees*: Number (Degrees)): Matrix23

  Set rotation of a Matrix23 by the given angle in degrees(set rotation)

  *note*: set rotation

  *todo*: set rotation


<a name="Matrix23-rotation"></a>
* **rotation** (*out*: Matrix23, *m2d*: Matrix23, *radians*: Number (Radians)): Matrix23

  Set rotation of a Matrix23 by the given angle in radians(set rotation)

  *note*: set rotation

  *todo*: set rotation


<a name="Matrix23-translate"></a>
* **translate** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Translates given Matrix23 by the dimensions in the given vec2

  *note*: This translation is affected by rotation/skew

  *todo*: This translation is affected by rotation/skew

  *note*: increment position

  *todo*: increment position

  **see**: [gTranslate](#Matrix23-gTranslate)


<a name="Matrix23-gTranslate"></a>
* **gTranslate** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Translates given Matrix23 by the dimensions in the given vec2

  *note*: This translation is NOT affected by rotation/skew

  *todo*: This translation is NOT affected by rotation/skew

  *note*: increment position

  *todo*: increment position

  **see**: [translate](#Matrix23-translate)


<a name="Matrix23-position"></a>
* **position** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Set Matrix23 position

  *note*: This translation is NOT affected by rotation/skew

  *todo*: This translation is NOT affected by rotation/skew

  *note*: set position

  *todo*: set position

  **see**: [gTranslate](#Matrix23-gTranslate)

  **see**: [translate](#Matrix23-translate)


<a name="Matrix23-scale"></a>
* **scale** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Scales the Matrix23 by the dimensions in the given vec2

  *note*: incremental scale

  *todo*: incremental scale

  *note*: do not affect position

  *todo*: do not affect position

  **see**: [scalation](#Matrix23-scalation)


<a name="Matrix23-scalation"></a>
* **scalation** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Set the Matrix23 scale by the dimensions in the given vec2

  *note*: set scale

  *todo*: set scale

  *note*: do not affect position

  *todo*: do not affect position

  **see**: [scale](#Matrix23-scale)


<a name="Matrix23-dSkewX"></a>
* **dSkewX** (*out*: Matrix23, *m2d*: Matrix23, *degrees*: Number (Degrees)): Matrix23

  Increment the Matrix23 x-skew by given degrees

  *note*: increment skewX

  *todo*: increment skewX

  **see**: [skewX](#Matrix23-skewX)


<a name="Matrix23-skewX"></a>
* **skewX** (*out*: Matrix23, *m2d*: Matrix23, *radians*: Number (Radians)): Matrix23

  Increment the Matrix23 x-skew by given radians

  *note*: increment skewX

  *todo*: increment skewX


<a name="Matrix23-dSkewY"></a>
* **dSkewY** (*out*: Matrix23, *m2d*: Matrix23, *degrees*: Number (Degrees)): Matrix23

  Increment the Matrix23 y-skew by given degrees

  *note*: increment skewY

  *todo*: increment skewY


<a name="Matrix23-skewY"></a>
* **skewY** (*out*: Matrix23, *m2d*: Matrix23, *radians*: Number (Radians)): Matrix23

  Increment the Matrix23 y-skew by given radians

  *note*: increment skewY

  *todo*: increment skewY


<a name="Matrix23-dSkew"></a>
* **dSkew** (*out*: Matrix23, *m2d*: Matrix23, *vec2_degrees*: Vec2 (Degrees)): Matrix23

  Increment the Matrix23 skew y by given degrees in vec2_degrees

  *note*: increment skew

  *todo*: increment skew

  **see**: [dSetSkew](#Matrix23-dSetSkew)


<a name="Matrix23-skew"></a>
* **skew** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Increment the Matrix23 skew y by given radians in vec2

  *note*: increment skew

  *todo*: increment skew


<a name="Matrix23-dSetSkew"></a>
* **dSetSkew** (*out*: Matrix23, *m2d*: Matrix23, *vec2_degrees*: Vec2 (Degrees)): Matrix23

  Set the Matrix23 skew y by given degrees in vec2_degrees

  *note*: set skew

  *todo*: set skew

  **see**: [setSkew](#Matrix23-setSkew)


<a name="Matrix23-setSkew"></a>
* **setSkew** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2): Matrix23

  Set the Matrix23 skew y by given radians in vec2

  *note*: set skew

  *todo*: set skew


<a name="Matrix23-multiply"></a>
* **multiply** (*out*: Matrix23, *m2d*: Matrix23, *m2d_2*: Matrix23): Matrix23

  Multiplies two Matrix23's


<a name="Matrix23-multiplyVec2"></a>
* **multiplyVec2** (*out_vec2*: Vec2, *m2d*: Matrix23, *vec2*: Vec2): Vec2

  Multiplies a Matrix23 and a Vec2


<a name="Matrix23-getPosition"></a>
* **getPosition** (*out_vec2*: Vec2, *m2d*: Matrix23): Vec2

  Retrieve current position as Vec2


<a name="Matrix23-getScale"></a>
* **getScale** (*out_vec2*: Vec2, *m2d*: Matrix23): Vec2

  Retrieve current scale as Vec2


<a name="Matrix23-getSkew"></a>
* **getSkew** (*out_vec2*: Vec2, *m2d*: Matrix23): Vec2

  Retrieve current skew as Vec2


<a name="Matrix23-reflect"></a>
* **reflect** (*out*: Matrix23, *m2d*: Matrix23): Matrix23

  Alias of rotate 180º(PI)


<a name="Matrix23-inverse"></a>
* **inverse** (*out*: Matrix23, *m2d*: Matrix23)

  *todo*: this a transformation matrix, what inverse means for us, mirror ?


<a name="Matrix23-transpose"></a>
* **transpose** (*out*: Matrix23, *m2d*: Matrix23)

  *todo*: needed ?


<a name="Matrix23-determinant"></a>
* **determinant** (*out*: Matrix23, *m2d*: Matrix23)

  *todo*: review & test


<a name="Matrix23-translationMatrix"></a>
* **translationMatrix** (*x*: Number, *y*: Number): Matrix23

  Returns a 3x2 2D column-major translation matrix for x and y.


<a name="Matrix23-dSkewXMatrix"></a>
* **dSkewXMatrix** (*degrees*: Number (Degrees)): Matrix23

  Returns a 3x2 2D column-major y-skew matrix for the given degrees.


<a name="Matrix23-skewXMatrix"></a>
* **skewXMatrix** (*radians*: Number (Radians)): Matrix23

  Returns a 3x2 2D column-major y-skew matrix for the given radians.


<a name="Matrix23-dSkewYMatrix"></a>
* **dSkewYMatrix** (*degrees*: Number (Degrees)): Matrix23

  Returns a 3x2 2D column-major y-skew matrix for the given degrees.


<a name="Matrix23-skewYMatrix"></a>
* **skewYMatrix** (*radians*: Number (Radians)): Matrix23

  Returns a 3x2 2D column-major y-skew matrix for the given radians.


<a name="Matrix23-rotationMatrix"></a>
* **rotationMatrix** (*radians*: Number (Radians)): Matrix23

  Returns a 3x2 2D column-major y-skew matrix for the given radians.


<a name="Matrix23-scalingMatrix"></a>
* **scalingMatrix** (*x*: Number, *y*: Number)

  Returns a 3x2 2D column-major scaling matrix for sx and sy.


<a name="Matrix23-interpolate"></a>
* **interpolate** (*out*: Matrix23, *m2d*: Matrix23, *m2d_2*: Matrix23, *factor*: Number)

  Interpolate two matrixes by given factor.

  Used in conjunction with Transitions and you will have nice transformations :)


<a name="Matrix23-toAngle"></a>
* **toAngle** (*m2d*: Matrix23)

  For completeness because it's not need in the current implementation m2d[6][4]


<a name="Matrix23-transform"></a>
* **transform** (*out_vec2*: Vec2, *m2d*: Matrix23, *vec2*: Vec2)

<a name="Matrix23-dSetRotation"></a>
* **dSetRotation** (*out*: Matrix23, *m2d*: Matrix23, *degrees*: Number (Degrees))

  **see**: [dRotation](#Matrix23-dRotation)


<a name="Matrix23-setRotation"></a>
* **setRotation** (*out*: Matrix23, *m2d*: Matrix23, *radians*: Number (Radians))

  **see**: [rotation](#Matrix23-rotation)


<a name="Matrix23-setPosition"></a>
* **setPosition** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2)

  **see**: [position](#Matrix23-position)


<a name="Matrix23-setScale"></a>
* **setScale** (*out*: Matrix23, *m2d*: Matrix23, *vec2*: Vec2)

  **see**: [scalation](#Matrix23-scalation)
