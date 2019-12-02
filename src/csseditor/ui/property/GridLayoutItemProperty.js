import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { DEBOUNCE, LOAD } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import { CSS_TO_STRING, STRING_TO_CSS } from "../../../util/functions/func";

const i18n = editor.initI18n('grid.layout.item.property');

const makeOptionsFunction = (options) => {
    return () => {
        return options.split(',').map(it => {
            return `${it}:${i18n(it)}`
        }).join(',');
    }
}

const getLayoutOptions = makeOptionsFunction('none,value')


export default class GridLayoutItemProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
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
    var current = editor.selection.current || { 'grid-layout-item' : 'none' }

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
        <SelectIconEditor 
        ref='$layout' 
        key='layout' 
        icon="true" 
        value="${valueType}"
        options="${getLayoutOptions()}"  
        onchange="changeLayoutType" />
      </div>
      <div class='layout-list' ref='$layoutList' data-selected-value='${valueType}'>
        <div data-value='none'></div>
        <div data-value='value'>
          <div class='value-item'>
            <label></label>
            <div>${i18n('start')}</div>
            <div>${i18n('end')}</div>
          </div>
          <div class='value-item'>
            <label>${i18n('column')}</label>
            <div>
              <NumberInputEditor ref='$columnStart' key="grid-column-start" value="${obj['grid-column-start'] || '0'}" min='1' onchange='changeGridItem' />
            </div>
            <div>
              <NumberInputEditor ref='$columnEnd' key="grid-column-end" value="${obj['grid-column-end'] || '0'}" min='1' onchange='changeGridItem' />
            </div>            
          </div>
          <div class='value-item'>
            <label>${i18n('row')}</label>
            <div>
              <NumberInputEditor ref='$rowStart' key="grid-row-start" value="${obj['grid-row-start'] || '0'}" min='1' onchange='changeGridItem' />
            </div>
            <div>
              <NumberInputEditor ref='$rowEnd' key="grid-row-end" value="${obj['grid-row-end'] || '0'}" min='1' onchange='changeGridItem' />
            </div>            
          </div>          
        </div>
      </div>
    `
  }

  getGridValue () {    

    console.log(this.children.$columnStart.getValue())

    var obj = {
      'grid-column-start': this.children.$columnStart.getValue(),
      'grid-column-end': this.children.$columnEnd.getValue(),
      'grid-row-start': this.children.$rowStart.getValue(),
      'grid-row-end': this.children.$rowEnd.getValue(),
    }



    return CSS_TO_STRING(obj)
  }

  [EVENT('changeGridItem')] (key, value) {

    editor.selection.reset({
      'grid-layout-item': this.getGridValue()
    })

    this.emit('refreshSelectionStyleView');  // 전체 새로 고침 
  }

  [EVENT('changeLayoutType')] (key, value) {

    var valueType = this.children.$layout.getValue()
    var value = valueType;

    if (valueType === 'value') {
      value = this.getGridValue()
    }

    editor.selection.reset({
      'grid-layout-item': value
    })

    // 타입 변화에 따른 하위 아이템들의 설정을 바꿔야 한다. 
    this.refs.$layoutList.attr('data-selected-value', valueType);

    this.emit('refreshSelectionStyleView');  // 전체 새로 고침 
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = editor.selection.current; 
      return  current && current.isInGrid()
    });
  }
}
