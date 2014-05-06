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

<a name="Polygon-translate"></a>
* **translate** (*out*: Polygon, *poly*: Polygon, *vec2*: Vec2)

<a name="Polygon-rotate"></a>
* **rotate** (*out*: Polygon, *poly*: Polygon, *radians*: Number (Radians))

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
* **furthestPoint** (*out_vec2*: Vec2, *poly*: Polygon, *vec2*: Vec2)

  find support point


<a name="Polygon-furthestMinkowski"></a>
* **furthestMinkowski** (*out_vec2*: Vec2, *poly*: Polygon, *poly2*: Polygon, *vec2_dir*: Vec2)

<a name="Polygon-containsOrigin"></a>
* **containsOrigin** (*simplex*: Polygon)

<a name="Polygon-GJK"></a>
* **GJK** (*A*: Polygon, *B*: Polygon, *simplex*: Polygon)

  fix current implementation that it's buggy

  looks correct: https://github.com/juhl/collision-detection-2d


<a name="Polygon-EPA"></a>
* **EPA** (*polygon1*: Polygon, *polygon2*: Polygon, *simplex*: Polygon)