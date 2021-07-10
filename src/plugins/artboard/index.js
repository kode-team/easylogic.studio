import { Editor } from "el/editor/manager/Editor";
import ArtBoardSizeProperty from "./ArtBoardSizeProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        ArtBoardSizeProperty
    })
}