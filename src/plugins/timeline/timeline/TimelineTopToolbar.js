import { EditorElement } from "el/editor/ui/common/EditorElement";
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
                <object refClass="KeyframeTimeControl" />
            </div>
        `
    }
}