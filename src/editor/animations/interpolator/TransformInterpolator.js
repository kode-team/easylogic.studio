import { makeNumberInterpolator } from "./Interpolator";
import { Transform } from "../../css-property/Transform";

export function makeTransformInterpolator (fromValue, toValue, f) {
    const fromValues = Transform.parseStyle(fromValue);
    const toValues = Transform.parseStyle(toValue);

    let fromValueObject = initDefaultValue(fromValues);
    let toValueObject = initDefaultValue(toValues);

    let list = Object.keys(fromValueObject).map(type => {

        var first = fromValueObject[type];
        var second = toValueObject[type];

        return makeTransformValueInterpolator(type, first, second, f)
    })

    return (time) => {
        return Transform.join(list.map(it => {
            return {type: it.type, value: it.f(time)}
        }))
    }
}

function makeTransformValueInterpolator (type, fromValue, toValue, f) {

    return {
        type,
        f: makeNumberInterpolator(fromValue.value, toValue.value, f)
    }
}


function initDefaultValue (list) {
    var obj = {} 

    list.forEach(it => {
        switch(it.type) {
        case 'translateX': obj['translateX'] = it.value[0];break; 
        case 'translateY': obj['translateY'] = it.value[0];break; 
        case 'translateZ': obj['translateZ'] = it.value[0];break;         
        case 'translate': 
            obj['translateX'] = it.value[0];
            obj['translateY'] = it.value[1];
            break; 
        case 'translate3d': 
            obj['translateX'] = it.value[0];
            obj['translateY'] = it.value[1];
            obj['translateZ'] = it.value[2];
            break;             
        case 'rotate': 
        case 'rotateZ': 
            obj['rotateZ'] = it.value[0];break;                     
        }
    })

    return obj; 
}