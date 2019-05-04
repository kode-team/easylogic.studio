import Filter from '../src/util/Filter'
import Color from '../src/util/Color'

test('gray filter', () => {
    const colorCode = Color.parse('#255050');

    let testData = [colorCode.r, colorCode.g, colorCode.b];

    Filter.grayscale(testData);

    expect(testData).toEqual([ 37, 80, 80 ]);
});
