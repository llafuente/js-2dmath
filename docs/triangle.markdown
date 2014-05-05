

<a name="Triangle"></a>
## Triangle

<a name="Triangle-create"></a>
* **create** (*x1*: Number, *y1*: Number, *x2*: Number, *y2*: Number, *x3*: Number, *y3*: Number): Triangle

  A, B, C


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

<a name="Triangle-center"></a>
* **center** (*out_vec2*: Vec2, *tri*: Triangle)

  **see**: [centroid](#Triangle-centroid)
