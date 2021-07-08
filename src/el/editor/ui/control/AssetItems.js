import { registElement } from "el/base/registElement";
import "el/editor/ui/property";
import "el/editor/ui/property-editor";
import { EditorElement } from "../common/EditorElement";


export default class AssetItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='asset-items'>
        ${this.$menuManager.generate('asset')}
      </div>
    `;
  }

}

registElement({ AssetItems })
