
import { DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import {BaseProperty} from "el/editor/ui/property/BaseProperty";
import { createComponent } from "el/sapa/functions/jsx";

export default class IFrameProperty extends BaseProperty {

  getClassName() {
    return 'item'
  }

  getTitle() {
    return this.$i18n('iframe.property.title')
  }

  getBody() {
    return /*html*/`
      <div ref='$body' style='padding-top: 3px;'>
        ${createComponent("TextEditor", {
          ref: "$input",
          label: "URL",
          key: "url",
          onchange: "changeText"
        })}
      </div>
    `;
  }  

  refresh() {
    const current = this.$selection.current; 

    if (current) {
      this.children.$input.setValue(current.url);
    }
  }

  [SUBSCRIBE_SELF('changeText') + DEBOUNCE(100)] (key, value) {
    var current = this.$selection.current;

    if (current) {
      current.reset({
        [key]: value,
      })

      this.command('setAttributeForMulti', 'change iframe url', this.$selection.packByValue({
        [key]: value,
      }));      
    }
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow(['iframe'])

  }
}