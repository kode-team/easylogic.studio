import UIElement from "../../../util/UIElement";
import { html } from "../../../util/functions/func";
import property from "./panel/property/index";

export default class Inspector extends UIElement {
  template() {
    return html`
      <div class="feature-control">
        <BackgroundColorProperty />
        <FillProperty />
      </div>
    `;
  }

  components() {
    return property;
  }

  refresh() {
    this.load();
  }
}
