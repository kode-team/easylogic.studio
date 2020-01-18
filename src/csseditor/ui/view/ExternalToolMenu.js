import UIElement from "../../../util/UIElement";
import menuItems from "../menu-items/index";

export default class ExternalToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return /*html*/`
      <div class='external-tool-menu  right'>
        <div class='items'>
          <Download />
          <Save />
          <!-- ExportJSFiddle / -->

          <div class='split'></div>
          
          <Github />
          <Manual />
          <!-- LoginButton /-->
          <!-- SignButton /-->
        </div>                
      </div>
    `;
  }
}
