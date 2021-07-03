import { registElement } from "el/base/registElement";
import "el/editor/ui/property";
import "el/editor/ui/property-editor";
import { EditorElement } from "../common/EditorElement";


export default class AssetItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='asset-items'>
        ${this.$menuManager.getTargetMenuItems('asset').map(it => {
          return /*html*/`<object refClass="${it.refClass}" />`
        }).join('\n')}
      </div>
    `;
  }

}

registElement({ AssetItems })
