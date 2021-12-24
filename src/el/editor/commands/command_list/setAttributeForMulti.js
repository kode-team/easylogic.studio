import { isFunction } from "el/sapa/functions/func";
import { Editor } from "el/editor/manager/Editor";

export default {
    command: 'setAttributeForMulti',
    /**
     * 
     * @param {Editor} editor 
     * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
     */
    execute: function (editor, multiAttrs = {}, context = {origin: '*'}) {
        const messages = []

        Object.entries(multiAttrs).forEach(([id, attrs]) => {
            const item = editor.modelManager.get(id);            
            const newAttrs = {};

            Object.entries(attrs).forEach(([key, value]) => {
                newAttrs[key] = isFunction(value) ? value(item) : value;
            })

            messages.push({ id: item.id, parentId: item.parentId, attrs: newAttrs })
        })

        if (messages.length == 0) {
            return;
        }

        const commandMaker = editor.createCommandMaker();

        // send message 
        messages.forEach(message => {
            commandMaker.emit('update', message.id, message.attrs, context);

            // 부모가 project 아닐 때만 업데이트 메세지를 날린다. 
            const parent = editor.get(message.parentId)
            if (message.parentId && parent?.isNot("project") && parent.children.length >= 1) {
                commandMaker.emit('update', message.parentId, { 'changedChildren': true }, context)
            }
        })

        // run multi command 
        commandMaker.run();
    }
}