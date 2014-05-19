<a name="Collision.Resolve"></a>
## Collision.Resolve

<a name="Collision.Resolve-outside"></a>
* **outside** (*out_position*: Vec2, *out_velocity*: Vec2, *penetration*: Number, *normal*: Vec2, *vector*: Vec2)

<a name="Collision.Resolve-linear"></a>
* **linear** (*out_a_velocity*: Vec2, *a_restitution*: Number, *a_imass*: Number, *a_point*: Vec2, *out_b_velocity*: Vec2, *b_restitution*: Number, *b_imass*: Number, *b_point*: Vec2, *normal*: Vec2): Boolean

<a name="Collision.Resolve-elastic"></a>
* **elastic** (*a_pos*: Vec2, *out_a_velocity*: Vec2, *a_mass*: Number, *b_pos*: Vec2, *out_b_velocity*: Vec2, *b_mass*: Number)

  Perform a fully elastic collision between the two objects

  **reference**: [http://en.wikipedia.org/wiki/Elastic_collision](http://en.wikipedia.org/wiki/Elastic_collision)

  **source**: [https://github.com/benmurrell/node-multiplayer-asteroids](https://github.com/benmurrell/node-multiplayer-asteroids)
