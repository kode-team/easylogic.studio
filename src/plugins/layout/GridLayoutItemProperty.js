import { DEBOUNCE, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";

import { CSS_TO_STRING, STRING_TO_CSS } from "el/base/functions/func";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class GridLayoutItemProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('grid.layout.item.property.title');
  }


  getLayoutOptions () {
    return ['none', 'value'].map(it => {
        return `${it}:${this.$i18n(`grid.layout.item.property.${it}`)}`
    }).join(',');
  }

  getClassName() {
    return 'grid-layout-item-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$body'></div>
      `;
  }  

  [LOAD('$body')] () {
    var current = this.$selection.current || { 'grid-layout-item' : 'none' }

    var valueType = current['grid-layout-item'] || 'none';

    var obj = {}
    if (['none'].includes(valueType) === false) {
      obj  = STRING_TO_CSS(current['grid-layout-item'])
    }

    if (Object.keys(obj).length > 0) {
      valueType = 'value'
    }

    return /*html*/`
      <div class='layout-select'>
        <object refClass="SelectIconEditor" 
        ref='$layout' 
        key='layout' 
        icon="true" 
        value="${valueType}"
        options="${this.getLayoutOptions()}"  
        onchange="changeLayoutType" />
      </div>
      <div class='layout-list' ref='$layoutList' data-selected-value='${valueType}'>
        <div data-value='none'></div>
        <div data-value='value'>
          <div class='value-item'>
            <label></label>
            <div>${this.$i18n('grid.layout.item.property.start')}</div>
            <div>${this.$i18n('grid.layout.item.property.end')}</div>
          </div>
          <div class='value-item'>
            <label>${this.$i18n('grid.layout.item.property.column')}</label>
            <div>
              <object refClass="NumberInputEditor"  ref='$columnStart' key="grid-column-start" value="${obj['grid-column-start'] || '0'}" min='0' onchange='changeGridItem' />
            </div>
            <div>
              <object refClass="NumberInputEditor"  ref='$columnEnd' key="grid-column-end" value="${obj['grid-column-end'] || '0'}" min='0' onchange='changeGridItem' />
            </div>            
          </div>
          <div class='value-item'>
            <label>${this.$i18n('grid.layout.item.property.row')}</label>
            <div>
              <object refClass="NumberInputEditor"  ref='$rowStart' key="grid-row-start" value="${obj['grid-row-start'] || '0'}" min='0' onchange='changeGridItem' />
            </div>
            <div>
              <object refClass="NumberInputEditor"  ref='$rowEnd' key="grid-row-end" value="${obj['grid-row-end'] || '0'}" min='0' onchange='changeGridItem' />
            </div>            
          </div>          
        </div>
      </div>
    `
  }

  getGridValue () {    

    var obj = {
      'grid-column-start': this.children.$columnStart.getValue(),
      'grid-column-end': this.children.$columnEnd.getValue(),
      'grid-row-start': this.children.$rowStart.getValue(),
      'grid-row-end': this.children.$rowEnd.getValue(),
    }



    return CSS_TO_STRING(obj)
  }

  [SUBSCRIBE_SELF('changeGridItem')] (key, value) {

    this.command('setAttributeForMulti', 'change grid layout item', this.$selection.packByValue({ 
      'grid-layout-item': this.getGridValue()
    }))

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize')
    })

  }

  [SUBSCRIBE_SELF('changeLayoutType')] (key, value) {

    var valueType = this.children.$layout.getValue()
    var value = valueType;

    if (valueType === 'value') {
      value = this.getGridValue()
    }

    this.command('setAttributeForMulti', 'change grid layout item', this.$selection.packByValue({ 
      'grid-layout-item': value
    }))

    // 타입 변화에 따른 하위 아이템들의 설정을 바꿔야 한다. 
    this.refs.$layoutList.attr('data-selected-value', valueType);

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize')    
    })

  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = this.$selection.current; 
      return  current && current.isInGrid()
    });
  }
}