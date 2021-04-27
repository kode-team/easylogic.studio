const map = {};


export function registElement(classes = {}) {

    Object.keys(classes).forEach(key => {
        if (map[key]) {
            console.warn(`${key} element is duplicated.`)
            return;
        } 

        map[key] = classes[key];
    })
}

export function retriveElement(className) {
    return map[className];
}