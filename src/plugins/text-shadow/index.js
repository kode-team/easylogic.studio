import { Editor } from "el/editor/manager/Editor";
import TextShadowEditor from "./TextShadowEditor";
import TextShadowProperty from "./TextShadowProperty";

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
}