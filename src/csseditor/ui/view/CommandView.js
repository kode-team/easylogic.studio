import UIElement from "../../../util/UIElement";
import TimelineCommand from "./command/TimelineCommand";
import ObjectCommand from "./command/ObjectCommand";
import ToolCommand from "./command/ToolCommand";

export default class CommandView extends UIElement {

    components() {
        return {
            TimelineCommand,
            ObjectCommand,
            ToolCommand
        }
    }

    template() {
        return `
        <div>
            <TimelineCommand />
            <ObjectCommand />
            <ToolCommand />
        </div>
        `
    }

}