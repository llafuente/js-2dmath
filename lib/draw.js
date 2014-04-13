function rectangle(context2d, rect, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.strokeRect(rect[0][0], rect[0][1], rect[1][0] - rect[0][0], rect[1][1] - rect[0][1]);
}

function circle(context2d, circle, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.arc(circle[0][0], circle[0][1], circle[1], 0, 2 * Math.PI, false);
    context2d.stroke();
}

function vec2(context2d, vec2, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(vec2[0] + 2, vec2[1] + 2);
    context2d.lineTo(vec2[0] - 2, vec2[1] - 2);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(vec2[0] - 2, vec2[1] + 2);
    context2d.lineTo(vec2[0] + 2, vec2[1] - 2);
    context2d.stroke();
}

function segment2(context2d, seg2, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(seg2[0], seg2[1]);
    context2d.lineTo(seg2[2], seg2[3]);
    context2d.stroke();

    context2d.beginPath();
    context2d.arc(seg2[0], seg2[1], 1, 0, 2 * Math.PI, false);
    context2d.stroke();

    context2d.beginPath();
    context2d.arc(seg2[2], seg2[3], 1, 0, 2 * Math.PI, false);
    context2d.stroke();

}

function bb2(context2d, bb2, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.strokeRect(bb2[0], bb2[1], bb2[2] - bb2[0], bb2[3] - bb2[1]);
}

function text(context2d, text, vec2, font) {
    font = font || "12pt Consolas";
    context2d.font = font;

    context2d.fillText(text, vec2[0], vec2[1]);
}


var Draw = {
    vec2: vec2,
    rectangle: rectangle,
    circle: circle,
    segment2: segment2,
    bb2: bb2,

    text: text
};

module.exports = Draw;