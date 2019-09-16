import UIElement from "../../../util/UIElement";
import icon from "../icon/icon";

export default class LogoView extends UIElement {
  template() {
    return /*html*/`
      <div class='logo'>
        <div class='text'>EASY</div>
        <div class='extra-text'>LOGIC</div>
        <div class='image'></div>
      </div>    
    `;
  }
}
