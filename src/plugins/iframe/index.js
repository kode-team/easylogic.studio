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

    editor.registerMenuItem('inspector.tab.style', {
        IFrameProperty
    })

    editor.registerRenderer('html', 'iframe', new HTMLIFrameRender());

    editor.registerMenuItem('tool.menu.css', {
        AddIFrame
    })
}