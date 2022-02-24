
import { BIND, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import LanguageSelector from "./status-bar/LanguageSelector";
import LayoutSelector from "./status-bar/LayoutSelector";
import VersionView from "./status-bar/VersionView";

import './StatusBar.scss';
import { createComponent } from "el/sapa/functions/jsx";

export default class StatusBar extends EditorElement {

    components() {
        return {
            LanguageSelector,
            LayoutSelector,
            VersionView,
        }
    }
    template() {
        return /*html*/`
            <div class='elf--status-bar'>
                <div class='tool-view left' ref='$leftTool'>
                    ${this.$injectManager.generate('statusbar.left')}                    
                </div>            
                <div class='message-view' ref='$msg'></div>
                <div class='tool-view right' ref='$rightTool'>
                    ${this.$injectManager.generate('statusbar.right')}
                    ${createComponent("LayoutSelector")}
                    ${createComponent("VersionView")}
                </div>
            </div>
        `

    }


    initState() {
        return {
            msg: ''
        }
    }

    [BIND('$msg')]() {
        return {
            text: this.state.msg
        }
    }

    [SUBSCRIBE('addStatusBarMessage')](msg) {
        this.setState({ msg })
    }
}