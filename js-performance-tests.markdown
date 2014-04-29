# Performance test for Javascript

In order to prove that the library is written in the most performance way I write some various test.

* [traverse scope](http://jsperf.com/js-2d-math-traverse-scope)

  No diference, all compiler after the first execution knows exactly where the used variables are, so traverse scope has no extra cost.

  Allow variable re-utilization in a higher scope with no extra cost.

* [cache array access](http://jsperf.com/js-2d-math-array-cache)

  Almost no diference if you cache the first level of an array, you see a bit performance gain when instead of a number you use a variable as index.

  So cache is not mandatory for numbers, it is if the access is in a loop