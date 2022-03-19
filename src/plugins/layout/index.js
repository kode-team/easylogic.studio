import { Editor } from "el/editor/manager/Editor";
import FlexLayoutEditor from "./FlexLayoutEditor";
import FlexLayoutItemProperty from "./FlexLayoutItemProperty";
import GridBoxEditor from "./GridBoxEditor";
import GridGapEditor from "./GridGapEditor";
import GridLayoutEditor from "./GridLayoutEditor";
import GridLayoutItemProperty from "./GridLayoutItemProperty";
import LayoutProperty from "./LayoutProperty";
import DefaultLayoutItemProperty from './DefaultLayoutItemProperty';
import ResizingProperty from './ResizingProperty';

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        FlexLayoutEditor,
        GridLayoutEditor,
        GridBoxEditor,
        GridGapEditor
    })

    editor.registerUI('inspector.tab.style', {
        LayoutProperty,        
        ResizingProperty,
        DefaultLayoutItemProperty,
        GridLayoutItemProperty,
        FlexLayoutItemProperty,
    })
}