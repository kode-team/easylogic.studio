import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";
import "../menu-items/index";

export default class PreviewToolMenu extends EditorElement {

  template() {
    return /*html*/`
      <div class='preview-tool-menu'>
        <div class='items'>
          <object refClass="KeyBoard" />      
          <object refClass="Fullscreen" />      
          <object refClass="ExportView" />
          <object refClass="ExportCodePen" />
          <div class='divdier'></div>
          <object refClass="Download" />
          <object refClass="Save" />
          <object refClass="Github" />
          <object refClass="Manual" />          
        </div>                
      </div>
    `;
  }
}

registElement({ PreviewToolMenu })
 