import SelectEditor from "./SelectEditor";
import { blend_list } from "@util/Resource";
import { registElement } from "@core/registerElement";


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