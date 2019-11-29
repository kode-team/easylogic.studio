import { editor } from "../editor"
import { isArray, isObject, isString } from "../../util/functions/func";
import AssetParser from "../parse/AssetParser";

export default class Resource {
    static getAllDropItems (e) {
        var items = []
        
        if (e.dataTransfer ) {
            items = [...e.dataTransfer.types].map((type, index) => {

                if (type.includes('text')) {
                    return {
                        kind: 'string', 
                        type,
                        data: e.dataTransfer.getData(type)
                    }
                }
            }).filter(it => it);
        }
    
        var files = [] 
        
        if (e.dataTransfer) {
            files = [...e.dataTransfer.files]
        }

        return  [...items, ...files]
    }
}


export const blend_list = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
].join(',');

const SVG_PROPERTY_LIST = {
    'text': true, 
    'points': true,
    'textLength': true, 
    'startOffset': true,
    'lengthAdjust': true 
}

const SVG_PATH_PROPERTY_LIST = {
    'd': true
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
    transitions: true,
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

export const hasSVGProperty = (property) => {
    return SVG_PROPERTY_LIST[property] || false 
}

export const hasSVGPathProperty = (property) => {
    return SVG_PATH_PROPERTY_LIST[property] || false 
}

export const hasCSSProperty = (property) => {
    return CSS_PROPERTY_LIST[property] || false 
}

export const hasCustomProperty = (property) => {
    return hasSVGProperty(property) === false && hasCSSProperty(property) === false
}


export const replaceLocalUrltoRealUrl = (str) => {

    var project = editor.selection.currentProject;
    var images = {} 

    project.images.forEach(a => {
      if (str.indexOf(a.local) > -1) { 
        images[a.local]  = a.original
      }
    })

    Object.keys(images).forEach(local => {
        if (str.indexOf(local) > -1) {
            str = str.replace(new RegExp(local, 'g'), images[local])
        }
    })
    
    return str; 
  }

export const replaceLocalUrltoId = (str) => {

    var projects = editor.projects;
    var images = {} 

    projects.forEach(project => {

        project.images.forEach(a => {
            if (str.indexOf(a.local) > -1) { 
                images[a.local]  = '#' + a.id
            }
        })
    })


    Object.keys(images).forEach(local => {
        if (str.indexOf(local) > -1) {
            str = str.replace(new RegExp(local, 'g'), images[local])
        }
    })

    return str; 
}

export const makeResource = (json) => {
    var result = JSON.stringify(json)

    // image check 
    result = replaceLocalUrltoId(result);

    return result;
}



export const saveResource = (key, value) => {
    window.localStorage.setItem(`easylogic.studio.${key}`, makeResource(value));
}

export const saveItem = (key, value) => {
    window.localStorage.setItem(`easylogic.studio.${key}`, JSON.stringify(value));
}


export const applyAsset = (json, assets) => {
    if (isArray(json)) {
        json = json.map(it => applyAsset(it, assets))
    } else if (isObject(json)) {
        Object.keys(json).forEach(key => {
            json[key] = applyAsset(json[key], assets);
        }) 
    } else if (isString(json)) {

        Object.keys(assets).forEach(idString => {
            var a = assets[idString]
            if (json.indexOf(`#${a.id}`) > -1) {
                json = json.replace(new RegExp(`#${a.id}`, 'g'), a.local);
            }

        })
    }

    return json; 
}

/**
 * 
 * recover origin to local blob url for Asset 
 * 
 * @param {string} value JSON String for project list 
 */
export const revokeResource = (value) => {
    var json = JSON.parse(value || '[]');
    var assets = {} 

    json.forEach(project => {
        project.images.forEach(it => {
            assets[`#${it.id}`] = it; 
        })
    })

    Object.keys(assets).map(idString => {
        var a = assets[idString];
        var info = AssetParser.parse(a.original, true);
        a.local = info.local;
    })

    json.forEach(project => {
        project.layers = applyAsset(project.layers, assets);
    })

    return json; 
}

export const loadResource = (key) => {
    return revokeResource(window.localStorage.getItem(`easylogic.studio.${key}`))
}

export const loadItem = (key) => {
    return JSON.parse(window.localStorage.getItem(`easylogic.studio.${key}`) || JSON.stringify(""))
}