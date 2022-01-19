import { iconUse } from "el/editor/icon/icon";
import { EditingMode, Language } from "el/editor/types/editor";
import { KeyStringMaker } from "el/editor/types/key";

export default [
    {
        type: 'dropdown',
        style: {
            'margin-left': '12px',
        },
        icon: `<div class="logo-item"><label class='logo'></label></div>`,
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
                    { title: 'English', command: 'setLocale', args: [Language.EN], checked: (editor) => editor.locale === Language.EN },
                    { title: 'Français', command: 'setLocale', args: [Language.FR], checked: (editor) => editor.locale === Language.FR },
                    { title: 'Korean', command: 'setLocale', args: [Language.KO], checked: (editor) => editor.locale === Language.KO },
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
    },
    // {
    //     type: 'button',
    //     icon: 'undo',
    //     action: (editor) => {
    //         editor.config.toggle('history.undo');
    //     }
    // },
    // {
    //     type: 'button',
    //     icon: 'redo',
    //     action: (editor) => {
    //         editor.config.toggle('history.redo');
    //     }
    // },
    // {
    //     type: 'button',
    //     icon: 'outline',
    //     selected: (editor) => editor.config.true('show.outline'),
    //     events: ['config:show.outline'],
    //     action: (editor) => {
    //         editor.config.toggle('show.outline');
    //     }
    // },
    {
        type: 'button',
        icon: 'navigation',
        events: ['config:editing.mode'],
        selected: (editor) => { return editor.config.is("editing.mode", EditingMode.SELECT) },
        action: (editor) => {
            editor.emit('addLayerView', 'select');
        }
    },
    {
        type: 'button',
        icon: 'artboard',
        events: ['config:editing.mode', 'config:editing.mode.itemType'],
        selected: (editor) => {
            return (
                editor.config.is("editing.mode", EditingMode.APPEND) &&
                editor.config.is("editing.mode.itemType", 'artboard')
            )

        },
        action: (editor) => {
            editor.emit('addLayerView', 'artboard');
        }
    },
    {
        type: 'dropdown',
        selectedKey: 'rect',
        icon: (state) => {

            switch (state.selectedKey) {
                case 'circle':
                    return iconUse('lens');
                case 'text':
                    return iconUse('title');
                case 'image':
                    return iconUse('image');
                case 'video':
                    return iconUse('video');
                case 'iframe':
                    return iconUse('iframe');

            }

            return iconUse('rect')
        },
        items: [
            { icon: iconUse('rect'), title: 'Rect Layer', key: 'rect', command: 'addLayerView', args: ['rect'], shortcut: KeyStringMaker({ key: "R" }) },
            { icon: iconUse('lens'), title: 'Circle Layer', key: 'circle', command: 'addLayerView', args: ['circle'], shortcut: KeyStringMaker({ key: "O" }) },
            { icon: iconUse('title'), title: 'Text', key: 'text', command: 'addLayerView', args: ['text'], shortcut: KeyStringMaker({ key: "T" }) },
            { icon: iconUse('image'), title: 'Image', key: 'image', command: 'addLayerView', args: ['image'], shortcut: KeyStringMaker({ key: "I" }) },
            '-',
            { icon: iconUse('video'), title: 'Video', key: 'video', command: 'addLayerView', args: ['video'], shortcut: KeyStringMaker({ key: "V" }) },
            { icon: iconUse('iframe'), title: 'IFrame', key: 'iframe', command: 'addLayerView', args: ['iframe'], shortcut: KeyStringMaker({ key: "F" }) },
        ],
        events: ['config:editing.mode', 'config:editing.mode.itemType'],
        selected: (state, editor) => {
            return (
                editor.config.is("editing.mode", EditingMode.APPEND) && (
                    editor.config.is("editing.mode.itemType", 'rect') || 
                    editor.config.is("editing.mode.itemType", 'circle') || 
                    editor.config.is("editing.mode.itemType", 'text') || 
                    editor.config.is("editing.mode.itemType", 'image') || 
                    editor.config.is("editing.mode.itemType", 'video') || 
                    editor.config.is("editing.mode.itemType", 'iframe')
                )
                
            )
        }
    },
    {
        type: 'dropdown',
        selectedKey: 'path',
        icon: (state) => {

            switch (state.selectedKey) {
                case 'brush':
                    return iconUse('brush');
            }

            return iconUse('pentool')
        },
        items: [
            { icon: iconUse('pentool'), title: 'Pen', key: 'path', command: 'addLayerView', args: ['path'], shortcut:KeyStringMaker({ key: "P" }) },            
            { icon: iconUse('brush'), title: 'Pencil', key: 'brush', command: 'addLayerView', args: ['brush'], shortcut: KeyStringMaker({ key: "B" }) },
        ],
        events: ['config:editing.mode', 'config:editing.mode.itemType'],
        selected: (state, editor) => {
            return (
                (
                    editor.config.is("editing.mode", EditingMode.PATH) || 
                    editor.config.is("editing.mode", EditingMode.DRAW) 
                ) 
                && (
                    state.selectedKey === 'path' ||
                    state.selectedKey === 'brush'
                )
                
            )
        }
    },        
    {
        type: 'dropdown',
        selectedKey: 'svg-rect',
        icon: (state) => {

            switch (state.selectedKey) {
                case 'svg-circle':
                    return iconUse('outline_circle');
                case 'polygon':
                    return iconUse('polygon');
                case 'star':
                    return iconUse('star');
                case 'spline':
                    return iconUse('smooth');
                case 'svg-textpath':
                    return iconUse('text_rotate');
            }

            return iconUse('outline_rect')
        },
        items: [
            { icon: iconUse('outline_rect'), title: 'Rectangle', key: 'svg-rect', command: 'addLayerView', args: ['svg-rect'], shortcut: KeyStringMaker({ key: "Shift+R" }) },
            { icon: iconUse('outline_circle'), title: 'Circle', key: 'svg-circle', command: 'addLayerView', args: ['svg-circle'], shortcut:KeyStringMaker({ key: "Shift+O" }) },
            { icon: iconUse('polygon'), title: 'Polygon', key: 'svg-polygon', command: 'addLayerView', args: ['polygon', {
              'background-color': 'transparent',
            }], shortcut: KeyStringMaker({ key: "Shift+P" }) },
            { icon: iconUse('star'), title: 'Star', key: 'star', command: 'addLayerView', args: ['star', {
              'background-color': 'transparent',
            }], shortcut: KeyStringMaker({ key: "Shift+S" }) },        
            '-',
            { icon: iconUse('smooth'), title: 'Spline', key: 'spline', command: 'addLayerView', args: ['spline', {
              'background-color': 'transparent',
            }], shortcut: KeyStringMaker({ key: "Shift+L" }) },
            { icon: iconUse('text_rotate'), title: 'TextPath', key: 'svg-texpath', command: 'addLayerView', args: ['svg-textpath', {
              'background-color': 'transparent',
            }], shortcut: KeyStringMaker({ key: "Shift+T" }) },
        ],
        events: ['config:editing.mode', 'config:editing.mode.itemType'],
        selected: (state, editor) => {
            return (
                editor.config.is("editing.mode", EditingMode.APPEND) && (
                    editor.config.is("editing.mode.itemType", 'svg-rect') ||
                    editor.config.is("editing.mode.itemType", 'svg-circle') ||
                    editor.config.is("editing.mode.itemType", 'polygon') ||
                    editor.config.is("editing.mode.itemType", 'star') ||
                    editor.config.is("editing.mode.itemType", 'spline') ||
                    editor.config.is("editing.mode.itemType", 'svg-textpath')
                )
                
            )
        }
    },    
]