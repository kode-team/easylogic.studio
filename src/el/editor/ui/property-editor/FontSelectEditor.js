import SelectEditor from "./SelectEditor";
import { font_list } from "el/editor/util/Resource";
import { registElement } from "el/base/registerElement";


export default class FontSelectEditor extends SelectEditor {

    getFontList () {
        return font_list.split(',');
    }

    initState() {
        return {
            ...super.initState(),
            options: this.getFontList()
        }
    }
}

registElement({ FontSelectEditor })