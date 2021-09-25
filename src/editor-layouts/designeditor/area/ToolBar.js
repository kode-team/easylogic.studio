import { EditorElement } from "el/editor/ui/common/EditorElement";
import PageSubEditor from "./PageSubEditor";
import ToolMenu from "./tool-bar/ToolMenu";
import Projects from "el/editor/ui/menu-items/Projects";

import './ToolBar.scss';
import { DropdownMenu } from "el/editor/ui/view/DropdownMenu";
import Undo from "el/editor/ui/menu-items/Undo";
import Redo from "el/editor/ui/menu-items/Redo";
import ExportView from 'el/editor/ui/menu-items/ExportView';
import Download from 'el/editor/ui/menu-items/Download';
import Save from 'el/editor/ui/menu-items/Save';
import OpenPathEditor from "el/editor/ui/menu-items/OpenPathEditor";
import Outline from "el/editor/ui/menu-items/Outline";


export default class ToolBar extends EditorElement {

    components() {
        return {
            Outline,
            OpenPathEditor,
            ExportView,
            Download,
            Save,
            Undo,
            Redo,
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
                                <object refClass="Undo" />
                                <object refClass="Redo" />
                                <object refClass="Outline" />                                
                                <object refClass="OpenPathEditor" />
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
                                <object refClass="ExportView" />
                                <object refClass="Download" />
                                <object refClass="Save" />
                                ${this.$injectManager.generate('toolbar.right')}                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}