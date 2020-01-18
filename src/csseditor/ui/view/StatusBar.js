import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND } from "../../../util/Event";
import LanguageSelector from "../status-bar-items/LanguageSelector";
import ThemeSwitcher from "../status-bar-items/ThemeSwitcher";

export default class StatusBar extends UIElement {
    components() {
        return {
            LanguageSelector,
            ThemeSwitcher,
        }
    }
    template () {
        return /*html*/`
            <div class='status-bar'>
                <div class='message-view' ref='$msg'></div>
                <div class='tool-view' ref='$tool'>
                    <ThemeSwitcher />
                    <LanguageSelector />
                </div>
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