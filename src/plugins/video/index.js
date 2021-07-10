import { Editor } from "el/editor/manager/Editor";
import VideoProperty from "./VideoProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        VideoProperty
    })
}