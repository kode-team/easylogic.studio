import UIElement, { EVENT } from "../../../../util/UIElement";
import { LOAD } from "../../../../util/Event";

export default class TimelineTopToolbar extends UIElement {
    
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>

            </div>
        `
    }

    [LOAD() ] () {
        return ''; 
    }

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }

}