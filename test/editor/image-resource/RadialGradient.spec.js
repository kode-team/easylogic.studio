import { editor } from "../../../src/editor/editor";
import { RadialGradient } from "../../../src/editor/image-resource/RadialGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";
import { Length } from "../../../src/editor/unit/Length";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})

test('RadialGradient - new RadialGradient', () => {
    var gradient = new RadialGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('radial-gradient');
    expect(gradient+"").toEqual('radial-gradient(ellipse at center center, )')
});

test('RadialGradient - set radialType', () => {
    var gradient = new RadialGradient({
        radialType: 'circle'
    });

    expect(gradient+"").toEqual('radial-gradient(circle at center center, )')

    gradient.radialType = 'closest-corner'
    expect(gradient+"").toEqual('radial-gradient(closest-corner at center center, )')
});

test('RadialGradient - set radial position', () => {
    var gradient = new RadialGradient({
        radialPosition: [ Length.px(10), Length.percent(20) ],
    });
    expect(gradient+"").toEqual('radial-gradient(ellipse at 10px 20%, )')
});

test('RadialGradient - add ColorStep', () => {
    var gradient = new RadialGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 100
    }))

    expect(gradient+"").toEqual('radial-gradient(ellipse at center center, yellow 100%)')
});
