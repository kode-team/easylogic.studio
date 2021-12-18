import { Editor } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
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
                x: Length.px(it.item.offsetX.value + it.dist[0]).round(),
                y: Length.px(it.item.offsetY.value + it.dist[1]).round() 
            }
        })

        editor.emit('history.setAttributeForMulti', 'item move down', itemsMap);     

        editor.nextTick(() =>{
            editor.selection.reselect();
            editor.emit('refreshAll')
        })
    }
}