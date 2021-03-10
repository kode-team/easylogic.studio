const map = {};


export function registElement(classes = {}) {
    Object.assign(map, classes)
}

export function retriveElement(className) {
    return map[className];
}