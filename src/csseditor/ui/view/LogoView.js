import UIElement from "../../../util/UIElement";
import icon from "../icon/icon";

export default class LogoView extends UIElement {
  template() {
    return /*html*/`
      <div class='logo'>
        <div class='text'>6</div>
        <div class='extra-text'>Cats</div>
        <div class='image'></div>
      </div>    
    `;
  }
}
