import { Length } from "../../editor/unit/Length";

export default function addText (editor, rect = {}) {

    editor.trigger('addLayer', editor.createComponent('text', {
        content: 'Insert a text',
        width: Length.px(300),
        height: Length.px(50),
        ...rect,
        'font-size': Length.px(30)
    }), rect)

}