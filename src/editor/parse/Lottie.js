
import json from '../../assets/whale.json';

const a = json 

const ANIMATION_FIELD = {
    'ip': 'inPoint',
    'op': 'outPoint',
    'ddd': '3d',
    'fr': 'frameRate',
    'w': 'width',
    'h': 'height',
    'v': 'version',
    'nm': 'Name',
    'layers': 'layers',
    'assets': 'assets',
    'chars': 'chars'
}

const LAYER_FIELD = {
    'nm': 'Name',    
    'ip': 'inPoint',
    'op': 'outPoint',
    'ty': 'type',
    'ks': 'transform',
    'ao': 'autoOrient',
    'ind': 'index',
    'cl': 'class',
    'ln': 'id',
    'st': 'startTime',
    'ef': 'effects',
    'sr': 'stretch',
    'parent': 'parent',
    'shapes': 'shapes',
    'bm': 'blendMode',
    'hasMask': 'hasMask',
    'maskProperties': 'maskProperties',
    'it': 'items'
}


const SHAPE_FIELD = {
    'nm': 'Name',    
    'ip': 'inPoint',
    'op': 'outPoint',
    'd': 'direction',
    'p': 'position',
    's': 'size',
    'ty': 'type',
    'ks': 'transform',
    'ao': 'autoOrient',
    'ind': 'index',
    'cl': 'class',
    'ln': 'id',
    'st': 'startTime',
    'ef': 'effects',
    'sr': 'stretch',
    'parent': 'parent',
    'shapes': 'shapes',
    'bm': 'blendMode',
    'hasMask': 'hasMask',
    'maskProperties': 'maskProperties',
    'it': 'items',
    'mn': 'matchName'
}

const TRANSFORM_FIELD = {
    nm: 'name',
    a: 'anchorPoint',
    p: 'position',
    s: 'scale',
    r: 'rotation',
    o: 'opacity',
    sk: 'skew',
    sa: 'skewAxis'

}

var fields = {

'ty': 'type',
'ks': 'transform',
'ao': 'autoOrient',
'ind': 'index',
'cl': 'class',
'ln': 'id',
'st': 'startTime',
'ef': 'effects',
'sr': 'stretch',
'parent': 'parent',
'shapes': 'shapes',
'bm': 'blendMode',
'hasMask': 'hasMask',
'maskProperties': 'maskProperties',
'refId': 'refId',
'a': 'anchorPoint',
'p': 'position',
's': 'scale',
'r': 'rotation',
'o': 'opacity',
'px': 'positionX',
'py': 'positionY',
'pz': 'positionZ',
'sk': 'skew',
'sa': 'skew Axis',
'mn': 'matchName'
}

const convertKeyField = (json, fields) => {
    var temp = {} 
    Object.keys(json).forEach(key => {
        console.log(fields[key], key)
        temp[fields[key] || key] = json[key];
    })

    return temp;
}



export default class Lottie {
    constructor (json) {

        json = convertKeyField(json, ANIMATION_FIELD)

        console.log(json.layers);

        if (json && json.layers) {
            json.layers = json.layers.map(layer => {

                layer.shapes = layer.shapes.map(s => {

                    var shape = convertKeyField(s, SHAPE_FIELD);

                    shape.items = shape.items.map(it => {
                        it = convertKeyField(it, SHAPE_FIELD)

                        it = convertKeyField(it, TRANSFORM_FIELD)

                        // it.transform = convertKeyField(it.transform || {}, TRANSFORM_FIELD)

                        if (it.anchorPoint) {
                            
                        }


                        return it; 
                    })

                    return shape;
                })

                

                layer = convertKeyField(layer, LAYER_FIELD);
                layer.transform = convertKeyField(layer.transform, TRANSFORM_FIELD)
                return layer; 
            })
        }


        console.log(json);
    }
}

new Lottie(json)