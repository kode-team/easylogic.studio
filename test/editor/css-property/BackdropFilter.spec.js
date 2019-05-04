import { BackdropBlurFilter, BackdropGrayscaleFilter, BackdropHueRotateFilter, BackdropInvertFilter, BackdropBrightnessFilter, BackdropContrastFilter, BackdropDropshadowFilter } from "../../../src/editor/css-property/BackdropFilter";
import { Length } from "../../../src/editor/unit/Length";

beforeEach(() => {


})

afterEach( () => {

})

test('BackdropFilter - new BackdropBlurFilter', () => {
    var filter = new BackdropBlurFilter();
    expect(filter + "").toEqual('blur(0px)');

    filter = new BackdropBlurFilter({ value: Length.percent(10) });
    expect(filter + "").toEqual('blur(10%)');
})

test('BackdropFilter - new BackdropGrayscaleFilter', () => {
    var filter = new BackdropGrayscaleFilter()
    expect(filter + "").toEqual('grayscale(0%)');    

    filter = new BackdropGrayscaleFilter({ value: Length.percent(20) })
    expect(filter + "").toEqual('grayscale(20%)');    

    filter.value = Length.px(30);
    expect(filter + "").toEqual('grayscale(30px)');    
})

test('BackdropFilter - new BackdropHueRotateFilter', () => {
    var filter = new BackdropHueRotateFilter();
    expect(filter + "").toEqual('hue-rotate(0deg)')

    filter.value = Length.deg(100);
    expect(filter + "").toEqual('hue-rotate(100deg)')
})

test('BackdropFilter - new BackdropInvertFilter', () => {
    var filter = new BackdropInvertFilter();
    expect(filter + "").toEqual('invert(0%)')

    filter.value = Length.px(10);
    expect(filter + "").toEqual("invert(10px)")
}) 

test('BackdropFilter - new BackdropBrightnessFilter', () => {
    var filter = new BackdropBrightnessFilter();
    expect(filter + "").toEqual("brightness(100%)")

    filter.value = Length.percent(5);
    expect(filter + "").toEqual("brightness(5%)")
})

test('BackdropFilter - new BackdropContrastFilter', () => {
    var filter = new BackdropContrastFilter();
    expect(filter + "").toEqual("contrast(100%)")

    filter.value = Length.percent(50);
    expect(filter + "").toEqual("contrast(50%)")
})

test('BackdropFilter - new BackdropDropshadowFilter', () => {
    var filter = new BackdropDropshadowFilter();
    expect(filter + "").toEqual("drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))");

    filter.offsetX = Length.percent(100);
    expect(filter+"").toEqual('drop-shadow(100% 0px 0px rgba(0, 0, 0, 0))')

    filter.color = 'red';
    expect(filter+"").toEqual('drop-shadow(100% 0px 0px red)')
})