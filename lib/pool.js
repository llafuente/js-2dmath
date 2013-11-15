var p;


Vec2 = function (x, y) {
    var v = p.get();
    v[0] = x;
    v[1] = y;

    return v;
};

Pool = function (size, type) {

    this.size = size;
    this.type = type;

    this.malloc();
};

Pool.prototype.pool = [];
Pool.prototype.size = 128;
Pool.prototype.type = Array;


Pool.prototype.malloc = function () {
    delete this.pool;

    this.pool = new Array(size);

    var i,
        type = this.type,
        size = this.size;

    if (type === Vec2) {
        for (i = 0; i < size; ++i) {
            this.pool[i] = [0,0];
        }
    } else if (type === Array) {
        for (i = 0; i < size; ++i) {
            this.pool[i] = [];
        }
    } else {
        for (i = 0; i < size; ++i) {
            this.pool[i] = new type();
        }
    }
}

Pool.prototype.clear = function () {
    delete this.pool;
};
Pool.prototype.get = function () {
    var ret = this.pool.pop();
    if (ret === undefined) {
        this.malloc();

        ret = this.pool.pop();
    }

    return ret;
};

Pool.prototype.free = function (val) {
    this.pool.push(val);

    return this;
};
