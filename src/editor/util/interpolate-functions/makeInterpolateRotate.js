import { Length } from "../../unit/Length";

function getRealAttributeValue (layer, property, value) {
    return value.toDeg(); 
}

export function makeInterpolateRotate(layer, property, startNumber, endNumber) {
    var s = Length.parse(startNumber);
    var e = Length.parse(endNumber);

    return (rate, t) => {
        var realStartValue = getRealAttributeValue(layer, property, s);
        var realEndValue = getRealAttributeValue(layer, property, e);

        if (t === 0) {
            return realStartValue;
        } else if (t === 1) {
            return realEndValue;
        }

        return Length.deg(realStartValue.value + (realEndValue.value - realStartValue.value) * rate).to(s.unit);
    }
}
