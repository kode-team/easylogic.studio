import { editor } from "../../../src/editor/editor";
import { RepeatingLinearGradient } from "../../../src/editor/image-resource/RepeatingLinearGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})

test('RepeatingLinearGradient - new RepeatingLinearGradient', () => {
    var gradient = new RepeatingLinearGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('repeating-linear-gradient');
    expect(gradient+"").toEqual('repeating-linear-gradient(to top, )')
});

test('RepeatingLinearGradient - add ColorStep', () => {
    var gradient = new RepeatingLinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 100
    }))

    expect(gradient+"").toEqual('repeating-linear-gradient(to top, yellow 100%)')

    gradient.colorsteps[0].percent = 0; 
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100 
    }))

    expect(gradient+"").toEqual('repeating-linear-gradient(to top, yellow 0%,red 100%)')
});

test('RepeatingLinearGradient - add ColorStep with px', () => {
    var gradient = new RepeatingLinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))

    expect(gradient+"").toEqual('repeating-linear-gradient(to top, yellow 100px)')

    gradient.colorsteps[0].mul(10); 

    expect(gradient+"").toEqual('repeating-linear-gradient(to top, yellow 1000px)')
});

test('RepeatingLinearGradient - angle ', () => {
    var gradient = new RepeatingLinearGradient({
        angle: 100
    });
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))

    expect(gradient+"").toEqual('repeating-linear-gradient(100deg, yellow 100px)')
});

test('RepeatingLinearGradient - angle 45deg ', () => {
    var gradient = new RepeatingLinearGradient({
        angle: 45
    });

    expect(gradient+"").toEqual('repeating-linear-gradient(to top right, )')
});



test('RepeatingLinearGradient - add ColorStep with px', () => {
    var gradient = new RepeatingLinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }))

    expect(gradient+"").toEqual('repeating-linear-gradient(to top, yellow 100px,red 100%)')
});

