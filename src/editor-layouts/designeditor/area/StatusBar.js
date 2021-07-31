
import { BIND, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import LanguageSelector from "./status-bar/LanguageSelector";
import ThemeSwitcher from "./status-bar/ThemeSwitcher";
import LayoutSelector from "./status-bar/LayoutSelector";
import VersionView from "./status-bar/VersionView";
import SwitchLeftPanel from "./status-bar/SwitchLeftPanel";
import SwitchRightPanel from "./status-bar/SwitchRightPanel";

import './StatusBar.scss';


export default class StatusBar extends EditorElement {

    components() {
        return {
            LanguageSelector,
            ThemeSwitcher,
            LayoutSelector,
            VersionView,
            SwitchLeftPanel,
            SwitchRightPanel,
        }
    }
    template() {
        return /*html*/`
            <div class='elf--status-bar'>
                <div class='tool-view left' ref='$leftTool'>
                    <object refClass="SwitchLeftPanel" />
                    ${this.$menuManager.generate('statusbar.left')}                    
                </div>            
                <div class='message-view' ref='$msg'></div>
                <div class='tool-view' ref='$rightTool'>
                    ${this.$menuManager.generate('statusbar.right')}
                    <object refClass="LayoutSelector" />
                    <object refClass="ThemeSwitcher" />
                    <object refClass="LanguageSelector" />
                    <object refClass="VersionView" />
                    <object refClass="SwitchRightPanel" />                    
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