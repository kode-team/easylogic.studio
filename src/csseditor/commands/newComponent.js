import { EDIT_MODE_SELECTION } from "../../editor/Editor";
import Color from "../../util/Color";
import { Length } from "../../editor/unit/Length";
import PathStringManager from "../../editor/parse/PathStringManager";



export default function newComponent (editor, type, obj) {

    if (!type.includes('text')) {
        obj['background-color'] = Color.random();
    } 

    if (type === 'svgtextpath') {
        obj = {
            ...obj,
            text: 'Insert a newText',
            'font-size': Length.parse(obj.height),
            textLength: '100%',
            d: PathStringManager.makeLine(0, obj.height.value, obj.width.value, obj.height.value),
        }


    } else if (type === 'text') {
        obj = {
            ...obj,
            content: 'Insert a text',
            width: Length.px(300),
            height: Length.px(50),
            'font-size': Length.px(30)
        }        
    }

    editor.emit('addLayer', editor.components.createComponent(type, {
        ...obj,
    }), obj)

    editor.changeMode(EDIT_MODE_SELECTION);
    editor.emit('afterChangeMode');
}    
