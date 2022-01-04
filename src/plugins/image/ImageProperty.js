
import { LOAD, CLICK, BIND, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { Length } from "el/editor/unit/Length";


const image_size = [
  '',
  '100x100',
  '200x200',
  '300x300',
  '400x300',
  '900x600',
  '1024x762'
] 

export default class ImageProperty extends BaseProperty {

  getClassName() {
    return 'item'
  }

  getTitle() {
    return this.$i18n('image.property.title')
  }

  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  getFooter() {
    return /*html*/`
      <div>
        <label> ${this.$i18n('image.property.origin')} </label> 
        <span ref='$sizeInfo'></span> 
        <button type="button" ref='$resize'>${icon.size}</button>
      </div>
      <div>
        <object refClass="SelectEditor"  ref='$select' label="${this.$i18n('image.property.size')}" key='size' value='' options='${image_size.join(',')}' onchange='changeImageSize' />
      </div>
    `
  }

  [SUBSCRIBE_SELF('changeImageSize')] (key, value) {
    var [width, height] = value.split('x').map(it => it)

    this.command('setAttributeForMulti', 'resize image', this.$selection.packByValue({ 
      width, height
    }))
  }

  [CLICK('$resize')] () {
    var current = this.$selection.current;

    if (current) {
      this.command('setAttributeForMulti', 'resize image', this.$selection.packByValue({
        width: (item) => item.naturalWidth.clone(),
        height: (item) => item.naturalHeight.clone()
      }))
    }

  }

  [BIND('$sizeInfo')] () {
    var current = this.$selection.current || {};

    return {
      innerHTML: `${this.$i18n('image.property.width')}: ${current.naturalWidth}, ${this.$i18n('image.property.height')}: ${current.naturalHeight}`
    }
  }

  [LOAD("$body")]() { 
    var current = this.$selection.current || {};

    var src = current.src || ''
    return /*html*/`<object refClass="ImageSelectEditor" 
              ref='$1' 
              key='src' 
              value="${src}" 
              onchange="changeSelect" />`;
  }

  [SUBSCRIBE_SELF('changeSelect')] (key, value, info) {
    var current = this.$selection.current;

    if (current) {
      current.reset({
        src: value,
        ...info
      })

      this.bindData('$sizeInfo')

      this.command('setAttributeForMulti', 'change image', this.$selection.packByValue({
        src: value,
        ...info
      }));      
    }
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow(['image'])

  }
}