<a name="Triangle"></a>
## Triangle
  Stability: 2 (fixes / performance improvements)

  Triangle is represented as a three coordinates array

  [A:Vec2, B:Vec2, C:Vec2]

<a name="Triangle-create"></a>
* **create** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *x3*: Number, *y3*: Number): Triangle

  A(x1, y1), B(x2, y2), C(x3, y3)


<a name="Triangle-abMidPoint"></a>
* **abMidPoint** (*out_vec2*: Vec2, *tri*: Triangle): Vec2

<a name="Triangle-bcMidPoint"></a>
* **bcMidPoint** (*out_vec2*: Vec2, *tri*: Triangle): Vec2

<a name="Triangle-caMidPoint"></a>
* **caMidPoint** (*out_vec2*: Vec2, *tri*: Triangle): Vec2

<a name="Triangle-midTriangle"></a>
* **midTriangle** (*out*: Triangle, *tri*: Triangle): Triangle

<a name="Triangle-perimeter"></a>
* **perimeter** (*tri*: Triangle): Number

<a name="Triangle-zero"></a>
* **zero** (): Triangle

<a name="Triangle-clone"></a>
* **clone** (*tri*: Triangle): Triangle

<a name="Triangle-copy"></a>
* **copy** (*out*: Triangle, *tri*: Triangle): Triangle

<a name="Triangle-centroid"></a>
* **centroid** (*out_vec2*: Vec2, *tri*: Triangle): Vec2

<a name="Triangle-incenter"></a>
* **incenter** (*out_vec2*: Vec2, *tri*: Triangle): Vec2

<a name="Triangle-circumcenter"></a>
* **circumcenter** (*out_vec2*: Vec2, *tri*: Triangle): Vec2

<a name="Triangle-area"></a>
* **area** (*tri*: Triangle): Number

<a name="Triangle-translate"></a>
* **translate** (*out*: Triangle, *tri*: Triangle, *vec2*: Vec2): Triangle

<a name="Triangle-isVec2Inside"></a>
* **isVec2Inside** (*tri*: Triangle, *vec2*: Vec2): Boolean

<a name="Triangle-center"></a>
* **center** (*out_vec2*: Vec2, *tri*: Triangle)

  **see**: [centroid](#Triangle-centroid)
