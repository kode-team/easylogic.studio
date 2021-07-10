import { Editor } from "el/editor/manager/Editor";
import KeyframePopup from "./KeyframePopup";
import KeyframeProperty from "./KeyframeProperty";
import OffsetEditor from "./OffsetEditor";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        OffsetEditor
    })

    editor.registerMenuItem('inspector.tab.transition', {
        KeyframeProperty
    })

    editor.registerMenuItem('popup', {
        KeyframePopup
    })
}