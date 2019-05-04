import shapeEditor from './shape-editor/index';
import UIElement, { EVENT } from '../../../../util/UIElement';
import { 
    CHANGE_EDITOR, 
    CHANGE_SELECTION, 
    CHANGE_LAYER
} from '../../../types/event';
import { editor } from '../../../../editor/editor';


export default class LayerShapeEditor extends UIElement {

    components () {
        return shapeEditor;
    }

    template () { 
        return `<div class="layer-shape-editor">
            <CircleEditor></CircleEditor>
            <EllipseEditor></EllipseEditor>
            <InsetEditor></InsetEditor>
            <PolygonEditor></PolygonEditor>
            <PathEditor></PathEditor>
        </div>`
    }

    refresh () {
        var isShow = this.isShow();
        this.$el.toggle(isShow)

        if (isShow) {
            this.setPosition()
        }
    }

    setRectangle (item) {

        var toolSize = editor.config.get('tool.size');
        var boardOffset = this.boardOffset || toolSize['board.offset']
        var pageOffset = this.pageOffset || toolSize['page.offset']
        var canvasScrollLeft = this.canvasScrollLeft || toolSize['board.scrollLeft'];
        var canvasScrollTop = this.canvasScrollTop || toolSize['board.scrollTop'];

        var width = item.width; 
        var height = item.height;
        var left = Length.px( (+item.x) + pageOffset.left - boardOffset.left + canvasScrollLeft ); 
        var top = Length.px( (+item.y) + pageOffset.top - boardOffset.top  + canvasScrollTop ); 

        return { width, height, left, top }
    }    

    setPosition () {
        var item = editor.selection.layer

        if (!item) return; 
        if (!item.showClipPathEditor) return;

        this.$el.css(this.setRectangle(item))
    }

    isShow () {
        return editor.selection.layer;                
    }

    [EVENT(
        CHANGE_LAYER,
        CHANGE_EDITOR,
        CHANGE_SELECTION
    )] () { this.refresh() }

}