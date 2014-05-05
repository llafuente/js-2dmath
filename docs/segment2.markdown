

<a name="Segment2"></a>
## Segment2
  Segment2 is represented by a 4 coordinates array

  [x1, y1, x2, y2] normalized so x1 < x2

<a name="Segment2-create"></a>
* **create** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number): Segment2

<a name="Segment2-normalize"></a>
* **normalize** (*out*: Segment2, *seg2*: Segment2): Segment2

<a name="Segment2-clone"></a>
* **clone** (*seg2*: Segment2): Segment2

<a name="Segment2-copy"></a>
* **copy** (*out*: Segment2, *seg2*: Segment2): Segment2

<a name="Segment2-translate"></a>
* **translate** (*out*: Segment2, *seg2*: Segment2, *vec2*: Vec2): Segment2

<a name="Segment2-length"></a>
* **length** (*seg2*: Segment2): Number

<a name="Segment2-sqrLength"></a>
* **sqrLength** (*seg2*: Segment2): Number

<a name="Segment2-midPoint"></a>
* **midPoint** (*out_vec2*: Vec2, *seg2*: Segment2): Vec2

<a name="Segment2-slope"></a>
* **slope** (*seg2*: Segment2): Number

<a name="Segment2-angle"></a>
* **angle** (*seg2*: Segment2): Number

<a name="Segment2-cross"></a>
* **cross** (*seg2*: Segment2, *vec2*: Vec2): Number

<a name="Segment2-isCollinear"></a>
* **isCollinear** (*seg2*: Segment2, *vec2*: Vec2): Boolean

<a name="Segment2-isParallel"></a>
* **isParallel** (*seg2*: Segment2, *seg2_2*: Segment2): Boolean

  @todo do it!


<a name="Segment2-isVec2Inside"></a>
* **isVec2Inside** (*seg2*: Segment2, *vec2*: Vec2): Boolean

<a name="Segment2-isAbove"></a>
* **isAbove** (*seg2*: Segment2, *vec2*: Vec2, *cached_seg2_min_angle*: Number): Boolean

<a name="Segment2-leftNormal"></a>
* **leftNormal** (*out_vec2*: Vec2, *seg2*: Segment2): Vec2

<a name="Segment2-rightNormal"></a>
* **rightNormal** (*out_vec2*: Vec2, *seg2*: Segment2): Vec2

<a name="Segment2-closestPoint"></a>
* **closestPoint** (*out_vec2*: Vec2, *seg2*: Segment2, *vec2*: Vec2): Vec2

<a name="Segment2-$closestPoint"></a>
* **$closestPoint** (*out_vec2*: Vec2, *x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *x3*: Number, *y3*: Number): Vec2

  @todo optimize, "inline the if/else"


<a name="Segment2-$collinear"></a>
* **$collinear** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *x3*: Number, *y3*: Number): Boolean

<a name="Segment2-$inside"></a>
* **$inside** (*x1*: Number, *x2*: Number, *y1*: Number, *y2*: Number, *x3*: Number, *y3*: Number): Boolean

<a name="Segment2-lengthSq"></a>
* **lengthSq** (*seg2*: Segment2)

  **see**: [sqrLength](#Segment2-sqrLength)


<a name="Segment2-contains"></a>
* **contains** (*seg2*: Segment2, *vec2*: Vec2)

  **see**: [isVec2Inside](#Segment2-isVec2Inside)
