import SelectEditor from "./SelectEditor";

export const blend_list = [
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity"
  ];

export default class BlendSelectEditor extends SelectEditor {

    getBlendList () {
        return blend_list.map(it => {
            return {value: it, text: this.$i18n(`blend.${it}`)};
        });
        
    }

    initState() {
        return {
            ...super.initState(),
            options: this.getBlendList()
        }
    }
}