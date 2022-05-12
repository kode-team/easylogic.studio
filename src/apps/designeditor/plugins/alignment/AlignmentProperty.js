import { createComponentList } from "sapa";

import "./AlignmentProperty.scss";

import BottomAlign from "elf/editor/ui/menu-items/BottomAlign";
import CenterAlign from "elf/editor/ui/menu-items/CenterAlign";
import LeftAlign from "elf/editor/ui/menu-items/LeftAlign";
import MiddleAlign from "elf/editor/ui/menu-items/MiddleAlign";
import RightAlign from "elf/editor/ui/menu-items/RightAlign";
import SameHeight from "elf/editor/ui/menu-items/SameHeight";
import SameWidth from "elf/editor/ui/menu-items/SameWidth";
import TopAlign from "elf/editor/ui/menu-items/TopAlign";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class AlignmentProperty extends BaseProperty {
  components() {
    return {
      LeftAlign,
      CenterAlign,
      RightAlign,
      TopAlign,
      MiddleAlign,
      BottomAlign,
      SameWidth,
      SameHeight,
    };
  }

  getTitle() {
    return this.$i18n("alignment.property.title");
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/ `
      <div class="elf--alignment-item">
        ${createComponentList(
          "LeftAlign",
          "CenterAlign",
          "RightAlign",

          "TopAlign",
          "MiddleAlign",
          "BottomAlign",

          ["SameWidth", { direction: "bottom" }],
          "SameHeight"
        )}
      </div>
    `;
  }
}
