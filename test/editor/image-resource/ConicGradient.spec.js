import { editor } from "../../../src/editor/editor";
import { ConicGradient } from "../../../src/editor/image-resource/ConicGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";

beforeEach(() => {
    editor.clear();
})

afterEach( () => {
    editor.clear();
})

test('ConicGradient - new ConicGradient', () => {
    var gradient = new ConicGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('conic-gradient');
    expect(gradient+"").toEqual('conic-gradient(from 0deg at center center, )')
});

test('ConicGradient - add ColorStep', () => {
    var gradient = new ConicGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 100
    }))

    expect(gradient+"").toEqual('conic-gradient(from 0deg at center center, yellow 360deg)')

    gradient.colorsteps[0].percent = 0; 
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100 
    }))

    expect(gradient+"").toEqual('conic-gradient(from 0deg at center center, yellow 0deg,red 360deg)')
});

test('ConicGradient - add ColorStep with px', () => {
    var gradient = new ConicGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow'
    }))

    expect(gradient+"").toEqual('conic-gradient(from 0deg at center center, yellow 0deg)')

    gradient.colorsteps[0].mul(10); 

    expect(gradient+"").toEqual('conic-gradient(from 0deg at center center, yellow 0deg)')
});

test('ConicGradient - angle ', () => {
    var gradient = new ConicGradient({
        angle: 100
    });
    gradient.addColorStep(new ColorStep({
        color: 'yellow'
    }))

    expect(gradient+"").toEqual('conic-gradient(from 100deg at center center, yellow 0deg)')
});

test('ConicGradient - angle 45deg ', () => {
    var gradient = new ConicGradient({
        angle: 45
    });

    expect(gradient+"").toEqual('conic-gradient(from 45deg at center center, )')
});

test('ConicGradient - add ColorStep with px', () => {
    var gradient = new ConicGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }))

    expect(gradient+"").toEqual('conic-gradient(from 0deg at center center, yellow 0deg,red 360deg)')
});
