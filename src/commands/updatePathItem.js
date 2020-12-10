import { rectToVerties } from "@core/functions/collision";
import { vertiesMap } from "@core/functions/math";
import { Editor } from "@manager/Editor";
import { Length } from "@unit/Length";


export default {
    command: 'updatePathItem',

    description: 'Update path string for selected svg path item',

    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor, pathObject) {
        const current = editor.selection.current;
        if (current) {
            const newPath = current.invertPath(pathObject.d);
            const bbox = newPath.getBBox();

            const newX = current.offsetX.value + bbox[0][0]
            const newY = current.offsetY.value + bbox[0][1]
            const newWidth = bbox[1][0] - bbox[0][0]
            const newHeight = bbox[3][1] - bbox[0][1]

            newPath.translate(-bbox[0][0], -bbox[0][1])

            // d 속성 (path 문자열) 을 설정한다. 
            editor.emit('setAttribute', {
                d: newPath.d,
                x: Length.px(newX),
                y: Length.px(newY),
                width: Length.px(newWidth),
                height: Length.px(newHeight)
            })
        }


    }

}