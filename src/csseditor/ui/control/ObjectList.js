import UIElement from "../../../util/UIElement";
import property from "./panel/property/index";
import ProjectProperty from "./panel/property/ProjectProperty";
import ArtBoardProperty from "./panel/property/ArtBoardProperty";
import LayerTreeProperty from "./panel/property/LayerTreeProperty";


export default class ObjectList extends UIElement {
  components() {
    return {
      ProjectProperty,
      ArtBoardProperty,
      LayerTreeProperty
    }
  }
  template() {
    return `
      <div class="feature-control object-list">
        <div>
          <ProjectProperty />
        </div>
        <div>
          <ArtBoardProperty />
        </div>
        <div>
          <LayerTreeProperty />
        </div>
      </div>
    `;
  }

  components() {
    return property;
  }

}
