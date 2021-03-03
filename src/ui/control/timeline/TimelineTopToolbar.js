import UIElement from "@core/UIElement";
import KeyframeTimeControl from "./KeyframeTimeControl";

export default class TimelineTopToolbar extends UIElement {
    components() {
        return {
            KeyframeTimeControl        
        }
    }    
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                <span refClass="KeyframeTimeControl" />
            </div>
        `
    }
}