
import "./tool-bar/ToolMenu";
import "../../../el/editor/ui/menu-items/index";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import PageSubEditor from "./PageSubEditor";
import ToolMenu from "./tool-bar/ToolMenu";


export default class ToolBar extends EditorElement {

    components() {
        return {
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