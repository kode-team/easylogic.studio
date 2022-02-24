import { Editor } from "el/editor/manager/Editor";
import TextShadowProperty from "./TextShadowProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerMenuItem('inspector.tab.style', {
        TextShadowProperty        
    })
}