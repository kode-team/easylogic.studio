import { Item } from "./Item";
import { CSS_TO_STRING } from "../../util/css/make";

export class Property extends Item {
  isAttribute() {
    return true;
  }

  toCSS() {
    return {};
  }

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }
}
