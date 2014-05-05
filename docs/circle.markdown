<a name="Circle"></a>
## Circle

<a name="Circle-create"></a>
* **create** (*x*: Number, *y*: Number, *radius*: Number): Circle

<a name="Circle-fromVec2"></a>
* **fromVec2** (*vec2*: Vec2, *radius*: Number): Circle

<a name="Circle-fromSegment2"></a>
* **fromSegment2** (*seg2*: Segment2): Circle

  Create a Circle with seg2 as diameter


<a name="Circle-fromRectangle"></a>
* **fromRectangle** (*rect*: Rectangle, *inside*: Boolean): Circle

<a name="Circle-fromTriangle"></a>
* **fromTriangle** (*tri*: Triangle, *inside*: Boolean, *circumcenter*: Boolean): Circle

  @todo review inside cases


<a name="Circle-clone"></a>
* **clone** (*circle*: Circle): Circle

<a name="Circle-copy"></a>
* **copy** (*out*: Circle, *circle*: Circle): Circle

<a name="Circle-translate"></a>
* **translate** (*out*: Circle, *circle*: Circle, *vec2*: Vec2): Circle

<a name="Circle-moveTo"></a>
* **moveTo** (*out*: Circle, *circle*: Circle, *vec2*: Vec2): Circle

<a name="Circle-distance"></a>
* **distance** (*circle*: Circle, *circle_2*: Circle): Number

<a name="Circle-length"></a>
* **length** (*circle*: Circle): Number

<a name="Circle-area"></a>
* **area** (*circle*: Circle): Number

<a name="Circle-isVec2Inside"></a>
* **isVec2Inside** (*circle*: Circle, *vec2*: Vec2): Boolean

<a name="Circle-closestPoint"></a>
* **closestPoint** (*out_vec2*: Vec2, *circle*: Circle, *vec2*: Vec2): Vec2

<a name="Circle-perimeter"></a>
* **perimeter** (*circle*: Circle)

  **see**: [length](#Circle-length)


<a name="Circle-move"></a>
* **move** (*out*: Circle, *circle*: Circle, *vec2*: Vec2)

  **see**: [moveTo](#Circle-moveTo)
