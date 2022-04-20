import { EditorElement } from "el/editor/ui/common/EditorElement";
// import ToolMenu from "./ToolMenu";
import Projects from "el/editor/ui/menu-items/Projects";

import './ToolBar.scss';
import { DropdownMenu } from "el/editor/ui/view/DropdownMenu";
import Undo from "el/editor/ui/menu-items/Undo";
import Redo from "el/editor/ui/menu-items/Redo";
import ExportView from 'el/editor/ui/menu-items/ExportView';
import Download from 'el/editor/ui/menu-items/Download';
import ThemeChanger from "el/editor/ui/menu-items/ThemeChanger";
import { Language } from "el/editor/types/editor";
import { CONFIG, LOAD } from 'el/sapa/Event';
import ToolBarRenderer from "./ToolBarRenderer";
import { createComponent, createElement } from "el/sapa/functions/jsx";





export default class ToolBar extends EditorElement {

    initState() {

        // logo drop down menu 
        // dynamic menu items
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
            ThemeChanger,
            ExportView,
            Download,
            Undo,
            Redo,
            DropdownMenu,
            Projects,
        }
    }
    template() {
        return /*html*/`
            <div class='elf--tool-bar'>
                <div class='left'>
                    ${createComponent("ToolBarRenderer", {
                        items: [
                            {
                                type: 'dropdown',
                                style: {
                                    'margin-left': '12px',
                                },
                                icon: `<div class="logo-item"><label class='logo'></label></div>`,
                                items: [
                                    { title: 'menu.item.fullscreen.title', command: 'toggle.fullscreen', shortcut: "ALT+/" },
                                ]
                            }
                        ]       // 왼쪽 메뉴 설정 
                    })}
                    ${this.$injectManager.generate('toolbar.left')}                                        
                </div>
                <div class='center'>
                    ${createComponent("ToolBarRenderer", {
                        items: []       // 가운데 메뉴 설정 
                    })}
                    ${this.$injectManager.generate('toolbar.center')}                                        
                </div>
                <div class='right'>
                    ${createComponent("ToolBarRenderer", {
                        items: []       // 오른쪽 메뉴 설정 
                    })}                
                    ${this.$injectManager.generate('toolbar.right')}                    
                    ${createComponent("ThemeChanger")}
                </div>
            </div>
        `
    }

    [LOAD('$logo')]() {
        return /*html*/`
            <div class="logo-item">           
                ${createComponent("DropdownMenu", {
                    ref: "$menu",
                    items: this.state.items,    // 로그 메뉴 설정 
                    dy: 6
                }, [
                    createElement('label', {class: 'logo'})
                ])}
            </div>                                
        `
    }

    [CONFIG('language.locale')]() {
        this.refresh();
    }
}