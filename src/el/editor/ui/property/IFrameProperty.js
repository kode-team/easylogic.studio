import BaseProperty from "./BaseProperty";
import { DEBOUNCE, SUBSCRIBE } from "el/base/Event";

import { registElement } from "el/base/registerElement";

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
        <object refClass="TextEditor" ref="$input" label="URL" key="url" onchange="changeText" />
      </div>
    `;
  }  

  [SUBSCRIBE('changeText') + DEBOUNCE(100)] (key, value) {
    var current = this.$selection.current;

    if (current) {
      current.reset({
        [key]: value,
      })

      this.command('setAttribute', 'change iframe url', {
        [key]: value,
      }, current.id);      
    }
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow(['iframe'])

  }
}

registElement({ IFrameProperty })