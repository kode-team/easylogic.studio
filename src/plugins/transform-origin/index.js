import { Editor } from "el/editor/manager/Editor";
import TransformOriginEditor from "./TransformOriginEditor";
import TransformOriginProperty from "./TransformOriginProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        TransformOriginEditor
    })

    editor.registerUI('inspector.tab.style', {
        TransformOriginProperty
    })
}