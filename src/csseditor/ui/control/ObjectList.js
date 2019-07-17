import UIElement from "../../../util/UIElement";
import AddRect from "./menu-items/AddRect";
import AddCircle from "./menu-items/AddCircle";
import AddImage from "./menu-items/AddImage";
import AddPath from "./menu-items/AddPath";
import AddRedGL from "./menu-items/AddRedGL";
import AddText from "./menu-items/AddText";
import LayerTab from "./LayerTab";

export default class ObjectList extends UIElement {
  components() {
    return {
      LayerTab,      
      AddText,
      AddRedGL,
      AddPath,
      AddRect,
      AddCircle,
      AddImage
    }
  }
  template() {
    return `
      <div class="feature-control object-list">
        <LayerTab />
        <div class='draw-items'>
          <AddRect />
          <AddCircle />         
          <AddText />
          <AddImage />
          <AddPath />
          <!-- <AddRedGL /> -->
        </div>
      </div>
    `;
  }

}
