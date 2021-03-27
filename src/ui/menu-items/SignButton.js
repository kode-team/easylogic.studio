import { registElement } from "@sapa/registerElement";
import MenuItem from "./MenuItem";

export default class SignButton extends MenuItem {
  getIcon() {
    return "github";
  }
  getTitle() {
    return "Sign";
  }

  clickButton(e) {
    this.emit('showSignWindow')
  }
}

registElement({ SignButton })