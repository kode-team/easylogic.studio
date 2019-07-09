import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";


export default class ColorAssetsProperty extends BaseProperty {

  getTitle() {
    return "Color";
  }
  getBody() {
    return `
      <div class='property-item color-assets' ref='$color'></div>
    `;
  }

  isHideHeader() {
    return true; 
  }

  [LOAD("$color")]() {
    var current = editor.selection.currentProject || { colors: [
      {color: 'black', name: 'sample-color', variable: 'yellow'}

    ] };

    return current.colors.map(color => {
      return `
        <div class='color-item'>
          <div class='preview'><div class='color-view' style='background-color: ${color.color};'></div></div>
          <div class='title'>
            <div>
              <input type='text' class='name' value='${color.name}' placeholder="name" />
            </div>
            <div>
              <input type='text' class='var' value='${color.variable}' placeholder="--var' />
            </div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })
  }
}
