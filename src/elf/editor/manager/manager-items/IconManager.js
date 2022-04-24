import { isFunction } from "sapa";
import { iconUse } from "elf/editor/icon/icon";

export class IconManager {
  constructor(editor) {
    this.editor = editor;
    this.iconMap = {};
  }

  get(itemType, item) {
    const icon = this.iconMap[itemType];

    if (isFunction(icon)) {
      return icon(item);
    }

    return iconUse(icon || item.getIcon() || "rect");
  }

  set(itemType, value) {
    this.iconMap[itemType] = value;
  }

  /**
   * icon 기본 설정을 등록한다.
   */
  registerIcon(itemType, iconOrFunction) {
    this.set(itemType, iconOrFunction);
  }
}
