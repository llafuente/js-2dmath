<a name="Polygon"></a>
## Polygon

<a name="Polygon-create"></a>
* **create** (): Polygon

  input are many Vec2(s)


<a name="Polygon-fromAABB"></a>
* **fromAABB** (*aabb2*: AABB2)

<a name="Polygon-fromRectangle"></a>
* **fromRectangle** (*rect*: Rectangle)

<a name="Polygon-fromBeizer"></a>
* **fromBeizer** (*curve*: Beizer, *npoints*: Number)

<a name="Polygon-fromCircle"></a>
* **fromCircle** (*circle*: Circle, *npoints*: Number, *start_radians*: Number)

<a name="Polygon-translate"></a>
* **translate** (*out*: Polygon, *poly*: Polygon, *vec2*: Vec2)

<a name="Polygon-rotate"></a>
* **rotate** (*out*: Polygon, *poly*: Polygon, *radians*: Number (Radians))

<a name="Polygon-edges"></a>
* **edges** (*out*: Polygon, *poly*: Polygon)

<a name="Polygon-normals"></a>
* **normals** (*out*: Polygon, *edges*: Polygon)

<a name="Polygon-centroid"></a>
* **centroid** (*out_vec2*: Vec2, *poly*: Polygon): Vec2

<a name="Polygon-recenter"></a>
* **recenter** (*out*: Polygon, *poly*: Polygon): Polygon

<a name="Polygon-area"></a>
* **area** (*poly*: Polygon): Number

<a name="Polygon-transform"></a>
* **transform** (*out*: Polygon, *poly*: Polygon, *m2d*: Matrix23)

<a name="Polygon-isVec2Inside"></a>
* **isVec2Inside** (*poly*: Polygon, *vec2*: Vec2)

<a name="Polygon-furthestPoint"></a>
* **furthestPoint** (*out_vec2*: Vec2, *poly*: Polygon, *vec2_dir*: Vec2): Number

  Compute farthest polygon point in particular direction.

  return the index in the polygon and a clone in out_vec2


<a name="Polygon-furthestMinkowski"></a>
* **furthestMinkowski** (*out_vec2*: Vec2, *poly_a*: Polygon, *poly_b*: Polygon, *vec2_dir*: Vec2)

  furthest Point in the Minkowski diff between poly_A and poly_B for a direction


<a name="Polygon-toString"></a>
* **toString** (*poly*: Polygon)