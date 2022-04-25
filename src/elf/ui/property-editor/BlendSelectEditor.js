import SelectEditor from "./SelectEditor";

import { BlendMode } from "elf/editor/types/model";

export const blend_list = [
  BlendMode.NORMAL,
  BlendMode.MULTIPLY,
  BlendMode.SCREEN,
  BlendMode.OVERLAY,
  BlendMode.DARKEN,
  BlendMode.LIGHTEN,
  BlendMode.COLOR_DODGE,
  BlendMode.COLOR_BURN,
  BlendMode.HARD_LIGHT,
  BlendMode.SOFT_LIGHT,
  BlendMode.DIFFERENCE,
  BlendMode.EXCLUSION,
  BlendMode.HUE,
  BlendMode.SATURATION,
  BlendMode.COLOR,
  BlendMode.LUMINOSITY,
];

export default class BlendSelectEditor extends SelectEditor {
  getBlendList() {
    return blend_list.map((it) => {
      return { value: it, text: this.$i18n(`blend.${it}`) };
    });
  }

  initState() {
    return {
      ...super.initState(),
      options: this.getBlendList(),
    };
  }
}
