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

export default class ImageProperty extends BaseProperty {

  getClassName() {
    return 'item'
  }

  getTitle() {
    return editor.i18n('image.property.title')
  }

  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  getFooter() {
    return /*html*/`
      <div>
        <label> ${editor.i18n('image.property.origin')} </label> <span ref='$sizeInfo'></span> <button type="button" ref='$resize'>${icon.size}</button>
      </div>
      <div>
        <SelectEditor ref='$select' label="${editor.i18n('image.property.size')}" key='size' value='' options='${image_size.join(',')}' onchange='changeImageSize' />
      </div>
    `
  }

  [EVENT('changeImageSize')] (key, value) {
    var [width, height] = value.split('x').map(it => Length.px(it))

    editor.selection.reset({
      width, height
    })

    this.emit('refreshElement')
  }

  [CLICK('$resize')] () {
    var current = editor.selection.current;

    if (current) {
      current.resize();

      this.emit('refreshElement', current);        
    }

  }

  [BIND('$sizeInfo')] () {
    var current = editor.selection.current || {};

    return {
      innerHTML: `${editor.i18n('image.property.width')}: ${current.naturalWidth}, ${editor.i18n('image.property.height')}: ${current.naturalHeight}`
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

      this.emit('refreshElement', current);
      this.bindData('$sizeInfo')
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow('image')

  }
}
