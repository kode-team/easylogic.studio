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
      <div class='layout-list' ref='$layoutList'>
        <div data-value='default' class='${current.layout === 'default' ? 'selected': ''}'></div>
        <div data-value='flex' class='${current.layout === 'flex' ? 'selected': ''}'>
          <FlexLayoutEditor ref='$flex' key='flex-layout' value="${current['flex-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
        <div data-value='grid' class='${current.layout === 'grid' ? 'selected': ''}'>
          <GridLayoutEditor ref='$grid' key='grid-layout' value="${current['grid-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
      </div>
    `
  }

  [EVENT('changeLayoutInfo')] (key, value) {
    this.emit('setAttribute', { 
      [key]: value
    }, null, false, true)

    this.emit('refreshAllElementBoundSize');    
  }

  [EVENT('changeLayoutType')] (key, value) {

    this.$selection.reset({
      [key]: value 
    })

    this.emit('setAttribute', { 
      [key]: value
    }, null, false, true)

    this.refresh();

    this.emit('refreshAllElementBoundSize');
    this.emit('changeItemLayout')
  }

  [EVENT('refreshSelection') + DEBOUNCE(1000)]() {
    this.refreshShow(['rect', 'circle', 'artboard'], true);
  }
}
