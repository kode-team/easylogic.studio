import { EDIT_MODE_SELECTION } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import PathParser from 'el/editor/parser/PathParser';

/**
 * 
 * @param {Editor} editor 
 * @param {*} itemType 
 * @param {*} obj 
 * @param {*} isSelected 
 * @param {Item} [containerItem=undefined]  상위 부모 객체 
 */
export default function newComponent (editor, itemType, obj, isSelected = true, containerItem = undefined) {
    if (itemType === 'svg-textpath') {
        obj = {
            ...obj,
            'font-size': Length.parse(obj.height),
            textLength: '100%',
            d: PathParser.makeLine(0, obj.height.value, obj.width.value, obj.height.value).d,
        }
    } else if (itemType === 'svg-circle') {
        itemType = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,            
            fill: `#C4C4C4`,            
            d: PathParser.makeCircle(0, 0, obj.width.value, obj.height.value).d,
        }        

    } else if (itemType === 'svg-rect') {
        itemType = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,
            fill: `#C4C4C4`,            
            d: PathParser.makeRect(0, 0, obj.width.value, obj.height.value).d,
        }             
    } else if (itemType === 'text') {
        obj = {
            width: Length.px(300),
            height: Length.px(50),            
            ...obj,
        }        
    } else if (itemType === 'artboard') {
        obj = {
            ...obj,
            'background-color': 'white'
        }        
    } 

    editor.command('addLayer', `add layer - ${itemType}`, editor.createModel({
        itemType, 
        ...obj,
    }), obj, isSelected, containerItem)

    editor.changeMode(EDIT_MODE_SELECTION);
    
}    
