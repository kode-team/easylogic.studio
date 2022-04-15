import { isFunction } from "el/sapa/functions/func";
import { Editor } from "el/editor/manager/Editor";
import { Layout } from "el/editor/types/model";

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
            const item = editor.get(id);
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

        let hasRefreshCanvas = false;
        // send message 
        messages.forEach(message => { 
            const item = editor.get(message.id);

            // item 이 존재할 때 
            if (item) {
                // 값을 바로 설정한다. 
                item.reset(message.attrs, context);


                // [TIP] 
                // 부모의 레이아웃이 바뀌면  자식을 먼저 렌더링 하고 부모를 렌더링 한다. 
                if (item.hasChangedField('layout')) {
                    item.layers.forEach(child => {

                        // 어떤 속성을 바꿔야 하는지 고민을 좀 해봐야할 듯 
                        // 지금은 따로 속성을바꾸지 않기 때문에 이전의 레이아웃 아이템 속성이 그대로 복원될거다. 
                        if (child.isLayout(Layout.DEFAULT)) {
                            // grid, flex 속성 삭제 
                        } else if (child.isLayout(Layout.FLEX)) {
                            // grid 속성 삭제 
                        } else if (child.isLayout(Layout.GRID)) {
                            // flex 속성 삭제 
                        }

                        commandMaker.emit('refreshElement', child);
                    })
                }

                // 기본적으로 refreshElement 를 호출하면 children, changedChildren, parentId 등에 맞춰서 refreshAllCanvas 를 부르도록 되어 있다.                 
                // 여기서는 refresh 할 대상을 지정한다. 
                // refreshAllCanvas 를 한번에 할 예정이기 때문에 마지막 옵션을 false 로 지정한다. 
                commandMaker.emit('refreshElement', item, false);

                // 캔버스 갱신 여부를 지정한다. 
                if (item.hasChangedHirachy) {
                    hasRefreshCanvas = true;
                }
            }

            if (item.is('project')) {
                return;
            }

            if (item.parent && item.parent.is('project')) {
                return;
            }

            if (item.isLayoutItem() || item.isBooleanItem) {
                // 부모가 project 아닐 때만 업데이트 메세지를 날린다. 
                const parent = editor.get(message.parentId)
                if (message.parentId && parent?.isNot("project")) {
                    parent.reset({ 'changedChildren': true }, context);
                    // commandMaker.emit('update', message.parentId, { 'changedChildren': true }, context)
                    hasRefreshCanvas = true;
                }

            }


        })

        // commandMaker.log();

        // canvas 를 재조정할일이 있으면 canvas 구조를 다시 그린다. 
        if (hasRefreshCanvas) {
            editor.emit('refreshAllCanvas');
        }

        // run multi command 
        commandMaker.run();
    }
}