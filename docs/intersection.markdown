<a name="Intersection"></a>
## Intersection
* **OUTSIDE** = 1
* **PARALLEL** = 2
* **COLLIDE** = 8
* **INSIDE** = 4
* **COINCIDENT** = 16
* **TANGENT** = 32

<a name="Intersection-near"></a>
* **near** (*num*: Number, *num2*: Number): Boolean

<a name="Intersection-$rectangle_rectangle"></a>
* **$rectangle_rectangle** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *x3*: Number, *y3*: Number, *x4*: Number, *y4*: Number, *collision*: Boolean, *distance*: Boolean)

  x1 < x3

  *todo*: distance

  *todo*: segment collision, maybe using segment-segment collision, this could slow down things!


<a name="Intersection-$rectangle_vec2"></a>
* **$rectangle_vec2** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *x3*: Number, *y3*: Number, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-$circle_segment2"></a>
* **$circle_segment2** (*cx*: Number, *cy*: Number, *r*: Number, *x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-$circle_rectangle"></a>
* **$circle_rectangle** (*cx*: Number, *cy*: Number, *r*: Number, *x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-bb2_bb2"></a>
* **bb2_bb2** (*bb2_1*: AABB2, *bb2_2*: AABB2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-bb2_vec2"></a>
* **bb2_vec2** (*bb2*: AABB2, *vec2*: Vec2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-vec2_bb2"></a>
* **vec2_bb2** (*vec2*: Vec2, *bb2*: AABB2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-rectangle_rectangle"></a>
* **rectangle_rectangle** (*rect1*: Rectangle, *rect2*: Rectangle, *collision*: Boolean, *distance*: Boolean)

  *todo*: segments of collision


<a name="Intersection-bb2_rectangle"></a>
* **bb2_rectangle** (*bb2*: AABB2, *rect*: Rectangle, *collision*: Boolean, *distance*: Boolean)

  *todo*: segments of collision


<a name="Intersection-rectangle_bb2"></a>
* **rectangle_bb2** (*rect*: Rectangle, *bb2*: AABB2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-rectangle_vec2"></a>
* **rectangle_vec2** (*rect*: Rectangle, *vec2*: Vec2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-vec2_rectangle"></a>
* **vec2_rectangle** (*vec2*: Vec2, *rect*: Rectangle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-circle_vec2"></a>
* **circle_vec2** (*circle*: Circle, *vec2*: Vec2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-vec2_circle"></a>
* **vec2_circle** (*vec2*: Vec2, *circle*: Circle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-circle_circle"></a>
* **circle_circle** (*a_circle*: Circle, *b_circle*: Circle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-circle_bb2"></a>
* **circle_bb2** (*circle*: Circle, *bb2*: AABB2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-bb2_circle"></a>
* **bb2_circle** (*bb2*: AABB2, *circle*: Circle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-circle_rectangle"></a>
* **circle_rectangle** (*circle*: Circle, *rect*: Rectangle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-rectangle_circle"></a>
* **rectangle_circle** (*rect*: Rectangle, *circle*: Circle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-circle_segment2"></a>
* **circle_segment2** (*circle*: Circle, *seg2*: Segment2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-segment2_circle"></a>
* **segment2_circle** (*seg2*: Segment2, *circle*: Circle, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-line2_line2"></a>
* **line2_line2** (*line2_1*: Line2, *line2_2*: Line2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-segment2_segment2"></a>
* **segment2_segment2** (*seg2_1*: Segment2, *seg2_2*: Segment2, *collision*: Boolean, *distance*: Boolean)

<a name="Intersection-segment2_vec2"></a>
* **segment2_vec2** (*seg2*: Segment2, *vec2*: Vec2)

<a name="Intersection-vec2_segment2"></a>
* **vec2_segment2** (*vec2*: Vec2, *seg2*: Segment2)

<a name="Intersection-polygon_polygon"></a>
* **polygon_polygon** (*a_poly*: Polygon, *b_poly*: Polygon)

  *todo*: this is just a fast-code-version, no optimization no for real-time
