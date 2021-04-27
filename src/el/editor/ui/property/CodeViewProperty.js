import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, DOMDIFF, SUBSCRIBE } from "el/base/Event";

import HTMLRenderer from "el/editor/renderer/HTMLRenderer";
import SVGRenderer from "el/editor/renderer/SVGRenderer";
import { registElement } from "el/base/registElement";


export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('code.view.property.title');
  }

  [SUBSCRIBE(
    'refreshSelectionStyleView', 
    'refreshStyleView',
    'refreshSelection',
    'refreshSVGArea'
  ) + DEBOUNCE(100) ]() {
    this.refreshShowIsNot();
  }

  getBody() {
    return `
      <div class="property-item code-view-item" ref='$body'></div>
    `;
  }

  [LOAD('$body') + DOMDIFF] () {
    return [
      HTMLRenderer.codeview(this.$selection.current),
      SVGRenderer.codeview(this.$selection.current)
    ]
  }
}

registElement({CodeViewProperty })
