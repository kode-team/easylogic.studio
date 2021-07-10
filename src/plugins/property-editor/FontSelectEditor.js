import SelectEditor from "./SelectEditor";


export const font_list = [
    '',
    'Arial',
    'Arial Black',
    'Times New Roman',
    'Times',
    'Courier New',
    'Courier',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS',
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui'
]


// todo: it needs fontManager
export default class FontSelectEditor extends SelectEditor {

    getFontList () {
        return font_list
    }

    initState() {
        return {
            ...super.initState(),
            options: this.getFontList()
        }
    }
}