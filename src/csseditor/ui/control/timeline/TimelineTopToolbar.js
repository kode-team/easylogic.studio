import UIElement from "../../../../util/UIElement";
import AnimationSelector from "./AnimationSelector";

export default class TimelineTopToolbar extends UIElement {
    components() {
        return {
            AnimationSelector
        }
    }    
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                <AnimationSelector />
            </div>
        `
    }
}