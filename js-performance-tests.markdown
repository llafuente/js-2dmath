# Performance test for Javascript

In order to prove that the library is written in the most performance way I write some various test.

* [traverse scope](http://jsperf.com/js-2d-math-traverse-scope)

  No difference, all compiler after the first execution knows exactly where the used variables are, so traverse scope has no extra cost.

  Allow variable re-utilization in a higher scope with no extra cost.

* [cache array access](http://jsperf.com/js-2d-math-array-cache)

  Almost no difference if you cache the first level of an array, you see a bit performance gain when instead of a number you use a variable as index.

  So cache is not mandatory for numbers, it is if the access is in a loop

* [Vec2 Pool vs instance](http://jsperf.com/vec2-pool-vs-instance)

  Almost know to everyone that array push/pop has it's cost. Also instancing has it's cost.

  I suspect I need a real example of a very intensive app to evaluate both results.

  In long term, it's possible that push/pop will be faster for short array before the performance decay (avoid long arrays in javascript...) because instancing will stress the garbage collector.

  But in the end, my approach was right, do not rely on pools or instance every time, cache a vector in a variable and just re-use it.