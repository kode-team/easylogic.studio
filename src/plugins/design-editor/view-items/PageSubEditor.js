import { EditorElement } from "el/editor/ui/common/EditorElement";

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
