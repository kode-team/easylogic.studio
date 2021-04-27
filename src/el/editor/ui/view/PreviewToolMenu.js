import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";
import "../menu-items/index";

export default class PreviewToolMenu extends EditorElement {

  template() {
    return /*html*/`
      <div class='preview-tool-menu'>
        <div class='items'>
          <object refClass="Download" />
          <object refClass="Save" />
          <object refClass="Manual" />          
        </div>                
      </div>
    `;
  }
}

registElement({ PreviewToolMenu })
 