import BaseProperty from "./BaseProperty";
import { INPUT, LOAD, DEBOUNCE } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { EVENT } from "../../../util/UIElement";

const fields = ["margin", "padding"];
let styleKeys = [];
fields.forEach(field => {
  styleKeys.push(...["-top", "-bottom", "-left", "-right"].map(it => field + it));
});


export default class BoxModelProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('box.model.property.title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['artboard', 'rect', 'circle', 'text']);
  }

  getBody() {
    return /*html*/`<div class="property-item box-model-item" ref="$boxModelItem"></div>`;
  }

  templateInput(key, current) {

    var value = current[key] || Length.z()

    return /*html*/`<input type="number" ref="$${key}" value="${value.value}" tabIndex="1" />`;
  }

  [LOAD("$boxModelItem")]() {
    var current = this.$selection.current;

    if (!current) return '';

    return /*html*/`
      <div>
        <div class="margin" data-title="${this.$i18n('box.model.property.margin')}">
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
        <div class="padding" data-title="${this.$i18n('box.model.property.padding')}">
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

    this.emit("setAttribute", data)    
  }
}
