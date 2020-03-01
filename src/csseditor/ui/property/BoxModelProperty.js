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

const i18n = editor.initI18n('box.model.property');

export default class BoxModelProperty extends BaseProperty {
  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project']);
  }

  getBody() {
    return /*html*/`<div class="property-item box-model-item" ref="$boxModelItem"></div>`;
  }

  templateInput(key, current) {

    var value = current[key] || Length.px(0)

    return /*html*/`<input type="number" ref="$${key}" value="${value.value}" />`;
  }

  [LOAD("$boxModelItem")]() {
    var current = editor.selection.current;

    if (!current) return '';

    return /*html*/`
      <div>
        <div class="margin" data-title="${i18n('margin')}">
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
        <div class="padding" data-title="${i18n('padding')}">
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
        <div class='content' title='Content'>
        
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

    this.emit("SET_ATTRIBUTE", data)    
  }
}
