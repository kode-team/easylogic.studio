import { Editor } from "el/editor/manager/Editor";
import CanvasView from "./CanvasView";
import HorizontalRuler from "./HorizontalRuler";
import HTMLRenderView from "./render-view/HTMLRenderView";
import StyleView from "./render-view/StyleView";
import VerticalRuler from "./VerticalRuler";
import DrawManager from "./view-items/DrawManager";
import GridLayoutLineView from "./view-items/GridLayoutLineView";
import GroupSelectionToolView from "./view-items/GroupSelectionToolView";
import GuideLineView from "./view-items/GuideLineView";
import HoverView from "./view-items/HoverView";
import LayerAppendView from "./view-items/LayerAppendView";
import PageSubEditor from "./view-items/PageSubEditor";
import PageTools from "./view-items/PageTools";
import PathDrawView from "./view-items/PathDrawView";
import PathEditorView from "./view-items/PathEditorView";
import PathManager from "./view-items/PathManager";
import SelectionInfoView from "./view-items/SelectionInfoView";
import SelectionToolView from "./view-items/SelectionToolView";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        SelectionToolView,
        GroupSelectionToolView,
        GuideLineView,
        PathEditorView,
        PathDrawView,
        LayerAppendView,
        GridLayoutLineView,
        SelectionInfoView,
        HoverView,
        DrawManager,
        PathManager,
        PageSubEditor,
        PageTools,
        StyleView,
        HTMLRenderView,
        HorizontalRuler,
        VerticalRuler,
        CanvasView
    })
}