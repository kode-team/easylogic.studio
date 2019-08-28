import { Length } from "../../unit/Length";

function getRealAttributeValue (layer, property, value, refType = 'width', refElement = 'parent') {

    var refObject = null
    if (refElement === 'parent') {
        refObject = layer[refElement][refType];
    } else if (refElement === 'self') {
        refObject = layer[refType];
    }

    if (refObject) {
        return value.toPx(refObject.value)
    }

    return value; 
}


function rollbackRealAttributeValue (layer, property, value, unit, refType = 'width', refElement = 'parent') {

    var refObject = null
    if (refElement === 'parent') {
        refObject = layer[refElement][refType];
    } else if (refElement === 'self') {
        refObject = layer[refType];
    }

    if (refObject) {
        return value.to(unit, refObject.value)
    }

    return value; 
}

export function makeInterpolateLength(layer, property, startNumber, endNumber, refType = 'width', refElement = 'parent') {
    var s = Length.parse(startNumber);
    var e = Length.parse(endNumber);

    return (rate, t) => {
        var realStartValue = getRealAttributeValue(layer, property, s, refType, refElement);
        var realEndValue = getRealAttributeValue(layer, property, e, refType, refElement);

        if (t === 0) {
            return realStartValue;
        } else if (t === 1) {
            return realEndValue;
        }


        return rollbackRealAttributeValue(
            layer, 
            property, 
            Length.px(realStartValue.value + (realEndValue.value - realStartValue.value) * rate), 
            s.unit, 
            refType,
            refElement
        );
    }
}
