import Color from '../src/util/Color'


test('Color parse for rgb', () => {
    const colorCode = 'rgba(255, 255, 0, 0.5)';
    const result = Color.parse(colorCode);

    var { type, r, g, b, a } = result;

    const real = { type, r, g, b, a };


    expect(real).toEqual({ type: 'rgb', r: 255, g: 255, b: 0, a: 0.5 });
});

test('Color parse for hex', () => {
    const colorCode = '#229933';
    const result = Color.parse(colorCode);


    var { type, r, g, b, a } = result;

    const real = { type, r, g, b, a };


    expect(real).toEqual({ type: 'hex', r: 0x22, g: 0x99, b: 0x33, a: 1 });
});

test('Color parse for hex Number', () => {
    const colorCode = 0x229933;
    const result = Color.parse(colorCode);


    var { type, r, g, b, a } = result;

    const real = { type, r, g, b, a };


    expect(real).toEqual({ type: 'hex', r: 0x22, g: 0x99, b: 0x33, a: 1 });
});

test('Color parse for hex Number 2', () => {
    const colorCode = 0x229933ff;
    const result = Color.parse(colorCode);


    var { type, r, g, b, a } = result;

    const real = { type, r, g, b, a };


    expect(real).toEqual({ type: 'hex', r: 0x22, g: 0x99, b: 0x33, a: 1 });
});



test('Color parse for hsl', () => {
    const colorCode = 'hsl(0,0%,69%)';
    const result = Color.parse(colorCode);

    const rgb = Color.HSLtoRGB(result.h, result.s, result.l);

    expect(result).toEqual({ type: 'hsl', h: 0, s: 0, l: 69, a: 1, r: rgb.r, g: rgb.b, b: rgb.r });
});

test('Color parse for hsla', () => {
    const colorCode = 'hsla(0,0%,69%, 0.67)';
    const result = Color.parse(colorCode);

    const rgb = Color.HSLtoRGB(result.h, result.s, result.l);

    expect(result).toEqual({ type: 'hsl', h: 0, s: 0, l: 69, a: 0.67, r: rgb.r, g: rgb.b, b: rgb.r });
});

test('Color matches', () => {
    const colorCode = 'hsl(0,0%,69%) #aaa #ccc #ddd #ffffff blue';
    const result = Color.matches(colorCode);

    expect(result.length).toBe(6);

    const testList = result.filter(item => {
        return item.nameColor;
    });

    expect(testList.length).toBe(1);
    expect(testList[0].color).not.toBe('red');
});

test('Color matches', () => {
    const colorCode = 'box-shadow : 0 0 0 hsl(0,0%,69%),  2 2 2 #aaa, 3 3 3 #ccc, 4 4 4 #ddd, 5 5 5 #ffffff, 0 0 0 blue;';
    const result = Color.matches(colorCode);

    expect(result.length).toBe(6);

    const testList = result.filter(item => {
        return item.nameColor;
    });

    expect(testList.length).toBe(1);
    expect(testList[0].color).not.toBe('red');
    expect(testList[0].startIndex).toBe(colorCode.length - 5);
});

test("Convert RGB to HSV", () => {
    //color.RGBtoHSV(0, 0, 255) === { h : 240, s : 1, v : 1 } === '#FFFF00'

    const rgb = Color.parse("#0000FF");
    const rgb2 = Color.parse("rgb(0, 0, 255)");

    expect(rgb.r).toBe(rgb2.r);
    expect(rgb.g).toBe(rgb2.g);
    expect(rgb.b).toBe(rgb2.b);

    const hsv = Color.RGBtoHSV(rgb.r, rgb.g, rgb.b);

    expect(hsv).toEqual({ h: 240, s: 1, v: 1 });
})

test("Convert HSV to RGB", () => {
    //color.HSVtoRGB(0,0,1) === #FFFFFFF === { r : 255, g : 255, b : 255 }

    const rgb = Color.HSVtoRGB(0, 0, 1);
    const rgb2 = Color.parse("#FFFFFF");

    expect(Color.format(rgb, 'hex')).toBe(Color.format(rgb2, 'hex'));

    expect(rgb.r).toBe(rgb2.r);
    expect(rgb.g).toBe(rgb2.g);
    expect(rgb.b).toBe(rgb2.b);
})

test("Convert RGB to HSL", () => {
    // refer to https://www.rapidtables.com/convert/color/rgb-to-hsl.html  color tables 
    //White	#FFFFFF	(255,255,255)	(0°,0%,100%)

    const rgb = Color.parse("#ffffff");
    const hsl = Color.RGBtoHSL(rgb.r, rgb.g, rgb.b);

    expect(hsl).toEqual({ h: 0, s: 0, l: 100 })

    //Lime	#00FF00	(0,255,0)	(120°,100%,50%)
    const rgb2 = Color.parse("#00ff00");
    const hsl2 = Color.RGBtoHSL(rgb2.r, rgb2.g, rgb2.b);

    expect(hsl2).toEqual({ h: 120, s: 100, l: 50 })

})

test("Convert RGB to CMYK ", () => {
    //	Yellow	(255,255,0)	#FFFF00	(0,0,1,0)

    const rgb = Color.parse("#ffff00");
    const cmyk = Color.RGBtoCMYK(rgb.r, rgb.g, rgb.b);

    expect(cmyk).toEqual({ c: 0, m: 0, y: 1, k: 0 })

})

test("Convert CMYK to RGB", () => {
    //Blue	(1,1,0,0)	(0,0,255)	#0000FF    
    const cmyk = { c: 1, m: 1, y: 0, k: 0 }
    const rgb = Color.CMYKtoRGB(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

    expect(rgb).toEqual({ r: 0, g: 0, b: 255 })
})

test(" Convert RGB to YCrCb", () => {
    const rgb = Color.parse("#ffffff");
    const ycrcb = Color.RGBtoYCrCb(rgb);
    const gray = Color.RGBtoGray(rgb);

    expect(gray).toEqual({ r: 255, g: 255, b: 255 })

    const gray1 = Color.RGBtoGray(255, 255, 0);

    expect(gray1).toEqual({ r: 237, g: 237, b: 237 })
})


test(" mix ", () => {
    const c = Color.mix("red", "blue");

    expect(c).toEqual('#800080');
})

test(" rgb to lab", () => {
    const c = Color.RGBtoLAB(255, 255, 255);

    expect(c).toEqual({ l: 100, a: 0.00526049995830391, b: -0.010408184525267927 });
})

test(" lab to rgb", () => {
    const c = Color.LABtoRGB(100, 0, 0);

    expect(c).toEqual({r : 255, g: 255, b : 255 });

    const c2 = Color.LABtoRGB(50, 0, 0);
    
    expect(c2).toEqual({r : 119, g: 119, b : 119 });
})