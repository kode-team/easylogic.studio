
import { LOAD, CLICK, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF, IF } from "el/sapa/Event";
import {BaseProperty} from "el/editor/ui/property/BaseProperty";
import { createComponent } from "el/sapa/functions/jsx";

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

    return createComponent("TransformOriginEditor", { 
      ref:'$1',
      value, 
      onchange: 'changeTransformOrigin' 
    });
  }

  get editableProperty() {
    return 'transform-origin';
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100) + IF('checkShow')]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF('changeTransformOrigin')](key, value) {

    this.command('setAttributeForMulti', 'change transform-origin', this.$selection.packByValue({
      'transform-origin': value
    }))
  }

}
