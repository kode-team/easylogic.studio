import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class ObjectItems extends EditorElement {
  template() {
    return /*html*/`
      <div class='object-items' style="height:100%;">
        <div>
          <object refClass="LayerTreeProperty" />
        </div>
      </div>
    `;
  }

}