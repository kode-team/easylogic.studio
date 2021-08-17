import { EDIT_MODE_SELECTION } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import PathStringManager from "el/editor/parser/PathStringManager";

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
            d: PathStringManager.makeLine(0, 1, 1, 1),
        }
    } else if (itemType === 'svg-circle') {
        itemType = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,            
            fill: `#C4C4C4`,            
            d: PathStringManager.makeCircle(0, 0, 1, 1),
        }        

    } else if (itemType === 'svg-rect') {
        itemType = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,
            fill: `#C4C4C4`,            
            d: PathStringManager.makeRect(0, 0, 1, 1),
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
    editor.emit('afterChangeMode');
}    
