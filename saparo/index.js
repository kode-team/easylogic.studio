// eslint-disable-next-line import/no-unresolved
import { UIElement } from "../dist/editor.es.js";

class A extends UIElement {
  template() {
    return "<div>fdsafdsf</div>";
  }
}

console.log(new A().render());
