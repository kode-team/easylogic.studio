import { Editor } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'moveLayer',

    description: 'mova layer by keydown with matrix ',
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
                x: Length.px(item.offsetX.value + dx).round(),
                y: Length.px(item.offsetY.value + dy).round() 
            }
        })

        editor.emit('history.setAttributeForMulti', 'item move down', itemsMap);     

        editor.nextTick(() =>{
            editor.selection.reselect();
            editor.emit('refreshAll')
        })
    }
}