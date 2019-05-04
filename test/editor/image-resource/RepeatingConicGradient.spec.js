import { editor } from "../../../src/editor/editor";
import { RepeatingConicGradient } from "../../../src/editor/image-resource/RepeatingConicGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})

test('RepeatingConicGradient - new RepeatingConicGradient', () => {
    var gradient = new RepeatingConicGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('repeating-conic-gradient');
    expect(gradient+"").toEqual('repeating-conic-gradient(from 0deg at center center, )')
});

test('RepeatingConicGradient - add ColorStep', () => {
    var gradient = new RepeatingConicGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 100
    }))

    expect(gradient+"").toEqual('repeating-conic-gradient(from 0deg at center center, yellow 360deg)')

    gradient.colorsteps[0].percent = 0; 
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100 
    }))

    expect(gradient+"").toEqual('repeating-conic-gradient(from 0deg at center center, yellow 0deg,red 360deg)')
});

test('RepeatingConicGradient - add ColorStep with px', () => {
    var gradient = new RepeatingConicGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow'
    }))

    expect(gradient+"").toEqual('repeating-conic-gradient(from 0deg at center center, yellow 0deg)')

    gradient.colorsteps[0].mul(10); 

    expect(gradient+"").toEqual('repeating-conic-gradient(from 0deg at center center, yellow 0deg)')
});

test('RepeatingConicGradient - angle ', () => {
    var gradient = new RepeatingConicGradient({
        angle: 100
    });
    gradient.addColorStep(new ColorStep({
        color: 'yellow'
    }))

    expect(gradient+"").toEqual('repeating-conic-gradient(from 100deg at center center, yellow 0deg)')
});

test('RepeatingConicGradient - angle 45deg ', () => {
    var gradient = new RepeatingConicGradient({
        angle: 45
    });

    expect(gradient+"").toEqual('repeating-conic-gradient(from 45deg at center center, )')
});

test('RepeatingConicGradient - add ColorStep with px', () => {
    var gradient = new RepeatingConicGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }))

    expect(gradient+"").toEqual('repeating-conic-gradient(from 0deg at center center, yellow 0deg,red 360deg)')
});
