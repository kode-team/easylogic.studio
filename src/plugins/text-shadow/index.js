import { Editor } from "el/editor/manager/Editor";
import TextShadowEditor from "./TextShadowEditor";
import TextShadowProperty from "./TextShadowProperty";
import TextShadowPropertyPopup from "./TextShadowPropertyPopup";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        TextShadowEditor
    })

    editor.registerMenuItem('inspector.tab.style', {
        TextShadowProperty        
    })

    editor.registerMenuItem('popup', {
        TextShadowPropertyPopup
    })
}