import { isFunction } from "el/sapa/functions/func";
import { Editor } from "el/editor/manager/Editor";

export default {
    command: 'setAttributeForMulti',
    /**
     * 
     * @param {Editor} editor 
     * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
     */
    execute: function (editor, multiAttrs = {}) {

        const messages = []

        Object.entries(multiAttrs).forEach(([id, attrs]) => {
            const item = editor.modelManager.get(id);            
            const newAttrs = {};

            Object.entries(attrs).forEach(([key, value]) => {
                newAttrs[key] = isFunction(value) ? value(item) : value;
            })

            messages.push({ id: item.id, attrs: newAttrs })
        })


        // send message 
        messages.forEach(message => {
            editor.emit('update', message.id, message.attrs)   
        })

    }
}