import { BIND } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class ColorView extends EditorElement {
  initState() {
    return {
      value: "rgba(0, 0, 0, 1)",
    };
  }

  template() {
    return /*html*/ `<div class='color'></div>`;
  }

  [BIND("$el")]() {
    return {
      style: {
        "background-color": this.state.value,
      },
    };
  }

  setValue(value) {
    this.setState({
      value,
    });
  }
}
