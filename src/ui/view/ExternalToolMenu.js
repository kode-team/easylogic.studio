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
          <span refClass="Download" />
          <span refClass="Save" />
          <span refClass="Github" />
          <span refClass="Manual" />
          <!-- LoginButton /-->
          <!-- SignButton /-->
        </div>                
      </div>
    `;
  }
}
