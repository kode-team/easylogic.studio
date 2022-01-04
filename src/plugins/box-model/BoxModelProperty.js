import { DEBOUNCE, DOMDIFF, IF, INPUT, LOAD, SUBSCRIBE } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { Length } from "el/editor/unit/Length";

import './BoxModelProperty.scss';


const fields = ["margin", "padding"];
let styleKeys = [];
fields.forEach(field => {
  styleKeys.push.apply(styleKeys, ["-top", "-bottom", "-left", "-right"].map(it => field + it));
});


export default class BoxModelProperty extends BaseProperty {

  initialize() {
    super.initialize();

    // 이벤트 재정의 막기 
    this.notEventRedefine = true;
  }

  getTitle() {
    return this.$i18n('box.model.property.title');
  }

  get editableProperty() {
    return 'box-model-block';
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100) + IF('checkShow')]() {
    this.refresh();
  }

  [SUBSCRIBE('refreshSelectionStyleView')]() {
    const current = this.$selection.current;


    if (current?.hasChangedField('padding-left', 'padding-right', 'padding-top', 'padding-bottom')) {
      this.refresh();
    }
  }

  getBody() {
    return /*html*/`<div class="property-item elf--box-model-item" ref="$boxModelItem"></div>`;
  }

  templateInput(key, current) {

    var value = Length.parse(current[key] || 0)

    return /*html*/`<input type="number" ref="$${key}" value="${value.value}" tabIndex="1" />`;
  }

  [LOAD("$boxModelItem") + DOMDIFF]() {
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
      data[key] = this.refs["$" + key].value;
    });

    this.command("setAttributeForMulti", 'change padding or margin', this.$selection.packByValue(data))    
  }
}