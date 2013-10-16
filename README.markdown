# js-2dmath [![Build Status](https://secure.travis-ci.org/llafuente/js-2dmath.png?branch=master)](http://travis-ci.org/llafuente/js-2dmath)


Javascript 2D Math (vector, matrix, trigonometry, ...) for high performance

So the objetive is "Be fast as hell!"




## API

More info to come... soon :D

###  Vec2
* zero ()
* clone (v1)
* equals (v1, v2)
* equalsEpsilon (v1, v2)
* gt (v1, v2)
* lt (v1, v2)
* near (v1, v2, dist)
* isValid (v1)
* isNaN (v1)
* copy (out, v1)
* negate (out, v1)
* perpendicular (out, v1)
* perp (out, v1)
* rotateCW (out, v1)
* normalize (out, v1)
* rperpendicular (out, v1)
* rerp (out, v1)
* rotateCCW (out, v1)
* lerp (out, v1, v2, t)
* lerpconst (out, v1, v2, d)
* slerp (out, v1, v2, t)
* slerpconst (out, v1, v2, angle)
* forAngle (v1, angle)
* project (out, v1, v2)
* rotate (out, v1, angle, center)
* rotateVec (out, v1, v2)
* unrotateVec (out, v1, v2)
* midPoint (out, v1, v2)
* reflect (out, v1, v2_normal)
* subtract (out, v1, v2)
* sub (out, v1, v2)
* add (out, v1, v2)
* multiply (out, v1, v2)
* mul (out, v1, v2)
* divide (out, v1, v2)
* div (out, v1, v2)
* scale (out, v1, factor)
* max (out, v1, v2)
* min (out, v1, v2)
* abs (out, v1)
* scaleAndAdd (out, v1, v2, scale)
* clamp (out, v1, len)
* magnitude (v1, v2)
* compare (v1, v2)
* dot (v1, v2)
* cross (v1, v2)
* toAngle (v1)
* angle (v1)
* distance (v1, v2)
* sqrDistance (v1, v2)
* distanceSq (v1, v2)
* sqrLength (v1)
* lengthSq (v1)

###  Line2
* fromPoints (x1, y1, x2, y2)
* copy (out, l1)
* clone (l1)
* add (out, l1, v1)
* translate (out, l1, v1)
* subtract (out, l1, v1)
* sub (out, l1, v1)
* parallel (out, l1)

###  Segment2
* clone (seg2)
* copy (out, seg2)
* translate (out, seg2, v1)
* sqrLength (seg2)
* lengthSq (seg2)
* cross (seg2, v1)

###  Rectangle
* zero ()
* clone (rec1)
* copy (out, rec1)
* normalize (out, rec1, force)
* center (out_vec2, rec1)
* translate (out, rec1, vec2)
* distance (rect1, rect2)

###  Circle
* clone (circle)
* copy (out, circle)
* translate (out, circle, v1)
* distance (acircle, bcircle)

###  Beizer
* cubic (cp0x, cp0y, cp1x, cp1y, cp2x, cp2y, cp3x, cp3y)
* quadric (cp0x, cp0y, cp1x, cp1y, cp2x, cp2y)
* get (out, curve, t)
* length (curve, step)

###  Matrix2D
* copy (out, m2d)
* identity (out)
* drotate (out, m2d, degree)
* rotate (out, m2d, radians)
* drotation (out, m2d, degree)
* rotation (out, m2d, radians)
* translate (out, m2d, v1)
* gtranslate (out, m2d, v1)
* position (out, m2d, v1)
* scale (out, m2d, v1)
* scalation (out, m2d, v1)
* dskewx (out, m2d, degree)
* skewx (out, m2d, radians)
* dskewy (out, m2d, degree)
* skewy (out, m2d, radians)
* dskew (out, m2d, degreex, degreey)
* skew (out, m2d, radiansx, radiansy)
* multiply (out, m2d, m2d_2)
* multiplyVec2 (out, m2d, v1)
* getPosition (out_vec2, m2d)
* inverse (out, m2d)
* transpose (out, m2d)
* determinant (out, m2d)
* translationMatrix (x, y)
* skewXMatrix (angle)
* skewYMatrix (angle)
* scalingMatrix (sx, sy)

###  Intersection
* COLLIDE 1
* INSIDE 2
* OUTSIDE 3
* COINCIDENT 4
* PARALLEL 5
* rectangle_rectangle (rect1, rect2, points, distance)
* rectangle_vec2 (rectangle, vec2, points, distance)
* circle_vec2 (circle, vec2, points, distance)
* circle_circle (acircle, bcircle, points, distance)
* line2_line2 (aline, bline, points, distance)




## License

MIT