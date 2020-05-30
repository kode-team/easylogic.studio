import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, BIND } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Length } from "../../../editor/unit/Length";

export default class VideoProperty extends BaseProperty {

  getClassName() {
    return 'item'
  }

  getTitle() {
    return this.$i18n('video.property.title')
  }

  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  getFooter() {
    return /*html*/`
      <div>
        <label> ${this.$i18n('video.property.origin')} </label> <span ref='$sizeInfo'></span> <button type="button" ref='$resize'>${icon.size}</button>
      </div>
    `
  }

  [EVENT('changeImageSize')] (key, value) {
    var [width, height] = value.split('x').map(it => Length.px(it))

    this.emit('setAttribute', { 
      width, height
    })
  }

  [CLICK('$resize')] () {
    var current = this.$selection.current;

    if (current) {

      current.reset({
        width: current.naturalWidth.clone(),
        height: current.naturalHeight.clone()
      })

      this.emit('resetSelection');
    }

  }

  [BIND('$sizeInfo')] () {
    var current = this.$selection.current || {};

    return {
      innerHTML: `${this.$i18n('video.property.width')}: ${current.naturalWidth}, ${this.$i18n('video.property.height')}: ${current.naturalHeight}`
    }
  }

  [LOAD("$body")]() { 
    var current = this.$selection.current || {};

    var src = current['src'] || ''
    return /*html*/`<ImageSelectEditor 
              ref='$1' 
              key='src' 
              value="${src}" 
              onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value, info) {
    var current = this.$selection.current;

    if (current) {
      current.reset({
        src: value,
        ...info
      })

      this.bindData('$sizeInfo')

      this.emit('setAttribute', {
        src: value,
        ...info
      }, current.id);      
    }
  }

  [EVENT('refreshSelection')]() {

    this.refreshShow(['video'])

  }
}
