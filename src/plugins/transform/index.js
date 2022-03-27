import { Editor } from "el/editor/manager/Editor";
// import RotateEditorView from "./RotateEditorView";
import TransformEditor from "./TransformEditor";
import TransformProperty from "./TransformProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        // RotateEditorView,
        TransformEditor
    })

    editor.registerUI('inspector.tab.style', {
        TransformProperty
    })
}