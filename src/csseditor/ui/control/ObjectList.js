import UIElement from "../../../util/UIElement";
import { html } from "../../../util/functions/func";
import property from "./panel/property/index";
import ProjectProperty from "./panel/property/ProjectProperty";
import ArtBoardProperty from "./panel/property/ArtBoardProperty";

export default class ObjectList extends UIElement {
  components() {
    return {
      ProjectProperty,
      ArtBoardProperty
    }
  }
  template() {
    return html`
      <div class="feature-control object-list">
        <div>
          <ProjectProperty />
        </div>
        <div>
          <ArtBoardProperty />
        </div>
      </div>
    `;
  }

  components() {
    return property;
  }

}
