
import { LOAD, CLICK, DEBOUNCE, SUBSCRIBE } from "el/base/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class TransformOriginProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('transform.origin.property.title');
  }

  hasKeyframe() {
    return true;
  }

  getKeyframeProperty() {
    return 'transform-origin'
  }

  [CLICK('$remove')]() {
    this.trigger('changeTransformOrigin', '');
  }

  getBody() {
    return /*html*/`
      <div class="property-item full transform-origin-item" ref='$body'></div>
    `;
  }

  [LOAD('$body')]() {
    var current = this.$selection.current || {};
    var value = current['transform-origin'] || ''

    return /*html*/`<object refClass="TransformOriginEditor" ref='$1' value='${value}' onchange='changeTransformOrigin' />`
  }


  [SUBSCRIBE('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project', 'artboard']);
  }

  [SUBSCRIBE('changeTransformOrigin')](key, value) {

    this.command('setAttribute', 'change transform-origin', {
      'transform-origin': value
    })
  }

}
