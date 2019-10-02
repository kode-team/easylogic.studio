import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND } from "../../../util/Event";

export default class StatusBar extends UIElement {
    template () {
        return /*html*/`
            <div>
                <div class='message-view' ref='$msg'></div>
            </div>
        `

    }

    initState() {
        return {
            msg: '' 
        }
    }

    [BIND('$msg')] () {
        return {
            text: this.state.msg 
        }
    }

    [EVENT('addStatusBarMessage')] (msg) {
        this.setState({ msg })
    } 
}