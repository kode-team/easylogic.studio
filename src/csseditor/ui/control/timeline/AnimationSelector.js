import UIElement, { EVENT } from "../../../../util/UIElement";
import { LOAD, CLICK, VDOM } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import icon from "../../icon/icon";
import { OBJECT_TO_CLASS } from "../../../../util/functions/func";

export default class AnimationSelector extends UIElement {

    template () {
        return `<div class='animation-selector'></div>`
    }

    [LOAD() + VDOM] () {
        var artboard = editor.selection.currentArtboard;

        if (!artboard) {
            return ''; 
        }

        var arr = artboard.timeline.map(it => {
            return `<div class='${OBJECT_TO_CLASS({
                'timeline-object': true,
                selected: it.selected
            })}' data-timeline-id="${it.id}"><label>${it.title}</label></div>`
        })

        arr.push(`<button type='button' class='add'>${icon.add}</button>`)

        return arr.join('');
    }

    [CLICK('$el .add')] () {
        this.emit('add.timeline');
    }

    [CLICK('$el .timeline-object')] (e) {
        var id = e.$delegateTarget.attr('data-timeline-id');

        this.emit('select.timeline', id);
    }

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }
}