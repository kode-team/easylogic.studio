import { editor } from "../../../src/editor/editor";
import { RepeatingRadialGradient } from "../../../src/editor/image-resource/RepeatingRadialGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";
import { Length } from "../../../src/editor/unit/Length";

beforeEach(() => {
    editor.clear();

})

afterEach( () => {
    editor.clear();
})

test('RepeatingRadialGradient - new RepeatingRadialGradient', () => {
    var gradient = new RepeatingRadialGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('repeating-radial-gradient');
    expect(gradient+"").toEqual('repeating-radial-gradient(ellipse at center center, )')
});

test('RepeatingRadialGradient - set radialType', () => {
    var gradient = new RepeatingRadialGradient({
        radialType: 'circle'
    });

    expect(gradient+"").toEqual('repeating-radial-gradient(circle at center center, )')

    gradient.radialType = 'closest-corner'
    expect(gradient+"").toEqual('repeating-radial-gradient(closest-corner at center center, )')
});

test('RepeatingRadialGradient - set radial position', () => {
    var gradient = new RepeatingRadialGradient({
        radialPosition: [ Length.px(10), Length.percent(20) ],
    });
    expect(gradient+"").toEqual('repeating-radial-gradient(ellipse at 10px 20%, )')
});

test('RepeatingRadialGradient - add ColorStep', () => {
    var gradient = new RepeatingRadialGradient();
    gradient.addColorStep(new ColorStep({
        color: 'yellow',
        percent: 100
    }))

    expect(gradient+"").toEqual('repeating-radial-gradient(ellipse at center center, yellow 100%)')
});
