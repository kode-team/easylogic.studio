import { Editor } from "el/editor/manager/Editor";
import PositionProperty from "./PositionProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        PositionProperty
    })
}