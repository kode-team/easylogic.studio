import { isBoolean, isNotUndefined, isObject, isUndefined } from './func';
import { registElement, variable } from './registElement';



function CSS_TO_STRING(style, postfix = '') {
    var newStyle = style || {};

    return Object.keys(newStyle)
        .filter(key => isNotUndefined(newStyle[key]))
        .map(key => `${key}: ${newStyle[key]}`)
        .join(";" + postfix);
}

function OBJECT_TO_PROPERTY(obj) {
    const target = obj || {};

    return Object.keys(target).map(key => {

        if (key === 'class') {
            if (isObject(obj[key])) {
                return `${key}="${OBJECT_TO_CLASS(obj[key])}"`
            }
        }

        if (key === 'style') {
            if (isObject(obj[key])) {
                return `${key}="${CSS_TO_STRING(obj[key])}"`
            }
        }

        if (isBoolean(obj[key]) || isUndefined(obj[key]) || obj[key] === 'undefined') {
            if (obj[key]) {
                return key;
            } else {
                return '';
            }
        }

        return `${key}="${obj[key]}"`
    }).join(' ');
}

function OBJECT_TO_CLASS(obj) {
    return Object.keys(obj).filter(k => obj[k]).map(key => {
        return key
    }).join(' ');
}


export function createElement (Component, props, ...children) {

    if (typeof Component === 'function') {
        return Component(props, children);
    } else if (typeof Component !== 'string') {
        const ComponentName = Component.name;
        registElement({
            [ComponentName]: Component
        })

        return /*html*/`<object refClass="${ComponentName}" ${variable(props)}>${children.join('')}</object>`;
    } else {
        return /*html*/`<${Component} ${OBJECT_TO_PROPERTY(props)}>${children.join('')}</${Component}>`;
    }


}