var exp;
(exp = function () {
    "use strict";


    var browser = "undefined" === typeof module,
        Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
        min = Math.min,
        max = Math.max,
        BB2,
        TOPLEFT,
        TOPMIDDLE,
        TOPRIGHT,

        CENTERLEFT,
        CENTER,
        CENTERRIGHT,

        BOTTOMLEFT,
        BOTTOM,
        BOTTOMRIGHT,
        aux_vec2_1 = [0, 0],
        aux_vec2_2 = [0, 0],
        a = 0,
        b = 0,
        r = 0,
        x = 0,
        y = 0,

        min_x = 0,
        max_x = 0,
        min_y = 0,
        max_y = 0;

    /**
     * @class BB2
     */
    BB2 = {};

    BB2.create = function (l, b, r, t) {
        var out = [l, b, r, t, false];
        BB2.normalize(out, out);
        return out;
    };

    BB2.fromCircle = function (circle) {
        r = circle[1];
        x = circle[0][0];
        y = circle[0][1];
        return BB2.create(
            x - r,
            y - r,
            x + r,
            y + r
        );
    };

    BB2.zero = function () {
        return [0, 0, 0, 0, true];
    };

    BB2.clone = function (bb) {
        return [bb[0], bb[1], bb[2], bb[3], bb[4]];
    };

    BB2.copy = function (out, bb) {
        out[0] = bb[0];
        out[1] = bb[1];
        out[2] = bb[2];
        out[3] = bb[3];
        out[4] = bb[4];

        return out;
    };

    BB2.merge = function (out, bb1, bb2) {
        out[0] = min(bb1[0], bb2[0]);
        out[1] = min(bb1[1], bb2[1]);
        out[2] = max(bb1[2], bb2[2]);
        out[3] = max(bb1[3], bb2[3]);

        return out;
    };

    BB2.offsetMerge = function (out, bb1, bb2, offset) {
        out[0] = min(bb1[0], bb2[0] + offset[0]);
        out[1] = min(bb1[1], bb2[1] + offset[1]);
        out[2] = max(bb1[2], bb2[2] + offset[0]);
        out[3] = max(bb1[3], bb2[3] + offset[1]);

        return out;
    };

    // offset & scale merge
    BB2.osMerge = function (out, bb1, bb2, offset, scale) {
        out[0] = min(bb1[0], (bb2[0] * scale[0]) + offset[0]);
        out[1] = min(bb1[1], (bb2[1] * scale[1]) + offset[1]);
        out[2] = max(bb1[2], (bb2[2] * scale[0]) + offset[0]);
        out[3] = max(bb1[3], (bb2[3] * scale[1]) + offset[1]);

        return out;
    };

    BB2.area = function (bb) {
        return (bb.r - bb.l) * (bb.t - bb.b);
    };

    // TODO
    BB2.normalize = function (out, bb2) {
        min_x = bb2[0] > bb2[2] ? bb2[2] : bb2[0];
        max_x = bb2[0] > bb2[2] ? bb2[0] : bb2[2];
        min_y = bb2[1] > bb2[3] ? bb2[3] : bb2[1];
        max_y = bb2[1] > bb2[3] ? bb2[1] : bb2[3];

        out[0] = min_x;
        out[1] = min_y;

        out[2] = max_x;
        out[3] = max_y;

        out[4] = true;

    };

    BB2.translate = function (out, rec1, vec2) {
        x = vec2[0];
        y = vec2[1];

        out[0] = rec1[0] + x;
        out[1] = rec1[1] + y;
        out[2] = rec1[2] + x;
        out[3] = rec1[3] + y;

        return out;
    };

    BB2.clampVec = function (out, bb, vec2) {
        out[0] = min(max(bb.l, vec2[0]), bb.r);
        out[1] = min(max(bb.b, vec2[1]), bb.t);

        return out;
    };

    TOPLEFT = BB2.TOPLEFT = 1;
    TOPMIDDLE = BB2.TOPMIDDLE = 2;
    TOPRIGHT = BB2.TOPRIGHT = 3;

    CENTERLEFT = BB2.CENTERLEFT = 4;
    CENTER = BB2.CENTER = 5;
    CENTERRIGHT = BB2.CENTERRIGHT = 6;

    BOTTOMLEFT = BB2.BOTTOMLEFT = 7;
    BOTTOM = BB2.BOTTOM = 8;
    BOTTOMRIGHT = BB2.BOTTOMRIGHT = 9;


    BB2.align = function (out_vec2, con_bb, alignament) {
        switch (alignament) {
        case TOPLEFT:
            // do nothing!
            out_vec2[0] = con_bb[0];
            out_vec2[1] = con_bb[1];
            break;
        case TOPMIDDLE:
            out_vec2[0] = (con_bb[2] - con_bb[0]) * 0.5;
            out_vec2[1] = con_bb[1];
            break;
        case TOPRIGHT:
            out_vec2[0] = con_bb[2];
            out_vec2[1] = con_bb[1];
            break;

        case CENTERLEFT:
            out_vec2[0] = con_bb[0];
            out_vec2[1] = (con_bb[3] - con_bb[1]) * 0.5;
            break;
        case CENTER:
            out_vec2[0] = (con_bb[2] - con_bb[0]) * 0.5;
            out_vec2[1] = (con_bb[3] - con_bb[1]) * 0.5;
            break;
        case CENTERRIGHT:
            out_vec2[0] = con_bb[2];
            out_vec2[1] = (con_bb[3] - con_bb[1]) * 0.5;
            break;

        case BOTTOMLEFT:
            out_vec2[0] = con_bb[0];
            out_vec2[1] = con_bb[3];
            break;
        case BOTTOM:
            out_vec2[0] = (con_bb[2] - con_bb[0]) * 0.5;
            out_vec2[1] = con_bb[3];
            break;
        case BOTTOMRIGHT:
            out_vec2[0] = con_bb[2];
            out_vec2[1] = con_bb[3];
            break;
        }

        return out_vec2;
    };

    return BB2;

}());


if ("undefined" === typeof module) {
    window.BB2 = exp;
} else {
    module.exports = exp;
}