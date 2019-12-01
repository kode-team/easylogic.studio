import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { DEBOUNCE, LOAD, BIND } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

const i18n = editor.initI18n('layout.property');

const makeOptionsFunction = (options) => {
    return () => {
        return options.split(',').map(it => {
            return `${it}:${i18n(it)}`
        }).join(',');
    }
}

const getLayoutOptions = makeOptionsFunction('default,flex,grid')


export default class LayoutProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  getClassName() {
    return 'layout-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$layoutType'></div>
      `;
  }  

  [LOAD('$layoutType')] () {
    var current = editor.selection.current || { layout : 'default' }
    return /*html*/`
      <div class='layout-select'>
        <SelectIconEditor 
        ref='$layout' 
        key='layout' 
        icon="true" 
        value="${current.layout}"
        options="${getLayoutOptions()}"  
        onchange="changeLayoutType" />
      </div>
      <div class='layout-list' ref='$layoutList' data-selected-value='${current.layout}'>
        <div data-value='none'>Default</div>
        <div data-value='flex'>
          <FlexLayoutEditor ref='$flex' key='flex-layout' value="${current['flex-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
        <div data-value='grid'>
          <GridLayoutEditor ref='$grid' key='grid-layout' value="${current['grid-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
      </div>
    `
  }

  [EVENT('changeLayoutInfo')] (key, value) {
    editor.selection.reset({
      [key]: value
    })

    this.emit('refreshStyleView');  // 전체 새로 고침 
    this.emit('refreshAllElementBoundSize');    
  }

  [EVENT('changeLayoutType')] (key, value) {
    editor.selection.reset({
      [key]: value
    })

    // 타입 변화에 따른 하위 아이템들의 설정을 바꿔야 한다. 
    this.refs.$layoutList.attr('data-selected-value', value);

    this.emit('refreshStyleView');  // 전체 새로 고침 
    this.emit('refreshAllElementBoundSize');
    this.emit('changeItemLayout')
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['layer', 'artboard'], true);
  }
}
