import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, CLICK, BIND, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Length } from "../../../editor/unit/Length";

const image_size = [
  '',
  '100x100',
  '200x200',
  '300x300',
  '400x300',
  '900x600',
  '1024x762'
] 

const i18n = editor.initI18n('image.property')

export default class ImageProperty extends BaseProperty {

  getClassName() {
    return 'item'
  }

  getTitle() {
    return i18n('title')
  }

  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  getFooter() {
    return /*html*/`
      <div>
        <label> ${i18n('origin')} </label> <span ref='$sizeInfo'></span> <button type="button" ref='$resize'>${icon.size}</button>
      </div>
      <div>
        <SelectEditor ref='$select' label="${i18n('size')}" key='size' value='' options='${image_size.join(',')}' onchange='changeImageSize' />
      </div>
    `
  }

  [EVENT('changeImageSize')] (key, value) {
    var [width, height] = value.split('x').map(it => Length.px(it))

    this.emit('SET_ATTRIBUTE', { 
      width, height
    })
  }

  [CLICK('$resize')] () {
    var current = editor.selection.current;

    if (current) {
      this.emit('SET_ATTRIBUTE', { 
        width: current.naturalWidth.clone(),
        height: current.naturalHeight.clone()
      }, current.id)
    }

  }

  [BIND('$sizeInfo')] () {
    var current = editor.selection.current || {};

    return {
      innerHTML: `${i18n('width')}: ${current.naturalWidth}, ${i18n('height')}: ${current.naturalHeight}`
    }
  }

  [LOAD("$body")]() { 
    var current = editor.selection.current || {};

    var src = current['src'] || ''
    return /*html*/`<ImageSelectEditor 
              ref='$1' 
              key='src' 
              value="${src}" 
              onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value, info) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        src: value,
        ...info
      })

      this.bindData('$sizeInfo')

      this.emit('SET_ATTRIBUTE', {
        src: value,
        ...info
      }, current.id);      
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow('image')

  }
}
