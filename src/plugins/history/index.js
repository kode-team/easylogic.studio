import { Editor } from "el/editor/manager/Editor";
import HistoryProperty from "./HistoryProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.history', {
        HistoryProperty
    })
}