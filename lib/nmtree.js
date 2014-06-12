/**
 * Stability: 2 (fixes / performance improvements)
 * ~Quadtree implementation that allow to override the number of subdivision for the first level
 * This is specially useful for rectangular worlds
 *
 * @reference http://en.wikipedia.org/wiki/Quadtree
 */

var AABB2 = require("./aabb2.js"),
    AABB2_fromAABB2Division = AABB2.fromAABB2Division,
    AABB2_contains = AABB2.contains;

/**
 * Constructor
 * @param {AABB2} aabb2
 * @param {Number=} maxObjects
 * @param {Number=} maxLevels
 * @param {Vec2=} subdivisions
 */
function NMtree(aabb2, maxObjects, maxLevels, subdivisions) {
    this.objects = [];
    this.bounds = aabb2;
    this.maxObjects = maxObjects || 10;
    this.maxLevels = maxLevels || 4;
    this.subdivisions = subdivisions || [2, 2];
}

NMtree.prototype.level = 0;
NMtree.prototype.maxLevels = 4;
NMtree.prototype.maxObjects = 10;
NMtree.prototype.subtrees = null;
NMtree.prototype.bounds = null;
NMtree.prototype.objects = [];
NMtree.prototype.subdivisions = [2, 2];

NMtree.prototype.divide = function () {
    var objs = this.objects,
        i,
        j,
        max,
        bounds = AABB2_fromAABB2Division(this.bounds, this.subdivisions[0], this.subdivisions[1]),
        qt;

    this.subtrees = [];
    this.objects = [];

    for (j = 0, max = bounds.length; j < max; j++) {
        qt = new NMtree(bounds[j]),// this.maxObjects, this.maxLevels);

        qt.level = this.level + 1; // manually set
        this.subtrees.push(qt);
    }
    for (i = 0, max = objs.length; i < max; i++) {
        if (!this.subinsert(objs[i])) {
            this.objects.push(objs[i]);
        }
    }
};

/**
 * @param {Object}
 */
NMtree.prototype.subinsert = function (obj) {
    if (!this.subtrees) {
        return false;
    }

    var j = 0,
        max = this.subtrees.length;
    while (j < max && !this.subtrees[j].insert(obj.bounds, obj.userdata)) {
        ++j;
    }

    return j !== max;
};

/**
 * @param {AABB2} aabb2
 * @param {Mixed} userdata
 */
NMtree.prototype.insert = function (aabb2, userdata) {
    if (AABB2_contains(this.bounds, aabb2)) {
        var obj = {bounds: aabb2, userdata: userdata};

        if (!this.subinsert(obj)) {
            if (!this.subtrees && this.objects.length === this.maxObjects && this.level < this.maxLevels) {
                this.divide();
                if (this.subinsert(obj)) { //retry
                    return true;
                }
            }
            this.objects.push(obj);
        }
        return true;
    }
    return false;
};

/**
 * @param {Mixed} userdata
 * @param {Array} out
 */
NMtree.prototype.retrieve = function (userdata, out) {
    out = out || [];

    var i,
        max,
        objs = this.objects,
        found;

    if (objs && objs.length) {
        for (i = 0, max = objs.length; i < max && !found; i++) {
            if (objs[i].userdata === userdata) {
                found = true;
            }
        }
    }

    if (found) {
        this.iterate(function (qt) {
            if (qt.objects) {
                var i,
                    max;
                for (i = 0, max = qt.objects.length; i < max; ++i) {
                    out.push(qt.objects[i]);
                }
            }
        });

        return out;
    } else if (this.subtrees) {
        for (i = 0, max = this.subtrees.length; i < max; i++) {
            this.subtrees[i].retrieve(userdata, out);
        }
    }

    return out;
};

/**
 * @param {Function} callback
 */
NMtree.prototype.iterate = function (callback) {
    var i,
        max;

    callback(this);

    if (this.subtrees) {
        for (i = 0, max = this.subtrees.length; i < max; ++i) {
            this.subtrees[i].iterate(callback);
        }
    }
};

/**
 * @param {Mixed} userdata
 */
NMtree.prototype.remove = function (userdata) {
    var i,
        max,
        objs = this.objects,
        found;

    if (objs && objs.length) {
        for (i = 0, max = objs.length; i < max && !found; i++) {
            if (objs[i].userdata === userdata) {
                objs.splice(i, 1);
                return true;
            }
        }
    }

    if (this.subtrees) {
        for (i = 0, max = this.subtrees.length; i < max; i++) {
            if (this.subtrees[i].remove(userdata)) {
                return true;
            }
        }
    }
    return false;
};

module.exports = NMtree;