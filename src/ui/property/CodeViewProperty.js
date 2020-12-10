import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, VDOM } from "@core/Event";
import { EVENT } from "@core/UIElement";
import { CSS_TO_STRING, TAG_TO_STRING } from "@core/functions/func";
import HTMLRenderer from "@renderer/HTMLRenderer";
import SVGRenderer from "@renderer/SVGRenderer";


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

  [LOAD('$body') + VDOM] () {
    return [
      HTMLRenderer.codeview(this.$selection.current),
      SVGRenderer.codeview(this.$selection.current)
    ]
  }
}
