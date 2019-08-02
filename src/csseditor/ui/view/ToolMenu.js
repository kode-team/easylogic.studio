import UIElement from "../../../util/UIElement";
import menuItems from "../menu-items/index";

export default class ToolMenu extends UIElement {
  components() {
    return menuItems;
  }

  template() {
    return `
      <div class='tool-menu '>
        <div class='items'>
         
          <CopyItem />
        </div>

      </div>
    `;
  }
}
