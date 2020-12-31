import { getVertiesMinX } from "@core/functions/math";

export default {
    command : 'sort.left',
    execute: function (editor) {

        if (editor.selection.isOne) {

            const current = editor.selection.current; 

            if (current.parent.is('project')) {
                // 상위 객체가 project 이면 움직이지 않는다. 
            } else if (current.artboard) {
                // 선택된 객체가 하나이고 artboard 가 존재하면 artboard 를 기준으로 잡는다. 
                const distX = getVertiesMinX(current.artboard.verties()) - getVertiesMinX(editor.selection.verties);
                editor.emit('moveLayer', distX, 0);
            }

        } else if (editor.selection.isMany) {
            let maxRightX = getVertiesMinX(editor.selection.verties);

            editor.emit('moveLayerForItems', editor.selection.map(item => {
                let itemRightX = getVertiesMinX(item.verties());

                return { item, dist: [maxRightX - itemRightX, 0, 0]}

            }));            

        }
    }
}