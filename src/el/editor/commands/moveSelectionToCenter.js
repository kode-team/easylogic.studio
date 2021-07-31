import { itemsToRectVerties } from "el/utils/collision";
import { Editor } from "el/editor/manager/Editor";

export default {
    command: 'moveSelectionToCenter',

    description: 'Move selection project or artboards to center on Viewport',

    /**
     * 
     * @param {Editor} editor 
     * @param {vec3[]} areaVerties 
     * @param {boolean} [withScale=true]    scale 도 같이 조절 할지 정리 
     */
    execute: function (editor, withScale = true) {

        let areaVerties = []

        if (editor.selection.isEmpty) {
          areaVerties = editor.selection.currentProject.rectVerties;
        } else {
          areaVerties = itemsToRectVerties(editor.selection.items);
        }
    
        editor.emit('moveToCenter', areaVerties, withScale);        
    }

}