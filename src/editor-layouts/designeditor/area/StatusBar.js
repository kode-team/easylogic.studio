
import { BIND, SUBSCRIBE } from "el/base/Event";
import "../../../el/editor/ui/status-bar-items/LanguageSelector";
import "../../../el/editor/ui/status-bar-items/ThemeSwitcher";
import "../../../el/editor/ui/status-bar-items/LayoutSelector";
import "../../../el/editor/ui/status-bar-items/VersionView";
import "../../../el/editor/ui/status-bar-items/SwitchLeftPanel";
import "../../../el/editor/ui/status-bar-items/SwitchRightPanel";
import { EditorElement } from "el/editor/ui/common/EditorElement";


export default class StatusBar extends EditorElement {
    template () {
        return /*html*/`
            <div class='status-bar'>
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

    [BIND('$msg')] () {
        return {
            text: this.state.msg 
        }
    }

    [SUBSCRIBE('addStatusBarMessage')] (msg) {
        this.setState({ msg })
    } 
}