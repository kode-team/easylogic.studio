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

    if (!itemType.includes('text') && !obj['background-color']) {
        obj['background-color'] = '#c4c4c4'; //Color.random();
    } 

    if (itemType === 'svg-textpath') {
        obj = {
            ...obj,
            text: 'Insert a newText',
            'font-size': Length.parse(obj.height),
            textLength: '100%',
            d: PathStringManager.makeLine(0, obj.height.value, obj.width.value, obj.height.value),
        }
    } else if (itemType === 'svg-circle') {
        itemType = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,            
            fill: `#C4C4C4`,            
            d: PathStringManager.makeCircle(0, 0, obj.width.value, obj.height.value),
        }        

    } else if (itemType === 'svg-rect') {
        itemType = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,
            fill: `#C4C4C4`,            
            d: PathStringManager.makeRect(0, 0, obj.width.value, obj.height.value),
        }                

    } else if (itemType === 'text') {
        obj = {
            width: Length.px(300),
            height: Length.px(50),            
            ...obj,
            content: 'Insert a text',
            'font-size': Length.px(30)
        }        
    } else if (itemType === 'artboard') {
        obj = {
            ...obj,
            'background-color': 'white'
        }        
    } 

    editor.command('addLayer', `add layer - ${itemType}`, editor.createItem({
        itemType, 
        ...obj,
    }), obj, isSelected, containerItem)

    editor.changeMode(EDIT_MODE_SELECTION);
    editor.emit('afterChangeMode');
}    
