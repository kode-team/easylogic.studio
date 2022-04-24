import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class AssetItems extends EditorElement {
  template() {
    return /*html*/ `
      <div class='asset-items'>
        ${this.$injectManager.generate("asset")}
      </div>
    `;
  }
}
