import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";

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

registElement({ LogoView })