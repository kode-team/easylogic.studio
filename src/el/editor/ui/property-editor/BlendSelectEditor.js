import SelectEditor from "./SelectEditor";
import { blend_list } from "el/editor/util/Resource";
import { registElement } from "el/base/registerElement";


export default class BlendSelectEditor extends SelectEditor {

    getBlendList () {
        return blend_list.split(',').map(it => {
            return `${it}:${this.$i18n(`blend.${it}`)}`
        });
        
    }

    initState() {
        return {
            ...super.initState(),
            options: this.getBlendList()
        }
    }
}

registElement({ BlendSelectEditor })