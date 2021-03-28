import "./PathManager";
import "./DrawManager";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class PageSubEditor extends EditorElement {

  template() {
    return/*html*/`
      <div class='page-subeditor'>
        <object refClass='PathManager' />
        <object refClass='DrawManager' />
        <object refClass='SelectionManager' />
      </div>
    `;
  }
}

registElement({ PageSubEditor })
