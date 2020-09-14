import Color from './Color';

const hue_color = [
    { rgb : '#ff0000', start : .0 },
    { rgb : '#ffff00', start : .17 },
    { rgb : '#00ff00', start : .33 },
    { rgb : '#00ffff', start : .50 },
    { rgb : '#0000ff', start : .67 },
    { rgb : '#ff00ff', start : .83 },
    { rgb : '#ff0000', start : 1 }
];

function checkHueColor(p) {
    var startColor, endColor;

    for(var i = 0; i < hue_color.length;i++) {
        if (hue_color[i].start >= p) {
            startColor = hue_color[i-1];
            endColor = hue_color[i];
            break;
        }
    }

    if (startColor && endColor) {
        return Color.interpolateRGB(startColor, endColor, (p - startColor.start)/(endColor.start - startColor.start));
    }

    return hue_color[0].rgb;
}


function initHueColors () {
    for(var i = 0, len = hue_color.length; i < len; i++) {
        var hue = hue_color[i];

        var obj = Color.parse(hue.rgb);

        hue.r = obj.r;
        hue.g = obj.g;
        hue.b = obj.b;
    }
}

initHueColors();

export default { 
    colors : hue_color,
    checkHueColor
};