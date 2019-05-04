import { editor } from "../../../src/editor/editor";
import { LinearGradient } from "../../../src/editor/image-resource/LinearGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";
import { RadialGradient } from "../../../src/editor/image-resource/RadialGradient";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})

test('LinearGradient - new LinearGradient', () => {
    var gradient = new LinearGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('linear-gradient');
    expect(gradient+"").toEqual('linear-gradient(to top, )')
});

test('LinearGradient - add ColorStep', () => {
    var gradient = new LinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 100
    }))

    expect(gradient+"").toEqual('linear-gradient(to top, yellow 100%)')

    gradient.colorsteps[0].percent = 0; 
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100 
    }))

    expect(gradient+"").toEqual('linear-gradient(to top, yellow 0%,red 100%)')
});

test('LinearGradient - add ColorStep with px', () => {
    var gradient = new LinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))

    expect(gradient+"").toEqual('linear-gradient(to top, yellow 100px)')

    gradient.colorsteps[0].mul(10); 

    expect(gradient+"").toEqual('linear-gradient(to top, yellow 1000px)')
});

test('LinearGradient - angle ', () => {
    var gradient = new LinearGradient({
        angle: 100
    });
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))

    expect(gradient+"").toEqual('linear-gradient(100deg, yellow 100px)')
});

test('LinearGradient - angle 45deg ', () => {
    var gradient = new LinearGradient({
        angle: 45
    });

    expect(gradient+"").toEqual('linear-gradient(to top right, )')
});



test('LinearGradient - add ColorStep with px', () => {
    var gradient = new LinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }))

    expect(gradient+"").toEqual('linear-gradient(to top, yellow 100px,red 100%)')
});

test('LinearGradient - to linear gradient', () => {
    var gradient = new LinearGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }))

    var str = LinearGradient.toLinearGradient(gradient);
    expect(str).toEqual('linear-gradient(to right, yellow 100px,red 100%)')

    var gradient = new RadialGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        unit: 'px',
        px: 100
    }))
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }))

    var str = LinearGradient.toLinearGradient(gradient);
    expect(str).toEqual('linear-gradient(to right, yellow 100px,red 100%)')    
})
