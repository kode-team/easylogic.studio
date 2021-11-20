import { EditorElement } from "el/editor/ui/common/EditorElement";
import DrawManager from "./page-sub-editor/DrawManager";
import PathManager from "./page-sub-editor/PathManager";

import './PageSubEditor.scss';


export default class PageSubEditor extends EditorElement {

  components() {
    return {
      PathManager,
      DrawManager
    }
  }

  template() {
    return/*html*/`
      <div class='elf--page-subeditor'>
        <object refClass='PathManager' />
        <object refClass='DrawManager' />
      </div>
    `;
  }
}
