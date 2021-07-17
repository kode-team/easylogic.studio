import { EditorElement } from "el/editor/ui/common/EditorElement";
import PageSubEditor from "./PageSubEditor";
import ToolMenu from "./tool-bar/ToolMenu";
import Projects from "el/editor/ui/menu-items/Projects";
import Fullscreen from "el/editor/ui/menu-items/Fullscreen";
import KeyBoard from "el/editor/ui/menu-items/KeyBoard";
import ExportView from "el/editor/ui/menu-items/ExportView";
import Download from "el/editor/ui/menu-items/Download";
import Save from "el/editor/ui/menu-items/Save";


export default class ToolBar extends EditorElement {

    components() {
        return {
            Projects,
            Fullscreen,
            KeyBoard,
            ExportView,
            Download,
            Save,

            PageSubEditor,
            ToolMenu
        }
    }
    template() {
        return /*html*/`
            <div class='tool-bar'>
                <div class='logo-item'>
                    <label class='logo'></label>
                </div>                 
                <div class='left'>
                    <div class='tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="Projects" />
                                <object refClass="Fullscreen" />      
                                ${this.$menuManager.generate('toolbar.left')}
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class='center'>
                    <object refClass="ToolMenu" />
                    <object refClass='PageSubEditor' />  
                </div>
                <div class='right'>
                    <div class='tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="KeyBoard" />        
                                <object refClass="ExportView" />
                                <object refClass="Download" />
                                <object refClass="Save" />   
                                ${this.$menuManager.generate('toolbar.right')}                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}