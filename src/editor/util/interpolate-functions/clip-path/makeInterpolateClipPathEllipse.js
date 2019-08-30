import { makeInterpolateLength } from "../makeInterpolateLength";

export function makeInterpolateClipPathEllipse (layer, property, s, e) {

    var obj = {
        radiusX: makeInterpolateLength(layer, property, s.radiusX, e.radiusX, 'width', 'self'),
        radiusY: makeInterpolateLength(layer, property, s.radiusY, e.radiusY, 'height', 'self'),
        x: makeInterpolateLength(layer, property, s.x, e.x, 'width', 'self'),
        y: makeInterpolateLength(layer, property, s.y, e.y, 'height', 'self')        
    }

    return (rate, t) => {

        var radiusX = obj.radiusX(rate, t);
        var radiusY = obj.radiusY(rate, t);
        var x = obj.x(rate, t);
        var y = obj.y(rate, t);

        return `${radiusX} ${radiusY} at ${x} ${y}`;
    } 
}
