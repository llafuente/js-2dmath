<a name="Collision.SAT"></a>
## Collision.SAT
  Version 0.4.1 - Copyright 2014 -  Jim Riecken <jimr@jimr.ca>

  Released under the MIT License

  Adapted to js-2dmath by Luis Lafuente <llafuente@noboxout.com>

  A simple library for determining intersections of circles and polygons using the Separating Axis Theorem.

  **source**: [https://github.com/jriecken/sat-js](https://github.com/jriecken/sat-js)

  **reference**: [http://physics2d.com/content/separation-axis](http://physics2d.com/content/separation-axis)

<a name="Collision.SAT-getPointInCircle"></a>
* **getPointInCircle** (*vec2*: Vec2, *circle*: Circle): Boolean

  Check if a point is inside a circle.


<a name="Collision.SAT-getPointInPolygon"></a>
* **getPointInPolygon** (*out_response*: Collision.Response, *vec2*: Vec2, *poly*: Polygon): Boolean

  Check if a point is inside a convex polygon.


<a name="Collision.SAT-getCircleCircle"></a>
* **getCircleCircle** (*out_response*: Collision.Response, *a_circle*: Circle, *b_circle*: Circle): Boolean

  Check if two circles collide.


<a name="Collision.SAT-getPolygonCircle"></a>
* **getPolygonCircle** (*out_response*: Collision.Response, *poly_points*: Polygon, *poly_edges*: Polygon<Edges>, *poly_pos*: Vec2, *circle*: Circle): Boolean

  Check if a polygon and a circle collide.


<a name="Collision.SAT-getCirclePolygon"></a>
* **getCirclePolygon** (*out_response*: Collision.Response, *circle*: Circle, *poly*: Polygon): Boolean

  Check if a circle and a polygon collide.

  *note*: This is slightly less efficient than polygonCircle as it just runs polygonCircle and reverses everything at the end.

  *todo*: This is slightly less efficient than polygonCircle as it just runs polygonCircle and reverses everything at the end.


<a name="Collision.SAT-getPolygonPolygon"></a>
* **getPolygonPolygon** (*out_response*: Collision.Response, *a_points*: Polygon, *a_normals*: Polygon<Normals>, *a_pos*: Vec2, *b_points*: Polygon, *b_normals*: Polygon<Normals>, *b_pos*: Vec2): Boolean

  Checks whether polygons collide.
