import { registElement } from "el/base/registerElement";

import { EditorElement } from "../../common/EditorElement";
import "./KeyframeTimeControl";

export default class TimelineTopToolbar extends EditorElement {
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                <object refClass="KeyframeTimeControl" />
            </div>
        `
    }
}

registElement({ TimelineTopToolbar })