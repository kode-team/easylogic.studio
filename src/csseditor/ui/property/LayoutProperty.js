import BaseProperty from "./BaseProperty";
import { DEBOUNCE, LOAD} from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

export default class LayoutProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('layout.property.title');
  }

  getLayoutOptions () {
    return ['default', 'flex', 'grid'].map(it => {
        return `${it}:${this.$i18n(`layout.property.${it}`)}`
    }).join(',');
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
    var current = this.$selection.current || { layout : 'default' }
    return /*html*/`
      <div class='layout-select'>
        <SelectIconEditor 
        ref='$layout' 
        key='layout' 
        icon="true" 
        value="${current.layout}"
        options="${this.getLayoutOptions()}"  
        colors=",green,red"
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
    this.emit('setAttribute', { 
      [key]: value
    })

    this.emit('refreshAllElementBoundSize');    
  }

  [EVENT('changeLayoutType')] (key, value) {
    this.emit('setAttribute', { 
      [key]: value
    })

    // 타입 변화에 따른 하위 아이템들의 설정을 바꿔야 한다. 
    this.refs.$layoutList.attr('data-selected-value', value);

    this.refresh();

    this.emit('refreshAllElementBoundSize');
    this.emit('changeItemLayout')
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['layer', 'artboard'], true);
  }
}
