import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";
import menuItems from "../menu-items/index";

export default class ExternalToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='external-tool-menu  right'>
        <div class='items'>
          <object refClass="Download" />
          <object refClass="Save" />
          <object refClass="Github" />
          <object refClass="Manual" />
          <!-- LoginButton /-->
          <!-- SignButton /-->
        </div>                
      </div>
    `;
  }
}


registElement({ ExternalToolMenu })