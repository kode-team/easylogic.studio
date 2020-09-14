import UIElement, { EVENT } from "@core/UIElement";
import { BIND } from "@core/Event";
import LanguageSelector from "../status-bar-items/LanguageSelector";
import ThemeSwitcher from "../status-bar-items/ThemeSwitcher";
import LayoutSelector from "../status-bar-items/LayoutSelector";

export default class StatusBar extends UIElement {
    components() {
        return {
            LayoutSelector,
            LanguageSelector,
            ThemeSwitcher,
        }
    }
    template () {
        return /*html*/`
            <div class='status-bar'>
                <div class='message-view' ref='$msg'></div>
                <div class='tool-view' ref='$tool'>
                    <LayoutSelector />
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