import { Editor } from "el/editor/manager/Editor";
import IFrameProperty from "./IFrameProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('insepctor.tab.style', {
        IFrameProperty
    })
}