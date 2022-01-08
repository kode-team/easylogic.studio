import { EditorElement } from "el/editor/ui/common/EditorElement";
import { createComponent } from "el/sapa/functions/jsx";
import KeyframeTimeControl from "./KeyframeTimeControl";

export default class TimelineTopToolbar extends EditorElement {

    components() {
        return {
            KeyframeTimeControl
        }
    }

    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                ${createComponent("KeyframeTimeControl")}
            </div>
        `
    }
}