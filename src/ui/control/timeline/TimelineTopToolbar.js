import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";
import "./KeyframeTimeControl";

export default class TimelineTopToolbar extends UIElement {
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                <object refClass="KeyframeTimeControl" />
            </div>
        `
    }
}

registElement({ TimelineTopToolbar })