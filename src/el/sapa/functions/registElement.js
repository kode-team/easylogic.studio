import { uuidShort } from "./uuid";
import { isString } from './func';

const map = {};
const __tempVariables = new Map();

export const VARIABLE_SAPARATOR = "__ref__variable:";


/**
 * props 를 넘길 때 해당 참조를 그대로 넘기기 위한 함수 
 * 
 * @param {any} value
 * @returns {string} 참조 id 생성 
 */
export function variable(value) {
    const id = `${VARIABLE_SAPARATOR}${uuidShort()}`;

    __tempVariables.set(id, value);

    return id;
}



/**
 * 참조 id 를 가지고 있는 variable 을 복구한다. 
 * 
 * @param {string} id
 * @returns {any}
 */
export function recoverVariable(id) {

    // console.log(id);
    if (isString(id) === false) {
        return id;
    }

    let value = id;

    if (__tempVariables.has(id)) {
        value = __tempVariables.get(id);

        __tempVariables.delete(id);
    }

    return value;
}

export function hasVariable(id) {
    return __tempVariables.has(id);
}

/**
 * 객체를 key=value 문자열 리스트로 변환한다. 
 * 
 * @param {object} obj 
 * @returns {string}
 */
export function spreadVariable(obj) {

    return Object.entries(obj).map(([key, value]) => {
        return `${key}=${variable(value)}`
    }).join(" ");

}


export function registElement(classes = {}) {

    Object.keys(classes).forEach(key => {
        if (map[key]) {
            // console.warn(`${key} element is duplicated.`)
            return;
        }

        map[key] = classes[key];
    })
}

export function retriveElement(className) {
    return map[className];
}