import { Editor } from "el/editor/manager/Editor";
import AddIFrame from "./AddIFrame";
import { IFrameLayer } from "./IFrameLayer";
import IFrameProperty from "./IFrameProperty";
import HTMLIFrameRender from "./HTMLIFrameRender";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerComponent('iframe', IFrameLayer);

    editor.registerUI('inspector.tab.style', {
        IFrameProperty
    })

    editor.registerRenderer('html', 'iframe', new HTMLIFrameRender());

    editor.registerUI('tool.menu.css', {
        AddIFrame
    })
}