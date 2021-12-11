import { EditorElement } from "el/editor/ui/common/EditorElement";
import ToolMenu from "./tool-bar/ToolMenu";
import Projects from "el/editor/ui/menu-items/Projects";

import './ToolBar.scss';
import { DropdownMenu } from "el/editor/ui/view/DropdownMenu";
import Undo from "el/editor/ui/menu-items/Undo";
import Redo from "el/editor/ui/menu-items/Redo";
import ExportView from 'el/editor/ui/menu-items/ExportView';
import Download from 'el/editor/ui/menu-items/Download';
import Save from 'el/editor/ui/menu-items/Save';
import Outline from "el/editor/ui/menu-items/Outline";
import ThemeChanger from "el/editor/ui/menu-items/ThemeChanger";


export default class ToolBar extends EditorElement {

    components() {
        return {
            ThemeChanger,
            Outline,
            ExportView,
            Download,
            Save,
            Undo,
            Redo,
            DropdownMenu,
            Projects,
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
                                <object refClass="Undo" />
                                <object refClass="Redo" />
                                <object refClass="Outline" />                                
                                ${this.$injectManager.generate('toolbar.left')}
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class='center'>
                    <object refClass="ToolMenu" />
                </div>
                <div class='right'>
                    <div class='elf--tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>      
                                <object refClass="ThemeChanger" />                            
                                ${this.$injectManager.generate('toolbar.right')}                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}