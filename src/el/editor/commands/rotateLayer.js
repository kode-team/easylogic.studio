import { Editor } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import { Transform } from "../property-parser/Transform";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'rotateLayer',

    description: 'rotate layer by keydown with matrix ',
    /**
     * 
     * @param {Editor} editor 
     * @param {number} dx
     * @param {number} dy
     */
    execute: function (editor, distAngle = 0) {

        editor.command('setAttributeForMulti', 'change rotate', editor.selection.packByValue({
            transform: (item) => Transform.addTransform(item.transform, `rotateZ(${Length.deg(distAngle).round(1000)})`)
        }));     

        editor.nextTick(() =>{
            editor.selection.reselect();
            editor.emit('refreshAll')
        })
    }
}