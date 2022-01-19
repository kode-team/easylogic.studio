import { Editor } from "el/editor/manager/Editor";
import { round } from "el/utils/math";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'moveLayerForItems',

    description: 'mova layer by multi items ',
    /**
     * 
     * @param {Editor} editor 
     * @param {number} dx
     * @param {number} dy
     */
    execute: function (editor, moveItems = []) {
        const itemsMap = {}

        moveItems.forEach(it => {
            itemsMap[it.item.id] = {
                x: round(it.item.offsetX + it.dist[0]),
                y: round(it.item.offsetY + it.dist[1])
            }
        })

        editor.emit('history.setAttributeForMulti', 'item move down', itemsMap);     

        editor.nextTick(() =>{
            editor.selection.reselect();
            editor.emit('refreshAll')
        })
    }
}