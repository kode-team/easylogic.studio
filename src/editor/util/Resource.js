function makeFilePromise (it) {
    return new Promise((resolve, reject) => {
        resolve({
            kind: it.kind, 
            type: it.type, 
            data: it.getAsFile()
        })
    })
}

function makeStringPromise (it) {
    return new Promise((resolve, reject) => {

        it.getAsFile(content => {
        
            resolve({
                kind: it.kind, 
                type: it.type, 
                data: content  
            })
        })

    })
}
  
export default class Resource {
    static getAllDropItems (e) {
        var items = [...e.dataTransfer.types].map((type, index) => {

            if (type.includes('text')) {
                return {
                    kind: 'string', 
                    type,
                    data: e.dataTransfer.getData(type)
                }
            }
        }).filter(it => it);
    
        var files = [...e.dataTransfer.files]

        return  [...items, ...files]
    }
}


const SVG_PROPERTY_LIST = {
    'd': true,
    'points': true,
    'fill': true,
    'fill-opacity': true, 
    'stroke': true,
    'stroke-width': true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    'fill-rule': true,
    'stroke-linecap': true,
    'stroke-linejoin': true
}

const CSS_PROPERTY_LIST = {
    'position': true,
    'x': true,
    'y': true,
    'right': true,
    'bottom': true,
    'width': true,
    'height': true,
    'rootVariable': true,
    'variable': true,
    'transform': true,
    'filter': true,
    'backdrop-filter': true,
    'background-color': true,      
    'background-clip': true,
    'background-image': true,      
    'border-radius': true,      
    'box-shadow': true,
    'text-shadow': true,
    'text-clip': true,      
    'clip-path': true,
    'color': true,
    'font-size': true,
    'font-stretch': true,
    'line-height': true,
    'text-align': true,
    'text-transform': true,
    'text-decoration': true,
    'letter-spacing': true, 
    'word-spacing': true, 
    'text-indent': true,      
    'perspective-origin': true,
    'transform-origin': true,
    'transform-style': true,
    'perspective': true,
    'mix-blend-mode': true,
    'opacity': true,
    'rotate': true,    
    'text-fill-color': true,
    'text-stroke-color': true,
    'text-stroke-width': true,  
    'offset-path': true,
    'offset-distance': true,
    border: true,
    outline: true,
    borderRadius: true,
    // borderImage: true,
    animations: true,
    transitions: true
}

export const hasSVGProperty = (property) => {
    return SVG_PROPERTY_LIST[property] || false 
}

export const hasCSSProperty = (property) => {
    return CSS_PROPERTY_LIST[property] || false 
}

export const hasCustomProperty = (property) => {
    return hasSVGProperty(property) === false && hasCSSProperty(property) === false
}

export const saveResource = (key, value) => {
    window.localStorage.setItem(`easylogic.studio.${key}`, JSON.stringify(value));
}

export const loadResource = (key, defaultValue) => {
    return JSON.parse(window.localStorage.getItem(`easylogic.studio.${key}`) || JSON.stringify(defaultValue))
}