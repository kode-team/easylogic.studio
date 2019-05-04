import { Gradient } from "../../../src/editor/image-resource/Gradient";
import { editor } from "../../../src/editor/editor";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})
 
test('Gradient - new Gradient', () => {
    var gradient = new Gradient();

    expect(gradient.itemType).toEqual('image-resource');
});

test('Gradient - add ColorStep', () => {
    var gradient = new Gradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 0
    }))

    var secondColorStep = gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 100
    }));

    expect(gradient.colorsteps.length).toEqual(2);
    expect(gradient.getColorString()).toEqual('yellow 0%,red 100%')

    secondColorStep.percent += 10
    expect(gradient.getColorString()).toEqual('yellow 0%,red 110%')

})

test('Gradient - remove ColorStep', () => {
    var gradient = new Gradient();
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 0}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 10}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 20}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 30}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 40}))

    expect(gradient.colorsteps.length).toEqual(5);
    gradient.clear()

    expect(gradient.colorsteps.length).toEqual(0);
})

test('Gradient - remove ColorStep by index', () => {
    var gradient = new Gradient();
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 0}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 10}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 20}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 30}))
    gradient.addColorStep(new ColorStep({color: 'yellow',percent: 40}))

    expect(gradient.colorsteps.length).toEqual(5);
    gradient.clear(0)

    expect(gradient.colorsteps.length).toEqual(4);
})

test('Gradient - add ColorStep List', () => {
    var gradient = new Gradient({
        colorsteps: [
            new ColorStep({color: 'yellow',percent: 0}),
            new ColorStep({color: 'yellow',percent: 10}),
            new ColorStep({color: 'yellow',percent: 20}),
            new ColorStep({color: 'yellow',percent: 30}),
            new ColorStep({color: 'yellow',percent: 40})
        ]
    });
    expect(gradient.colorsteps.length).toEqual(5);
    gradient.clear(2);

    expect(gradient.colorsteps.length).toEqual(4);
    gradient.clear(2);

    expect(gradient.getColorString()).toEqual('yellow 0%,yellow 10%,yellow 40%')

})


test('Gradient - reset color position', () => {
    var gradient = new Gradient();
    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 5
    }));

    gradient.addColorStep(new ColorStep({
        color: 'red',
        percent: 1
    }));

    expect(gradient.getColorString()).toEqual('red 1%,red 5%')
})

test('Gradient - insert color step ', () => {
    var gradient = new Gradient();
    gradient.insertColorStep(10);

    expect(gradient.getColorString()).toEqual('rgba(216,216,216,0) 10%,rgba(216,216,216,1) 100%')

    gradient.insertColorStep(20);

    expect(gradient.getColorString()).toEqual('rgba(216,216,216,0) 10%,rgba(216,216,216,0.11) 20%,rgba(216,216,216,1) 100%')    
})