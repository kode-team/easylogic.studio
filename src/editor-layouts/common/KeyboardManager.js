import Dom from "el/sapa/functions/Dom";

import { KEYDOWN, KEYUP, IF, PREVENT } from "el/sapa/Event";

import { EditorElement } from "el/editor/ui/common/EditorElement";

const formElements = ['TEXTAREA', 'INPUT', 'SELECT']

export default class KeyboardManager extends EditorElement {
  template() {
    return /*html*/`
      <div class="keyboard-manager"></div>
    `;
  }

  isNotFormElement(e) {
    var tagName = e.target.tagName;

    if (formElements.includes(tagName)) return false; 
    else if (Dom.create(e.target).attr('contenteditable') === 'true') return false; 

    return true;
  }  

  [KEYDOWN('document') + IF('isNotFormElement') + PREVENT] (e) {
    this.emit('keymap.keydown', e);
  }

  [KEYUP('document') + IF('isNotFormElement')] (e) {
    this.emit('keymap.keyup', e);
  }
}