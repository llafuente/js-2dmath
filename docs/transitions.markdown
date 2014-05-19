<a name="Transitions"></a>
## Transitions
  Stability: 2 (fixes / performance improvements)

  *todo*: expand all function, do not generate with loops
* **LINK_CHAIN** = 1
* **LINK_STOP** = 2
* **LINK_IGNORE** = 3
* **LINK_CANCEL** = 4

<a name="Transitions-Pow"></a>
* **Pow** (*pos*: Number, *x*: Number)

<a name="Transitions-Expo"></a>
* **Expo** (*pos*: Number)

<a name="Transitions-Circ"></a>
* **Circ** (*pos*: Number)

<a name="Transitions-Sine"></a>
* **Sine** (*pos*: Number)

<a name="Transitions-Back"></a>
* **Back** (*pos*: Number, *x*: Number)

<a name="Transitions-Bounce"></a>
* **Bounce** (*pos*: Number)

<a name="Transitions-Elastic"></a>
* **Elastic** (*pos*: Number, *x*: Number)

<a name="Transitions-linear"></a>
* **linear** (*pos*: Number)

  Just return what you sent


<a name="Transitions-create"></a>
* **create** (*name*: String, *transition*: Function)

  Wrap your transaction with In/Out/InOut modifiers.


<a name="Transitions-animate"></a>
* **animate** (*obj*: Object, *prop*: String, *values*: Mixed, *ioptions*: Object)

  Animate object properties.

  *obj* must be writable or at least have defined $__tween

  *prop* property name to animate

  *values* keys are numbers from 0 to 100, values could be anything

  *ioptions*

  **mandatory**

    * **time**: <number> in ms

  **optional**

    * **transition** Transition.XXX, or a valid compatible function Default: linear

    * **link** Transition.LINK_XXX Default: CHAIN

    * **render** function(obj, property, new_value) {}

    * **parser** function(obj, property) { return <value>; }

    * **tickEvent** <string> event name Default: "tick"

    * **endEvent** <string> event name Default: "animation:end"

    * **startEvent** <string> event name Default: "animation:star"

    * **chainEvent** <string> event name Default: "animation:chain"


<a name="Transitions-tween"></a>
* **tween** (*obj*: Object, *params*: Object, *options*: Object)

<a name="Transitions-PowIn"></a>
* **PowIn** (*pos*: Number, *x*: Number)

  **see**: [Pow](#Transitions-Pow)


<a name="Transitions-PowOut"></a>
* **PowOut** ()

<a name="Transitions-PowInOut"></a>
* **PowInOut** ()

<a name="Transitions-ExpoIn"></a>
* **ExpoIn** (*pos*: Number)

  **see**: [Expo](#Transitions-Expo)


<a name="Transitions-ExpoOut"></a>
* **ExpoOut** ()

<a name="Transitions-ExpoInOut"></a>
* **ExpoInOut** ()

<a name="Transitions-CircIn"></a>
* **CircIn** (*pos*: Number)

  **see**: [Circ](#Transitions-Circ)


<a name="Transitions-CircOut"></a>
* **CircOut** ()

<a name="Transitions-CircInOut"></a>
* **CircInOut** ()

<a name="Transitions-SineIn"></a>
* **SineIn** (*pos*: Number)

  **see**: [Sine](#Transitions-Sine)


<a name="Transitions-SineOut"></a>
* **SineOut** ()

<a name="Transitions-SineInOut"></a>
* **SineInOut** ()

<a name="Transitions-BackIn"></a>
* **BackIn** (*pos*: Number, *x*: Number)

  **see**: [Back](#Transitions-Back)


<a name="Transitions-BackOut"></a>
* **BackOut** ()

<a name="Transitions-BackInOut"></a>
* **BackInOut** ()

<a name="Transitions-BounceIn"></a>
* **BounceIn** (*pos*: Number)

  **see**: [Bounce](#Transitions-Bounce)


<a name="Transitions-BounceOut"></a>
* **BounceOut** ()

<a name="Transitions-BounceInOut"></a>
* **BounceInOut** ()

<a name="Transitions-ElasticIn"></a>
* **ElasticIn** (*pos*: Number, *x*: Number)

  **see**: [Elastic](#Transitions-Elastic)


<a name="Transitions-ElasticOut"></a>
* **ElasticOut** ()

<a name="Transitions-ElasticInOut"></a>
* **ElasticInOut** ()

<a name="Transitions-Quad"></a>
* **Quad** ()

<a name="Transitions-QuadIn"></a>
* **QuadIn** ()

<a name="Transitions-QuadOut"></a>
* **QuadOut** ()

<a name="Transitions-QuadInOut"></a>
* **QuadInOut** ()

<a name="Transitions-Cubic"></a>
* **Cubic** ()

<a name="Transitions-CubicIn"></a>
* **CubicIn** ()

<a name="Transitions-CubicOut"></a>
* **CubicOut** ()

<a name="Transitions-CubicInOut"></a>
* **CubicInOut** ()

<a name="Transitions-Quart"></a>
* **Quart** ()

<a name="Transitions-QuartIn"></a>
* **QuartIn** ()

<a name="Transitions-QuartOut"></a>
* **QuartOut** ()

<a name="Transitions-QuartInOut"></a>
* **QuartInOut** ()

<a name="Transitions-Quint"></a>
* **Quint** ()

<a name="Transitions-QuintIn"></a>
* **QuintIn** ()

<a name="Transitions-QuintOut"></a>
* **QuintOut** ()

<a name="Transitions-QuintInOut"></a>
* **QuintInOut** ()