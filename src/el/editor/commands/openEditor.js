import { Editor } from "el/editor/manager/Editor";
import { ClipPath } from "../property-parser/ClipPath";

export default {
    command: 'openEditor',

    description: 'Open custom editor for item  ',

    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor) {

        if (editor.selection.isOne === false) return;

        var current = editor.selection.current;

        if (current) {

            // d 속성은 자동으로 페스 에디터로 연결 
            if (current.d) {
                current.setCache();

                // box 모드 
                // box - x, y, width, height 고정된 상태로  path 정보만 변경 
                editor.emit('showPathEditor', 'modify', {
                    box: 'canvas',
                    current,
                    d: current.accumulatedPath().d,
                })
                editor.emit('hideSelectionToolView');
            } else if (current['clip-path']) {
                current.setCache();
                
                var obj = ClipPath.parseStyle(current['clip-path'])

                if (obj.type === 'path') {
                    var d = current.accumulatedPath(current.clipPathString).d
                    var mode = d ? 'modify' : 'path'

                    editor.emit('showPathEditor', mode, {
                        changeEvent: 'updateClipPathString',
                        current,
                        d,
                    })
                    editor.emit('hideSelectionToolView');
                }

            } else  {
                // 기타 다른 에디터 연동하기 
            }
        }

    }

}