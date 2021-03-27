import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, DOMDIFF } from "@sapa/Event";
import { EVENT } from "@sapa/UIElement";
import HTMLRenderer from "@renderer/HTMLRenderer";
import SVGRenderer from "@renderer/SVGRenderer";
import { registElement } from "@sapa/registerElement";


export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('code.view.property.title');
  }

  [EVENT(
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
