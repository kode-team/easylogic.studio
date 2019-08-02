import UIElement from "../../../util/UIElement";
import icon from "../icon/icon";

export default class LogoView extends UIElement {
  template() {
    return `
      <div class='logo'>
        <div class='text'>E</div>
        <div class='extra-text'>asyLogic</div>
      </div>    
    `;
  }
}
