import { editor } from "../../../src/editor/editor";
import { Length } from "../../../src/editor/unit/Length";
import { BlockDisplay, InlineBlockDisplay, InlineDisplay, GridDisplay, FlexDisplay } from "../../../src/editor/css-property/Display";

beforeEach(() => {


})

afterEach( () => {

})

test('Display - new Display', () => {
    var display = new BlockDisplay();
    var css = display.toCSS();
    expect(css.display).toEqual('block');

    var display = new InlineDisplay();
    var css = display.toCSS();
    expect(css.display).toEqual('inline');
    
    var display = new InlineBlockDisplay();
    var css = display.toCSS();
    expect(css.display).toEqual('inline-block');
    
    var display = new GridDisplay();
    var css = display.toCSS();
    expect(css.display).toEqual('grid');
    
    var display = new FlexDisplay();
    var css = display.toCSS();
    expect(css.display).toEqual('flex');    
})

test('Display - FlexDisplay' , () => {
    var display = new FlexDisplay();
    expect(display + "").toEqual('display: flex')

    display.direction = 'column'
    expect(display + '').toEqual('display: flex;flex-direction: column')

    display.alignItems = 'center'
    expect(display + '').toEqual('display: flex;flex-direction: column;align-items: center')

    display.alignContent = 'center'
    expect(display + '').toEqual('display: flex;flex-direction: column;align-items: center;align-content: center')    
})

test('Display - FlexDisplay - flex-wrap' , () => {
    var display = new FlexDisplay();
    display.wrap = 'wrap'
    expect(display + "").toEqual('display: flex;flex-wrap: wrap')
})

test('Display - GridDisplay', () => {
    
})
