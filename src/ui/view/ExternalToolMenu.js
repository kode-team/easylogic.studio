import { registElement } from "@sapa/registerElement";
import UIElement from "@sapa/UIElement";
import "@ui/menu-items";

export default class ExternalToolMenu extends UIElement {

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