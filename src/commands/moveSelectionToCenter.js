import { itemsToRectVerties } from "@core/functions/collision";
import { Editor } from "@manager/Editor";

export default {
    command: 'moveSelectionToCenter',

    description: 'Move selection project or artboards to center on Viewport',

    /**
     * 
     * @param {Editor} editor 
     * @param {vec3[]} areaVerties 
     * @param {boolean} withScale    scale 도 같이 조절 할지 정리 
     */
    execute: function (editor) {

        let areaVerties = []

        if (editor.selection.isEmpty) {
          areaVerties = editor.selection.currentProject.rectVerties;
        } else {
          areaVerties = itemsToRectVerties(editor.selection.selectedArtboards);
        }
    
        editor.emit('moveToCenter', areaVerties);        
    }

}