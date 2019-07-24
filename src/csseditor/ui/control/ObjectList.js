import UIElement from "../../../util/UIElement";
import AddRect from "./menu-items/AddRect";
import AddCircle from "./menu-items/AddCircle";
import AddImage from "./menu-items/AddImage";
import AddPath from "./menu-items/AddPath";
import AddRedGL from "./menu-items/AddRedGL";
import AddText from "./menu-items/AddText";
import LayerTab from "./LayerTab";
import AddPolygon from "./menu-items/AddPolygon";
import AddStar from "./menu-items/AddStar";


export default class ObjectList extends UIElement {
  components() {
    return {
      AddStar,
      AddPolygon,
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
          <label>CSS</label>
          <AddRect />
          <AddCircle />         
          <AddText />
          <AddImage />
          <div class='split'></div>
          <label>SVG</label>
          <AddPath />
          <AddPolygon />
          <AddStar />
          <!-- <AddRedGL /> -->
        </div>
      </div>
    `;
  }

}
