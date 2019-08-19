import { makeNumberInterpolator, makeColorInterpolator } from "../../../src/editor/animations/interpolator/Interpolator";

beforeEach(() => {


})

afterEach( () => {

})

test('Interpolator - linear', () => {
    var f = makeNumberInterpolator(0, 100, (time) => {
        return time/100
    })

    expect( f(0)).toEqual(0);
    expect( f(50)).toEqual(50);
});

test('Interpolator - color', () => {
    var f = makeColorInterpolator('rgba(255, 255, 255, 0)', 'rgba(255, 0, 255, 1)', (time) => {
        return time/255; 
    })

    expect(f(255)).toEqual('rgba(255, 0, 255, 1)');
})