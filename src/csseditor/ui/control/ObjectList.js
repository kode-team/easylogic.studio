import UIElement from "../../../util/UIElement";
import ProjectProperty from "./panel/property/ProjectProperty";
import ArtBoardProperty from "./panel/property/ArtBoardProperty";
import LayerTreeProperty from "./panel/property/LayerTreeProperty";
import AddRect from "./menu-items/AddRect";
import AddCircle from "./menu-items/AddCircle";
import AddImage from "./menu-items/AddImage";
import AddPath from "./menu-items/AddPath";


export default class ObjectList extends UIElement {
  components() {
    return {
      AddPath,
      AddRect,
      AddCircle,
      AddImage,
      ProjectProperty,
      ArtBoardProperty,
      LayerTreeProperty
    }
  }
  template() {
    return `
      <div class="feature-control object-list">
        <div class='object-items'>
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
        <div class='draw-items'>
          <AddRect />
          <AddCircle />         
          <AddImage />
          <AddPath />
        </div>
      </div>
    `;
  }

}
