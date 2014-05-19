<a name="AABB2"></a>
## AABB2
  Stability: 1 (Only additions & fixes)

  BoundingBox2 is represented as a 5 coordinates array

  [left: Number, bottom: Number, right: Number, top: Number, normalized: Boolean]
* **TOPLEFT** = 1
* **TOPMIDDLE** = 2
* **TOPRIGHT** = 3
* **CENTERLEFT** = 4
* **CENTER** = 5
* **CENTERRIGHT** = 6
* **BOTTOMLEFT** = 7
* **BOTTOM** = 8
* **BOTTOMRIGHT** = 9

<a name="AABB2-create"></a>
* **create** (*l*: Number, *b*: Number, *r*: Number, *t*: Number): AABB2

<a name="AABB2-fromAABB2Division"></a>
* **fromAABB2Division** (*aabb2*: AABB2, *x*: Number, *y*: Number): Array<AABB2>

<a name="AABB2-fromSegment2"></a>
* **fromSegment2** (*seg2*: Segment2): AABB2

<a name="AABB2-fromCircle"></a>
* **fromCircle** (*circle*: Circle): AABB2

<a name="AABB2-fromRectangle"></a>
* **fromRectangle** (*rect*: Rectangle): AABB2

<a name="AABB2-fromBeizer"></a>
* **fromBeizer** (*beizer*: Beizer, *npoints*: Number): AABB2

  *todo*: implement a more robust / fast algorithm http://stackoverflow.com/questions/2587751/an-algorithm-to-find-bounding-box-of-closed-bezier-curves (Timo answer)

  **reference**: [http://jsfiddle.net/4VCVX/3/](http://jsfiddle.net/4VCVX/3/)


<a name="AABB2-zero"></a>
* **zero** (): AABB2

<a name="AABB2-clone"></a>
* **clone** (*aabb2*: AABB2): AABB2

<a name="AABB2-copy"></a>
* **copy** (*out*: AABB2, *aabb2*: AABB2): AABB2

<a name="AABB2-expand"></a>
* **expand** (*out*: AABB2, *aabb2*: AABB2, *margin*: Number): AABB2

<a name="AABB2-merge"></a>
* **merge** (*out*: AABB2, *aabb2_1*: AABB2, *aabb2_2*: AABB2): AABB2

<a name="AABB2-offsetMerge"></a>
* **offsetMerge** (*out*: AABB2, *aabb2_1*: AABB2, *aabb2_2*: AABB2, *vec2_offset*: Vec2): AABB2

<a name="AABB2-osMerge"></a>
* **osMerge** (*out*: AABB2, *aabb2_1*: AABB2, *aabb2_2*: AABB2, *vec2_offset*: Vec2, *vec2_scale*: Vec2): AABB2

  offset & scale merge


<a name="AABB2-area"></a>
* **area** (*aabb2*: AABB2): Number

<a name="AABB2-normalize"></a>
* **normalize** (*out*: AABB2, *aabb2*: AABB2): AABB2

<a name="AABB2-translate"></a>
* **translate** (*out*: AABB2, *aabb2*: AABB2, *vec2*: Vec2): AABB2

<a name="AABB2-clampVec"></a>
* **clampVec** (*out_vec2*: Vec2, *aabb2*: AABB2, *vec2*: Vec2): Vec2

<a name="AABB2-center"></a>
* **center** (*out_vec2*: Vec2, *aabb2*: AABB2)

<a name="AABB2-align"></a>
* **align** (*out_vec2*: Vec2, *aabb2*: AABB2, *alignament*: Number): Vec2

  alignament values: AABB2.TOPLEFT, AABB2.TOPMIDDLE, AABB2.TOPRIGHT, AABB2.CENTERLEFT, AABB2.CENTER, AABB2.CENTERRIGHT, AABB2.BOTTOMLEFT, AABB2.BOTTOM, AABB2.BOTTOMRIGH


<a name="AABB2-isVec2Inside"></a>
* **isVec2Inside** (*aabb2*: AABB2, *vec2*: Vec2): Boolean

<a name="AABB2-isAABB2Inside"></a>
* **isAABB2Inside** (*aabb2*: AABB2, *aabb2_2*: AABB2): Boolean

<a name="AABB2-perimeter"></a>
* **perimeter** (*aabb2*: AABB2): Number

<a name="AABB2-contains"></a>
* **contains** (*aabb2*: AABB2, *aabb2_2*: AABB2)

  **see**: [isAABB2Inside](#AABB2-isAABB2Inside)
