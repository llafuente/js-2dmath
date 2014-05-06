<a name="Line2"></a>
## Line2

<a name="Line2-create"></a>
* **create** (*x*: Number, *y*: Number, *m*: Number): Line2

  Point-Slope Equation of a Line: y - y1 = m(x - x1)


<a name="Line2-zero"></a>
* **zero** (): Line2

<a name="Line2-fromVec2"></a>
* **fromVec2** (*v1*: Vec2, *v2*: Vec2): Line2

<a name="Line2-from2Points"></a>
* **from2Points** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number): Line2

<a name="Line2-fromSegment2"></a>
* **fromSegment2** (*seg2*: Segment2): Line2

<a name="Line2-copy"></a>
* **copy** (*out*: Line2, *line2*: Line2): Line2

<a name="Line2-clone"></a>
* **clone** (*line2*: Line2): Line2

<a name="Line2-add"></a>
* **add** (*out*: Line2, *line2*: Line2, *v1*: Vec2): Line2

<a name="Line2-subtract"></a>
* **subtract** (*out*: Line2, *line2*: Line2, *v1*: Vec2): Line2

<a name="Line2-offset"></a>
* **offset** (*out*: Line2, *line2*: Line2, *offset*: Number): Line2

<a name="Line2-rotate"></a>
* **rotate** (*out*: Line2, *line2*: Line2, *radians*: Number (Radians)): Line2

<a name="Line2-closetPoint"></a>
* **closetPoint** (*out_vec2*: Vec2, *line2*: Line2, *vec2*: Vec2)

  @todo

  **source**: [http://mathcentral.uregina.ca/QQ/database/QQ.09.04/carly1.html](http://mathcentral.uregina.ca/QQ/database/QQ.09.04/carly1.html)


<a name="Line2-isVec2Inside"></a>
* **isVec2Inside** (*line2*: Line2, *vec2*: Vec2): Boolean

  Over the line, has near check to avoid floating point errors.


<a name="Line2-translate"></a>
* **translate** (*out*: Line2, *line2*: Line2, *v1*: Vec2)

  **see**: [add](#Line2-add)


<a name="Line2-sub"></a>
* **sub** (*out*: Line2, *line2*: Line2, *v1*: Vec2)

  **see**: [subtract](#Line2-subtract)
