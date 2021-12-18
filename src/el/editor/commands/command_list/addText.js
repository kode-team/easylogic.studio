import { Length } from "el/editor/unit/Length";

export default function addText (editor, rect = {}) {

    editor.emit('newComponent', 'text', {
        content: 'Insert a text',
        width: Length.px(300),
        height: Length.px(50),
        'font-size': Length.px(30),
        ...rect,        
    }, rect);
}