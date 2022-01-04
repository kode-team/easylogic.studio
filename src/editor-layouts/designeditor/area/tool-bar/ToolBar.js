import { EditorElement } from "el/editor/ui/common/EditorElement";
// import ToolMenu from "./ToolMenu";
import Projects from "el/editor/ui/menu-items/Projects";

import './ToolBar.scss';
import { DropdownMenu } from "el/editor/ui/view/DropdownMenu";
import Undo from "el/editor/ui/menu-items/Undo";
import Redo from "el/editor/ui/menu-items/Redo";
import ExportView from 'el/editor/ui/menu-items/ExportView';
import Download from 'el/editor/ui/menu-items/Download';
import Save from 'el/editor/ui/menu-items/Save';
import Outline from "el/editor/ui/menu-items/Outline";
import SelectTool from "el/editor/ui/menu-items/SelectTool";
import ThemeChanger from "el/editor/ui/menu-items/ThemeChanger";
import AddArtboard from 'el/editor/ui/menu-items/AddArtboard';
import { variable } from "el/sapa/functions/registElement";
import LayoutSelector from '../status-bar/LayoutSelector';
import LanguageSelector from '../status-bar/LanguageSelector';
import { Language } from "el/editor/types/editor";
import { CONFIG, LOAD } from 'el/sapa/Event';
import CssDropdownMenu from "el/editor/menus/menu_list/CssDropdownMenu";
import SvgDropdownMenu from "el/editor/menus/menu_list/SvgDropdownMenu";
import AddRect from "el/editor/ui/menu-items/AddRect";
import AddSVGRect from "el/editor/ui/menu-items/AddSVGRect";
import ToolbarMenu from "el/editor/menus/menu_list/ToolbarMenu";
import ToolBarRenderer from "./ToolBarRenderer";





export default class ToolBar extends EditorElement {

    initState() {
        return {
            items: [
                { title: 'menu.item.fullscreen.title', command: 'toggle.fullscreen', shortcut: "ALT+/" },
                { title: 'menu.item.shortcuts.title', command: 'showShortcutWindow' },
                '-',
                { title: 'menu.item.export.title', command: 'showExportView' },
                { title: 'menu.item.export.title', command: 'showEmbedEditorWindow' },
                { title: 'menu.item.download.title', command: 'downloadJSON' },
                {
                    title: 'menu.item.save.title', command: 'saveJSON', nextTick: () => {
                        this.emit('notify', 'alert', 'Save', 'Save the content on localStorage', 2000);
                    }
                },
                {
                    title: 'menu.item.language.title', items: [
                        { title: 'English', command: 'setLocale', args: [Language.EN], checked: () => this.$editor.locale === Language.EN },
                        { title: 'Français', command: 'setLocale', args: [Language.FR], checked: () => this.$editor.locale === Language.FR },
                        { title: 'Korean', command: 'setLocale', args: [Language.KO], checked: () => this.$editor.locale === Language.KO },
                    ]
                },
                '-',
                {
                    title: 'EasyLogic Studio', items: [
                        { type: 'link', title: 'Github', href: 'https://github.com/easylogic/editor' },
                        { type: 'link', title: 'Learn', href: 'https://www.easylogic.studio' }
                    ]
                }
            ]
        }
    }

    components() {
        return {
            ToolBarRenderer,
            LayoutSelector,
            LanguageSelector,
            ThemeChanger,
            Outline,
            SelectTool,
            ExportView,
            Download,
            Save,
            Undo,
            Redo,
            DropdownMenu,
            Projects,
            AddArtboard,
            AddRect,
            AddSVGRect            
        }
    }
    template() {
        return /*html*/`
            <div class='elf--tool-bar'>
                <object refClass="ToolBarRenderer" ${variable({
                    items: ToolbarMenu.left(this.$editor)
                })} />            
                <div class='center'>
                </div>
                <div class='right'>
                    ${this.$injectManager.generate('toolbar.right')}
                    <object refClass="ThemeChanger" />                            
                </div>
            </div>
        `
    }

    [LOAD('$logo')]() {
        return /*html*/`
            <div class="logo-item">                   
                <object refClass="DropdownMenu" ${variable({
                    ref: "$menu",
                    items: this.state.items,
                    dy: 6
                })} >     
                    <label class='logo'></label>
                </object>
            </div>                                
        `
    }

    [CONFIG('language.locale')]() {
        this.refresh();
    }
}