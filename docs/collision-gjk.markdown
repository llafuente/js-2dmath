<a name="Collision.GJK"></a>
## Collision.GJK
  Copyright (c) 2013 Jasper Palfree http://wellcaffeinated.net/PhysicsJS/

  Adapted and optimized by Luis Lafuente <llafuente@noboxout.com>

  *todo*: stress test

  **source**: [https://github.com/wellcaffeinated/PhysicsJS](https://github.com/wellcaffeinated/PhysicsJS)

  **reference**: [https://github.com/felipetavares/bomberman/blob/master/web/modules/collision.js](https://github.com/felipetavares/bomberman/blob/master/web/modules/collision.js)

  **reference**: [http://www.codezealot.org/archives/88](http://www.codezealot.org/archives/88)

  **reference**: [http://mollyrocket.com/849](http://mollyrocket.com/849)

<a name="Collision.GJK-getPolygonPolygon"></a>
* **getPolygonPolygon** (*a_points*: Polygon, *b_points*: Polygon): Object

  Implementation of Gilbert–Johnson–Keerthi (GJK)

  Returned object

  ```javascript

  {

    overlap: Boolean,

    simplex: Polygon,

    distance: Number,

    closest: Vec2

  }

  ```

  *todo*: distance seem to be not 100% right
