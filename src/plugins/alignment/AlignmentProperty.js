import BottomAlign from "el/editor/ui/menu-items/BottomAlign";
import CenterAlign from "el/editor/ui/menu-items/CenterAlign";
import LeftAlign from "el/editor/ui/menu-items/LeftAlign";
import MiddleAlign from "el/editor/ui/menu-items/MiddleAlign";
import RightAlign from "el/editor/ui/menu-items/RightAlign";
import SameHeight from "el/editor/ui/menu-items/SameHeight";
import SameWidth from "el/editor/ui/menu-items/SameWidth";
import TopAlign from "el/editor/ui/menu-items/TopAlign";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { createComponentList } from "el/sapa/functions/jsx";

import './AlignmentProperty.scss';

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
      SameHeight
    }
  }

  getTitle() {
    return this.$i18n('alignment.property.title');
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/`
      <div class="elf--alignment-item">
        ${createComponentList(
          "LeftAlign",
          "CenterAlign",
          "RightAlign",
  
          "TopAlign",
          "MiddleAlign",
          "BottomAlign",
  
          ["SameWidth", {direction: "bottom"}],
          "SameHeight"
        )}
      </div>
    `;
  }
}