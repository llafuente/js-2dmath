<a name="Polygon"></a>
## Polygon

<a name="Polygon-create"></a>
* **create** (): Polygon

  input are many Vec2(s)


<a name="Polygon-createConvexHull"></a>
* **createConvexHull** (*vec2_list*: Array(&lt;Vec2&gt;))

  Create the convex hull using the Gift wrapping algorithm

  **source**: [https://github.com/juhl/collision-detection-2d/blob/master/util.js](https://github.com/juhl/collision-detection-2d/blob/master/util.js)

  **reference**: [http://en.wikipedia.org/wiki/Gift_wrapping_algorithm](http://en.wikipedia.org/wiki/Gift_wrapping_algorithm)

  **reference**: [http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain)


<a name="Polygon-fromAABB"></a>
* **fromAABB** (*aabb2*: AABB2)

<a name="Polygon-fromRectangle"></a>
* **fromRectangle** (*rect*: Rectangle)

<a name="Polygon-fromBeizer"></a>
* **fromBeizer** (*curve*: Beizer, *npoints*: Number)

  Create a polygon, the polygon is a line

  *todo*: extrude this line


<a name="Polygon-fromCircle"></a>
* **fromCircle** (*circle*: Circle, *npoints*: Number, *start_radians*: Number)

  Create a polygon from a circle

  start_radians rotate the given polygon


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

  Return the index in the polygon and a clone in out_vec2


<a name="Polygon-furthestMinkowski"></a>
* **furthestMinkowski** (*out_vec2*: Vec2, *poly_a*: Polygon, *poly_b*: Polygon, *vec2_dir*: Vec2): Vec2

  furthest Point in the Minkowski diff between poly_A and poly_B for a direction


<a name="Polygon-MinkowskiDifference"></a>
* **MinkowskiDifference** (*poly_a*: Polygon, *poly_b*: Polygon): Polygon

  Calculate Minkowski Difference


<a name="Polygon-momentOfInertia"></a>
* **momentOfInertia** (*poly*: Polygon, *mass*: Number)

  **source**: [http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/](http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/)

  **source**: [http://www.physicsforums.com/showthread.php?t=25293&page=2&pp=15](http://www.physicsforums.com/showthread.php?t=25293&page=2&pp=15)


<a name="Polygon-isConvex"></a>
* **isConvex** (*poly*: Polygon)

  **source**: [http://paulbourke.net/geometry/polygonmesh/](http://paulbourke.net/geometry/polygonmesh/)


<a name="Polygon-toString"></a>
* **toString** (*poly*: Polygon)