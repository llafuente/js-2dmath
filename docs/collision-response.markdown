<a name="Collision.Response"></a>
## Collision.Response
  Result of an intersection.

  Use create or new, instances support instanceof Collision.Response

  * **a** first object participating

  * **b** second object participating

  * **aInB** Is a inside a (only SAT)

  * **bInA** Is b inside a (only SAT)

  * **depth** penetration amount

  * **mtv** Minimum translate vector (**normalized**). If you subtract mtv * depth to a, there will be no collision.

  * **normal** No used at this moment. This will be used in manifold generation.

  * **poc** No used at this moment. Point of collision. This will be used in manifold generation.

<a name="Collision.Response-Response"></a>
* **Response** ()

<a name="Collision.Response-create"></a>
* **create** ()

  equivalent to new Collision.Response()


<a name="Collision.Response-clear"></a>
* **clear** (*out_response*: Collision.Response): Response

  Restore default values


<a name="Collision.Response-mtv"></a>
* **mtv** (*out_vec2*: Vec2, *response*: Collision.Response): Vec2

  Compute real mtv scaling response.mtv * response.depth
