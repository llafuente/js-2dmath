<a name="Collision.GJK"></a>
## Collision.GJK
  *todo*: stress test

  **source**: [https://github.com/wellcaffeinated/PhysicsJS](https://github.com/wellcaffeinated/PhysicsJS)

  **reference**: [https://github.com/felipetavares/bomberman/blob/master/web/modules/collision.js](https://github.com/felipetavares/bomberman/blob/master/web/modules/collision.js)

<a name="Collision.GJK-gjk"></a>
* **gjk** (*a_points*: Polygon, *b_points*: Polygon): Object

  Implementation of Gilbert–Johnson–Keerthi (GJK)

  For general information about GJK see:

  - [www.codezealot.org/archives/88](http://www.codezealot.org/archives/88)

  - [mollyrocket.com/849](http://mollyrocket.com/849)

  Returned object

  ```javascript

  {

    overlap: Boolean,

    simplex: Polygon,

    distance: Number,

    closest: Vec2

  }

  ```

  *todo*: fix distance


<a name="Collision.GJK-getPolygonPolygon"></a>
* **getPolygonPolygon** (*a_points*: Polygon, *b_points*: Polygon)

  **see**: [gjk](#Collision.GJK-gjk)
