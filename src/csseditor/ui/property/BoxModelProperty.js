import BaseProperty from "./BaseProperty";
import { INPUT, LOAD, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { Length } from "../../../editor/unit/Length";
import { EVENT } from "../../../util/UIElement";



const fields = ["margin", "padding"];
let styleKeys = [];
fields.forEach(field => {
  styleKeys.push(...["-top", "-bottom", "-left", "-right"].map(it => field + it));
});

export default class BoxModelProperty extends BaseProperty {
  getTitle() {
    return "Box Model";
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow('text');
  }

  getBody() {
    return `<div class="property-item box-model-item" ref="$boxModelItem"></div>`;
  }

  templateInput(key, current) {

    var value = current[key] || Length.px(0)

    return `<input type="number" ref="$${key}" value="${value.value}" />`;
  }

  [LOAD("$boxModelItem")]() {
    var current = editor.selection.current;

    if (!current) return '';

    return `
      <div>
        <div class="margin">
          <div data-value="top">
            ${this.templateInput("margin-top", current)}
          </div>
          <div data-value="bottom">
            ${this.templateInput("margin-bottom", current)}
          </div>
          <div data-value="left">
            ${this.templateInput("margin-left", current)}
          </div>
          <div data-value="right">
            ${this.templateInput("margin-right", current)}
          </div>
        </div>
        <div class="padding">
          <div data-value="top">
            ${this.templateInput("padding-top", current)}
          </div>
          <div data-value="bottom">
            ${this.templateInput("padding-bottom", current)}
          </div>
          <div data-value="left">
            ${this.templateInput("padding-left", current)}
          </div>
          <div data-value="right">
            ${this.templateInput("padding-right", current)}
          </div>
        </div>
      </div>
    `;
  }

  [INPUT("$boxModelItem input")](e) {
    this.resetBoxModel();
  }

  resetBoxModel() {
    var data = {};

    styleKeys.forEach(key => {
      data[key] = Length.px(this.getRef("$", key).value);
    });

    var current = editor.selection.current;

    if (current) {
      current.reset(data);

      this.emit("refreshElement", current);
    }
  }
}
