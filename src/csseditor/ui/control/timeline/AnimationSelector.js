import UIElement, { EVENT } from "../../../../util/UIElement";
import { LOAD, CLICK, VDOM, CHANGE } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import icon from "../../icon/icon";
import { OBJECT_TO_PROPERTY } from "../../../../util/functions/func";

export default class AnimationSelector extends UIElement {

    template () {
        return `
        <div class='animation-selector'>
            <label>Animation</label>
            <select ref='$select'></select>
            <button type='button' class='add' ref='$add'>${icon.add}</button>
        </div>
        `
    }

    [LOAD('$select') + VDOM] () {
        var artboard = editor.selection.currentArtboard;

        if (!artboard) {
            return ''; 
        }

        return artboard.timeline.map(it => {
            var selected = it.selected ? 'selected' : '' 
            return `<option ${OBJECT_TO_PROPERTY({ value: it.id })} ${selected} >${it.title}</option>`
        })
    }

    [CLICK('$add')] () {
        this.emit('add.timeline');        
    }

    [CHANGE('$select')] (e) {
        this.emit('select.timeline', this.refs.$select.value); 
    }

    [EVENT('addTimeline','refreshTimeline')] () {
        this.refresh();
    }

}