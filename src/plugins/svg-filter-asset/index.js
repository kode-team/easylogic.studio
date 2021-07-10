import { Editor } from "el/editor/manager/Editor";
import SVGFilterAssetsProperty from "./SVGFilterAssetsProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        SVGFilterAssetsProperty
    })
}