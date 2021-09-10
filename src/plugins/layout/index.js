import { Editor } from "el/editor/manager/Editor";
import FlexLayoutEditor from "./FlexLayoutEditor";
import FlexLayoutItemEditor from "./FlexLayoutItemEditor";
import FlexLayoutItemProperty from "./FlexLayoutItemProperty";
import GridBoxEditor from "./GridBoxEditor";
import GridGapEditor from "./GridGapEditor";
import GridLayoutEditor from "./GridLayoutEditor";
import GridLayoutItemEditor from "./GridLayoutItemEditor";
import GridLayoutItemProperty from "./GridLayoutItemProperty";
import LayoutProperty from "./LayoutProperty";
import DefaultLayoutItemProperty from './DefaultLayoutItemProperty';

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        FlexLayoutEditor,
        FlexLayoutItemEditor,
        GridLayoutEditor,
        GridLayoutItemEditor,
        GridBoxEditor,
        GridGapEditor
    })

    editor.registerMenuItem('inspector.tab.style', {
        LayoutProperty,        
        DefaultLayoutItemProperty,
        GridLayoutItemProperty,
        FlexLayoutItemProperty,
    })
}