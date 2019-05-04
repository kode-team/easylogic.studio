import Blender from '../src/util/Blender'
import Color from '../src/util/Color'

test('Blend - normal', () => {
    const back = Color.parse('#255050');
    const source = Color.parse('#2550ff');

    var rgb = Blender.normal(back, source);
    
    expect(rgb).toEqual({ r : 0x25, g : 0x50, b: 0xff, a : 1 });

    rgb = Blender.multiply(back, source);
});
