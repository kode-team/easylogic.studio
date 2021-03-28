import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class LogoView extends EditorElement {
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