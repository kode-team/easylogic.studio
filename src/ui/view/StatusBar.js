import UIElement, { EVENT } from "@sapa/UIElement";
import { BIND } from "@sapa/Event";
import "../status-bar-items/LanguageSelector";
import "../status-bar-items/ThemeSwitcher";
import "../status-bar-items/LayoutSelector";
import "../status-bar-items/VersionView";
import { registElement } from "@sapa/registerElement";


export default class StatusBar extends UIElement {
    template () {
        return /*html*/`
            <div class='status-bar'>
                <div class='message-view' ref='$msg'></div>
                <div class='tool-view' ref='$tool'>
                    <object refClass="LayoutSelector" />
                    <object refClass="ThemeSwitcher" />
                    <object refClass="LanguageSelector" />
                    <object refClass="VersionView" />
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

registElement({ StatusBar })