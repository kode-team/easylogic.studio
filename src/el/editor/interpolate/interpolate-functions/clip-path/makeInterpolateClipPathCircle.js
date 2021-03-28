import { makeInterpolateBoolean } from "../makeInterpolateBoolean";
import { makeInterpolateLength } from "../makeInterpolateLength";

export function makeInterpolateClipPathCircle (layer, property, s, e) {

    //radius, x, y
    // radius : length - percent closest-side | farthest-side

    var obj = {}

    if (
        s.radius === 'closest-side' || 
        s.radius === 'farthest-side' ||  
        e.radius === 'closest-side' || 
        e.radius === 'farthest-side'
    ) {
        obj.radius = makeInterpolateBoolean(layer, property, s.radius, e.radius)
    } else {

        if (s.radius.unit === e.radius.unit) {
            obj.radius = makeInterpolateNumber(layer, property, s.radius.value, e.radius.value, s.radius.unit)
        } else {
            obj.radius = makeInterpolateLength(layer, property, s.radius, e.radius, 'width', 'self')
        }
    }

    obj.x = makeInterpolateLength(layer, property, s.x, e.x, 'width', 'self')
    obj.y = makeInterpolateLength(layer, property, s.y, e.y, 'height', 'self')

    return (rate, t) => {

        var radius = obj.radius(rate, t);
        var x = obj.x(rate, t);
        var y = obj.y(rate, t);

        var results = `${x} ${y}`

        var radiusString = radius + '';

        if (radiusString.includes('closest-side')) {
            radiusString = 'closest-side'
        } else if (radiusString.includes('farthest-side')) {
            radiusString = 'farthest-side'
        }

        return radius ? `${radiusString} at ${results}` :  `${results}`;

    } 
}
