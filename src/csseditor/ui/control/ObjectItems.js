import UIElement from "../../../util/UIElement";
import ProjectProperty from "../property/ProjectProperty";
import ArtBoardProperty from "../property/ArtBoardProperty";
import LayerTreeProperty from "../property/LayerTreeProperty";


export default class ObjectItems extends UIElement {
  components() {
    return {
      ProjectProperty,
      ArtBoardProperty,
      LayerTreeProperty
    }
  }
  template() {
    return `
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
    `;
  }

}
