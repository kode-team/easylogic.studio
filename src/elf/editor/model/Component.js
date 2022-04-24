import { LayerModel } from "./LayerModel";
import { iconUse } from "elf/editor/icon/icon";

/**
 * Complex Component with children
 */
export class Component extends LayerModel {
  is(...itemType) {
    if (itemType.includes("component")) {
      return true;
    }

    return super.is(...itemType);
  }

  getProps() {
    return [];
  }

  static createComponent({
    iconString,
    title = "Unknown Title",
    attrs = {},
    enableHasChildren = false,
  }) {
    return class extends Component {
      getIcon() {
        return iconString || iconUse("add");
      }

      getDefaultObject() {
        return super.getDefaultObject({
          itemType: "NewComponent",
          name: "New Component",
          ...attrs,
        });
      }

      toCloneObject() {
        return {
          ...super.toCloneObject(),
          ...this.attrs(...Object.keys(attrs)),
        };
      }

      enableHasChildren() {
        return enableHasChildren || false;
      }

      getDefaultTitle() {
        return title;
      }
    };
  }
}
