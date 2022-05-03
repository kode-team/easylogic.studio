import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class VersionView extends EditorElement {
  initState() {
    return {
      version: `@@VERSION@@`,
    };
  }

  template() {
    return `<div class="version-view">v${this.state.version}</div>`;
  }
}
