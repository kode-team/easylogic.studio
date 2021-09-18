import { EditorElement } from "el/editor/ui/common/EditorElement";
import PageSubEditor from "./PageSubEditor";
import ToolMenu from "./tool-bar/ToolMenu";
import Projects from "el/editor/ui/menu-items/Projects";

import './ToolBar.scss';
import { DropdownMenu } from "el/editor/ui/view/DropdownMenu";

export default class ToolBar extends EditorElement {

    components() {
        return {
            DropdownMenu,
            Projects,
            PageSubEditor,
            ToolMenu
        }
    }
    template() {
        return /*html*/`
            <div class='elf--tool-bar'>
                <div class='logo-item'>
                    <object refClass="DropdownMenu" ref="$menu">
                        <label class='logo'></label>
                    </object>
                </div>                 
                <div class='left'>
                    <div class='elf--tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="Projects" />
                                ${this.$injectManager.generate('toolbar.left')}
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class='center'>
                    <object refClass="ToolMenu" />
                    <object refClass='PageSubEditor' />  
                </div>
                <div class='right'>
                    <div class='elf--tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>      
                                ${this.$injectManager.generate('toolbar.right')}                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}