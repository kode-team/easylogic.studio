import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { DEBOUNCE, LOAD, BIND } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import { CSS_TO_STRING } from "../../../util/functions/func";

const i18n = editor.initI18n('flex.layout.item.property');

const makeOptionsFunction = (options) => {
    return () => {
        return options.split(',').map(it => {
            return `${it}:${i18n(it)}`
        }).join(',');
    }
}

const getLayoutOptions = makeOptionsFunction('none,auto,value')


export default class FlexLayoutItemProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  getClassName() {
    return 'flex-layout-item-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$body'></div>
      `;
  }  

  [LOAD('$body')] () {
    var current = editor.selection.current || { 'flex-layout-item' : 'none' }

    var valueType = current['flex-layout-item'] || 'none';

    var arr = [] 
    if (['none', 'auto'].includes(valueType) === false) {
      arr  = valueType.split(' ');
    }

    if (arr.length > 0) {
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
      <div class='layout-list' ref='$layoutList' data-selected-value='${current.layout}'>
        <div data-value='none'></div>
        <div data-value='auto'></div>
        <div data-value='value'>
          <div class='value-item'>
            <RangeEditor ref='$grow' label='${i18n('grow')}' key="flex-grow" value="${arr[0]}" min='0' max='1' step='0.01' units=",auto" onchange='changeFlexItem' />
          </div>
          <div class='value-item'>
            <RangeEditor ref='$shrink' label='${i18n('shrink')}' key="flex-shrink" value="${arr[1]}" min='0' max='1' step='0.01' units=",auto" onchange='changeFlexItem' />
          </div>
          <div class='value-item'>
            <RangeEditor ref='$basis' label='${i18n('basis')}' key="flex-basis" value="${arr[2]}" min='0' units="px,em,%,auto" onchange='changeFlexItem' />
          </div>                    
        </div>
      </div>
    `
  }

  getFlexItemValue  (value) {
    return value.unit === 'auto' ? 'auto' : value + "";
  }

  getFlexValue () {

    var grow = this.children.$grow.getValue();
    var shrink = this.children.$shrink.getValue();
    var basis = this.children.$basis.getValue();

    grow = this.getFlexItemValue(grow);
    shrink = this.getFlexItemValue(shrink);
    basis = this.getFlexItemValue(basis);

    return CSS_TO_STRING({
      flex: `${grow} ${shrink} ${basis}`
    })
  }

  [EVENT('changeFlexItem')] (key, value) {

    this.emit('SET_ATTRIBUTE', { 
      'flex-layout-item': this.getFlexValue()
    })

    this.emit('refreshAllElementBoundSize')    
  }

  [EVENT('changeLayoutType')] (key, value) {

    var valueType = this.children.$layout.getValue()
    var value = valueType;

    if (valueType === 'value') {
      value = this.getFlexValue()
    }

    this.emit('SET_ATTRIBUTE', { 
      'flex-layout-item': value
    })

    // 타입 변화에 따른 하위 아이템들의 설정을 바꿔야 한다. 
    this.refs.$layoutList.attr('data-selected-value', valueType);

    this.emit('refreshAllElementBoundSize')    
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = editor.selection.current; 
      return  current && current.isInFlex()
    });
  }
}
