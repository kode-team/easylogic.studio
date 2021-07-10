import { Editor } from "el/editor/manager/Editor";
import ImageProperty from "./ImageProperty";
import ImageSelectEditor from "./ImageSelectEditor";
import ImageSelectPopup from "./ImageSelectPopup";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ImageSelectEditor
    })
    editor.registerMenuItem('inspector.tab.style', {
        ImageProperty
    })

    editor.registerMenuItem('popup', {
        ImageSelectPopup
    })
}