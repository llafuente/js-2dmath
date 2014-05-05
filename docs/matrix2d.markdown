

<a name="Matrix2D"></a>
## Matrix2D
  2x3 Transformation matrix used in 2D represented as a 8 coordinates array

  [m11:Number, m12:Number, m13:Number, m21:Number, m22:Number, m23:Number, **cache**, nomalize:boolean]

  cache = [xScale:Number, yScale:Number, xSkew:Number, yScale:Number, rotation:Number]

  why cache? to speed up many operations avoiding tan/atan2/sqrt

<a name="Matrix2D-create"></a>
* **create** (): Matrix2D

  Creates a new identity 2x3 matrix


<a name="Matrix2D-fromPoints"></a>
* **fromPoints** (): Matrix2D

  Creates a new matrix given 4 points(a Rectangle)

  @todo

  **link**: [http://jsfiddle.net/dFrHS/1/](http://jsfiddle.net/dFrHS/1/)


<a name="Matrix2D-fromAngle"></a>
* **fromAngle** (): Matrix2D

  Creates a new matrix given 4 points(a Rectangle)

  @todo

  **link**: [http://jsfiddle.net/dFrHS/1/](http://jsfiddle.net/dFrHS/1/)


<a name="Matrix2D-copy"></a>
* **copy** (*out*: Matrix2D, *m2d*: Matrix2D): Matrix2D

  Copy m2d into out


<a name="Matrix2D-identity"></a>
* **identity** (*out*: Matrix2D): Matrix2D

  Copy m2d into out


<a name="Matrix2D-dRotate"></a>
* **dRotate** (*out*: Matrix2D, *m2d*: Matrix2D, *degrees*: Number (Degrees)): Matrix2D

  Rotates a Matrix2D by the given angle in degrees(increment rotation)

  @note increment rotation


<a name="Matrix2D-rotate"></a>
* **rotate** (*out*: Matrix2D, *m2d*: Matrix2D, *radians*: Number (Radians)): Matrix2D

  Rotates a Matrix2D by the given angle in radians(increment rotation)

  @note increment rotation


<a name="Matrix2D-dRotation"></a>
* **dRotation** (*out*: Matrix2D, *m2d*: Matrix2D, *degrees*: Number (Degrees)): Matrix2D

  Set rotation of a Matrix2D by the given angle in degrees(set rotation)

  @note set rotation


<a name="Matrix2D-rotation"></a>
* **rotation** (*out*: Matrix2D, *m2d*: Matrix2D, *radians*: Number (Radians)): Matrix2D

  Set rotation of a Matrix2D by the given angle in radians(set rotation)

  @note set rotation


<a name="Matrix2D-translate"></a>
* **translate** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Translates given Matrix2D by the dimensions in the given vec2

  @note This translation is affected by rotation/skew

  @note increment position

  **see**: [gTranslate](#Matrix2D-gTranslate)


<a name="Matrix2D-gTranslate"></a>
* **gTranslate** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Translates given Matrix2D by the dimensions in the given vec2

  @note This translation is NOT affected by rotation/skew

  @note increment position

  **see**: [translate](#Matrix2D-translate)


<a name="Matrix2D-position"></a>
* **position** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Set Matrix2D position

  @note This translation is NOT affected by rotation/skew

  @note set position

  **see**: [gTranslate](#Matrix2D-gTranslate)

  **see**: [translate](#Matrix2D-translate)


<a name="Matrix2D-scale"></a>
* **scale** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Scales the Matrix2D by the dimensions in the given vec2

  @note incremental scale

  @note do not affect position

  **see**: [scalation](#Matrix2D-scalation)


<a name="Matrix2D-scalation"></a>
* **scalation** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Set the Matrix2D scale by the dimensions in the given vec2

  @note set scale

  @note do not affect position

  **see**: [scale](#Matrix2D-scale)


<a name="Matrix2D-dSkewX"></a>
* **dSkewX** (*out*: Matrix2D, *m2d*: Matrix2D, *degrees*: Number (Degrees)): Matrix2D

  Increment the Matrix2D x-skew by given degrees

  @note increment skewX

  **see**: [skewX](#Matrix2D-skewX)


<a name="Matrix2D-skewX"></a>
* **skewX** (*out*: Matrix2D, *m2d*: Matrix2D, *radians*: Number (Radians)): Matrix2D

  Increment the Matrix2D x-skew by given radians

  @note increment skewX


<a name="Matrix2D-dSkewY"></a>
* **dSkewY** (*out*: Matrix2D, *m2d*: Matrix2D, *degrees*: Number (Degrees)): Matrix2D

  Increment the Matrix2D y-skew by given degrees

  @note increment skewY


<a name="Matrix2D-skewY"></a>
* **skewY** (*out*: Matrix2D, *m2d*: Matrix2D, *radians*: Number (Radians)): Matrix2D

  Increment the Matrix2D y-skew by given radians

  @note increment skewY


<a name="Matrix2D-dSkew"></a>
* **dSkew** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2_degrees*: Vec2 (Degrees)): Matrix2D

  Increment the Matrix2D skew y by given degrees in vec2_degrees

  @note increment skew

  **see**: [dSetSkew](#Matrix2D-dSetSkew)


<a name="Matrix2D-skew"></a>
* **skew** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Increment the Matrix2D skew y by given radians in vec2

  @note increment skew


<a name="Matrix2D-dSetSkew"></a>
* **dSetSkew** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2_degrees*: Vec2 (Degrees)): Matrix2D

  Set the Matrix2D skew y by given degrees in vec2_degrees

  @note set skew

  **see**: [setSkew](#Matrix2D-setSkew)


<a name="Matrix2D-setSkew"></a>
* **setSkew** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2): Matrix2D

  Set the Matrix2D skew y by given radians in vec2

  @note set skew


<a name="Matrix2D-multiply"></a>
* **multiply** (*out*: Matrix2D, *m2d*: Matrix2D, *m2d_2*: Matrix2D): Matrix2D

  Multiplies two Matrix2D's


<a name="Matrix2D-multiplyVec2"></a>
* **multiplyVec2** (*out_vec2*: Vec2, *m2d*: Matrix2D, *vec2*: Vec2): Vec2

  Multiplies a Matrix2D and a Vec2


<a name="Matrix2D-getPosition"></a>
* **getPosition** (*out_vec2*: Vec2, *m2d*: Matrix2D): Vec2

  Retrieve current position as Vec2


<a name="Matrix2D-getScale"></a>
* **getScale** (*out_vec2*: Vec2, *m2d*: Matrix2D): Vec2

  Retrieve current scale as Vec2


<a name="Matrix2D-getSkew"></a>
* **getSkew** (*out_vec2*: Vec2, *m2d*: Matrix2D): Vec2

  Retrieve current skew as Vec2


<a name="Matrix2D-reflect"></a>
* **reflect** (*out*: Matrix2D, *m2d*: Matrix2D): Matrix2D

  Alias of rotate 180º(PI)


<a name="Matrix2D-inverse"></a>
* **inverse** (*out*: Matrix2D, *m2d*: Matrix2D)

  @TODO this a transformation matrix, what inverse means for us, mirror ?


<a name="Matrix2D-transpose"></a>
* **transpose** (*out*: Matrix2D, *m2d*: Matrix2D)

  @TODO needed ?


<a name="Matrix2D-determinant"></a>
* **determinant** (*out*: Matrix2D, *m2d*: Matrix2D)

  @TODO review & test


<a name="Matrix2D-translationMatrix"></a>
* **translationMatrix** (*x*: Number, *y*: Number): Matrix2D

  Returns a 3x2 2D column-major translation matrix for x and y.


<a name="Matrix2D-dSkewXMatrix"></a>
* **dSkewXMatrix** (*degrees*: Number (Degrees)): Matrix2D

  Returns a 3x2 2D column-major y-skew matrix for the given degrees.


<a name="Matrix2D-skewXMatrix"></a>
* **skewXMatrix** (*radians*: Number (Radians)): Matrix2D

  Returns a 3x2 2D column-major y-skew matrix for the given radians.


<a name="Matrix2D-dSkewYMatrix"></a>
* **dSkewYMatrix** (*degrees*: Number (Degrees)): Matrix2D

  Returns a 3x2 2D column-major y-skew matrix for the given degrees.


<a name="Matrix2D-skewYMatrix"></a>
* **skewYMatrix** (*radians*: Number (Radians)): Matrix2D

  Returns a 3x2 2D column-major y-skew matrix for the given radians.


<a name="Matrix2D-rotationMatrix"></a>
* **rotationMatrix** (*radians*: Number (Radians)): Matrix2D

  Returns a 3x2 2D column-major y-skew matrix for the given radians.


<a name="Matrix2D-scalingMatrix"></a>
* **scalingMatrix** (*x*: Number, *y*: Number)

  Returns a 3x2 2D column-major scaling matrix for sx and sy.


<a name="Matrix2D-interpolate"></a>
* **interpolate** (*out*: Matrix2D, *m2d*: Matrix2D, *m2d_2*: Matrix2D, *factor*: Number)

  Interpolate two matrixes by given factor.

  Used in conjunction with Transitions and you will have nice transformations :)


<a name="Matrix2D-toAngle"></a>
* **toAngle** (*m2d*: Matrix2D)

  For completeness because it's not need in the current implementation m2d[6][4]


<a name="Matrix2D-dSetRotation"></a>
* **dSetRotation** (*out*: Matrix2D, *m2d*: Matrix2D, *degrees*: Number (Degrees))

  **see**: [dRotation](#Matrix2D-dRotation)


<a name="Matrix2D-setRotation"></a>
* **setRotation** (*out*: Matrix2D, *m2d*: Matrix2D, *radians*: Number (Radians))

  **see**: [rotation](#Matrix2D-rotation)


<a name="Matrix2D-setPosition"></a>
* **setPosition** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2)

  **see**: [position](#Matrix2D-position)


<a name="Matrix2D-setScale"></a>
* **setScale** (*out*: Matrix2D, *m2d*: Matrix2D, *vec2*: Vec2)

  **see**: [scalation](#Matrix2D-scalation)
