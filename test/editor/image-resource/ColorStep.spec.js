import { editor } from "../../../src/editor/editor";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";
import { LinearGradient } from "../../../src/editor/image-resource/LinearGradient";

beforeEach(() => {
    editor.clear();
})

afterEach( () => {
    editor.clear();
})

test('ColorStep - new ColorStep', () => {
    var colorstep = new ColorStep();

    expect(colorstep.percent).toEqual(0);
});

test('ColorStep - set color', () => {
    var colorstep = new ColorStep({
        color: 'red'
    });

    expect(colorstep.color).toEqual('red');
    colorstep.color = 'blue'

    expect(colorstep.color).toEqual('blue');
    expect(colorstep+"").toEqual('blue 0%');
});

test('ColorStep - set percent', () => {
    var colorstep = new ColorStep({
        color: 'red',
        percent: 100
    });

    expect(colorstep+"").toEqual('red 100%');
});

test('ColorStep - set px', () => {
    var colorstep = new ColorStep({
        color: 'red',
        unit: 'px',
        px: 100
    });

    expect(colorstep+"").toEqual('red 100px');
});

test('ColorStep - set px', () => {
    var colorstep = new ColorStep({
        color: 'red',
        unit: 'px',
        px: 100
    });

    expect(colorstep.toLength().isPx()).toEqual(true);
    colorstep.unit = '%'
    expect(colorstep.toLength().isPx()).toEqual(false);
    expect(colorstep.toLength().isPercent()).toEqual(true);
});

test('ColorStep - math operation', () => {
    var colorstep = new ColorStep({
        color: 'red',
        unit: 'px',
        px: 100
    });

    colorstep.add(20);

    expect(colorstep.toLength().isPx()).toEqual(true);
    expect(colorstep+"").toEqual('red 120px');

    colorstep.add(-20);
    expect(colorstep+"").toEqual('red 100px');

    colorstep.mul(20);
    expect(colorstep+"").toEqual('red 2000px');    

    colorstep.div(20);
    expect(colorstep+"").toEqual('red 100px');        

    colorstep.mod(33);
    expect(colorstep+"").toEqual('red 1px');
});

test('ColorStep - check unit type', () => {
    var colorstep = new ColorStep();
    expect(colorstep.isPercent).toEqual(true);

    colorstep.unit = 'px'
    expect(colorstep.isPx).toEqual(true);

    colorstep.unit = 'em'
    expect(colorstep.isEm).toEqual(true);
})

test('ColorStep - change unit', () => {
    var colorstep = new ColorStep({
        percent: 5
    });

    colorstep.changeUnit('px', 200);
    expect(colorstep.isPx).toEqual(true);
    expect(colorstep.px).toEqual(10);
    expect(colorstep.percent).toEqual(5);
    expect(colorstep.em).toEqual(10/16);

})