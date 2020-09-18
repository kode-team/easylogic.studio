import { Editor } from "@manager/Editor";
import { Length } from "@unit/Length";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'moveLayer',
    /**
     * 
     * @param {Editor} editor 
     * @param {number} dx
     * @param {number} dy
     */
    execute: function (editor, dx = 0, dy = 0) {

        const itemsMap = {}

        editor.selection.each(item => {
            itemsMap[item.id] = {
                x: Length.px(item.x.toPx().value + dx),
                y: Length.px(item.y.toPx().value + dy) 
            }
        })

        editor.emit('history.setAttributeForMulti', 'item move down', itemsMap);     

        editor.nextTick(() =>{
            editor.emit('refreshAll')
        })
    }
}