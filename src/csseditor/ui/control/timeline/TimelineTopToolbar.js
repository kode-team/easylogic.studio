import UIElement from "../../../../util/UIElement";
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
                <KeyframeTimeControl />
            </div>
        `
    }
}