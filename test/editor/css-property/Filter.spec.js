import { editor } from "../../../src/editor/editor";
import { BlurFilter, GrayscaleFilter, HueRotateFilter, InvertFilter, BrightnessFilter, ContrastFilter, DropshadowFilter } from "../../../src/editor/css-property/Filter";
import { Length } from "../../../src/editor/unit/Length";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})

test('Filter - new BlurFilter', () => {
    var filter = new BlurFilter();
    expect(filter + "").toEqual('blur(0px)');

    filter = new BlurFilter({ value: Length.percent(10) });
    expect(filter + "").toEqual('blur(10%)');
})

test('Filter - new GrayscaleFilter', () => {
    var filter = new GrayscaleFilter()
    expect(filter + "").toEqual('grayscale(0%)');    

    filter = new GrayscaleFilter({ value: Length.percent(20) })
    expect(filter + "").toEqual('grayscale(20%)');    

    filter.value = Length.px(30);
    expect(filter + "").toEqual('grayscale(30px)');    
})

test('Filter - new HueRotateFilter', () => {
    var filter = new HueRotateFilter();
    expect(filter + "").toEqual('hue-rotate(0deg)')

    filter.value = Length.deg(100);
    expect(filter + "").toEqual('hue-rotate(100deg)')
})

test('Filter - new InvertFilter', () => {
    var filter = new InvertFilter();
    expect(filter + "").toEqual('invert(0%)')

    filter.value = Length.px(10);
    expect(filter + "").toEqual("invert(10px)")
}) 

test('Filter - new BrightnessFilter', () => {
    var filter = new BrightnessFilter();
    expect(filter + "").toEqual("brightness(100%)")

    filter.value = Length.percent(5);
    expect(filter + "").toEqual("brightness(5%)")
})

test('Filter - new ContrastFilter', () => {
    var filter = new ContrastFilter();
    expect(filter + "").toEqual("contrast(100%)")

    filter.value = Length.percent(50);
    expect(filter + "").toEqual("contrast(50%)")
})

test('Filter - new DropshadowFilter', () => {
    var filter = new DropshadowFilter();
    expect(filter + "").toEqual("drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))");

    filter.offsetX = Length.percent(100);
    expect(filter+"").toEqual('drop-shadow(100% 0px 0px rgba(0, 0, 0, 0))')

    filter.color = 'red';
    expect(filter+"").toEqual('drop-shadow(100% 0px 0px red)')
})