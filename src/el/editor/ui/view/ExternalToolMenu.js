import { registElement } from "el/base/registElement";
import "el/editor/ui/menu-items";
import { EditorElement } from "../common/EditorElement";

export default class ExternalToolMenu extends EditorElement {

  template() {
    return /*html*/`
      <div class='external-tool-menu  right'>
        <div class='items'>
          <object refClass="Download" />
          <object refClass="Save" />
          <object refClass="Github" />
          <object refClass="Manual" />
          <!-- LoginButton /-->
          <!-- SignButton /-->
        </div>                
      </div>
    `;
  }
}


registElement({ ExternalToolMenu })