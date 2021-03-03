import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, BIND, DEBOUNCE } from "@core/Event";
import { EVENT } from "@core/UIElement";
import icon from "@icon/icon";
import { Length } from "@unit/Length";

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

  [EVENT('changeImageSize')] (key, value) {
    var [width, height] = value.split('x').map(it => Length.px(it))

    this.command('setAttribute', 'resize image', { 
      width, height
    })
  }

  [CLICK('$resize')] () {
    var current = this.$selection.current;

    if (current) {

      const data = {
        width: current.naturalWidth.clone(),
        height: current.naturalHeight.clone()
      }

      this.command('setAttribute', 'resize image', data)
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

  [EVENT('changeSelect')] (key, value, info) {
    var current = this.$selection.current;

    if (current) {
      current.reset({
        src: value,
        ...info
      })

      this.bindData('$sizeInfo')

      this.command('setAttribute', 'change image', {
        src: value,
        ...info
      }, current.id);      
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow(['image'])

  }
}
