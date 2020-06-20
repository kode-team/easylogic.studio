import { EDIT_MODE_SELECTION } from "../../editor/Editor";
import Color from "../../util/Color";
import { Length } from "../../editor/unit/Length";
import PathStringManager from "../../editor/parse/PathStringManager";



export default function newComponent (editor, type, obj, isSelected = true) {

    if (!type.includes('text') && !obj['background-color']) {
        obj['background-color'] = Color.random();
    } 

    if (type === 'svg-textpath') {
        obj = {
            ...obj,
            text: 'Insert a newText',
            'font-size': Length.parse(obj.height),
            textLength: '100%',
            d: PathStringManager.makeLine(0, obj.height.value, obj.width.value, obj.height.value),
        }

    } else if (type === 'svg-circle') {
        type = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,            
            d: PathStringManager.makeCircle(0, 0, obj.width.value, obj.height.value),
        }        

    } else if (type === 'svg-rect') {
        type = 'svg-path';
        obj = {
            ...obj,
            'background-color': undefined,
            d: PathStringManager.makeRect(0, 0, obj.width.value, obj.height.value),
        }                

    } else if (type === 'text') {
        obj = {
            width: Length.px(300),
            height: Length.px(50),            
            ...obj,
            content: 'Insert a text',
            'font-size': Length.px(30)
        }        
    }

    editor.emit('addLayer', editor.components.createComponent(type, {
        ...obj,
    }), obj, isSelected)

    editor.changeMode(EDIT_MODE_SELECTION);
    editor.emit('afterChangeMode');
}    
