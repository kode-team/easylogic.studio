import ImageFilter from '../src/util/ImageFilter'
import Color from '../src/util/Color'
import { filter } from '../src/util/filter/functions';

test('image gray filter', () => {
    const colorCode = Color.parse('#255050');

    const buffer = {
        pixels: [ colorCode.r, colorCode.g, colorCode.b, 255],
        width: 1,
        height: 1
    }

    var callback = filter('grayscale(100)')

    callback(buffer, function (newBitmap) {
        var a = [...newBitmap.pixels].map(it => Math.floor(it));

        expect(a).toEqual([ 70, 78, 76,  255]);
    });

    
});
