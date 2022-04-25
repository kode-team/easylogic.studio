import { Item } from "./Item";

import { CSS_TO_STRING } from "elf/core/func";

export class PropertyItem extends Item {
  getDefaultObject(obj = {}) {
    return {
      selected: false, // 선택 여부 체크
      layers: [], // 하위 객체를 저장한다.
      ...obj,
    };
  }

  isAttribute() {
    return true;
  }

  toCSS() {
    return {};
  }

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }
}
