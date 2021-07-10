import { Editor } from "el/editor/manager/Editor";
import ColorMatrixEditor from "./editor/ColorMatrixEditor";
import FuncFilterEditor from "./editor/FuncFilterEditor";
import SVGFilterEditor from "./SVGFilterEditor";
import SVGFilterPopup from "./SVGFilterPopup";
import SVGFilterSelectEditor from "./SVGFilterSelectEditor";
import SVGItemProperty from "./SVGItemProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        ColorMatrixEditor,
        FuncFilterEditor,
        SVGFilterSelectEditor,
        SVGFilterEditor
    })


    editor.registerMenuItem('inspector.tab.style', {
        SVGItemProperty
    })

    editor.registerMenuItem('popup', {
        SVGFilterPopup
    })
}