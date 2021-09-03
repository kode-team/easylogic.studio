import { CLICK, LOAD } from 'el/sapa/Event';
import { EditorElement } from '../common/EditorElement';
import { TabPanel } from './TabPanel';

import './Tabs.scss';

export class Tabs extends EditorElement {
    components() {
      return {
        TabPanel
      }
    }
  
    afterRender() {
      setTimeout(() => {
        this.setValue(this.state.selectedValue);
      }, 0)
  
    }
  
    initState() {
      return {
        type: this.props.type || 'number',
        selectedValue: this.props.selectedValue || '',
      }
    }
  
    template() {
      return /*html*/`
        <div class="tab number-tab" ref="$tab">
  
        </div>
      `
    }
  
    [LOAD('$tab')]() {
      const { content } = this.props;
      const contentChildren = this.parseContent(content)
  
      const children = contentChildren.filter(it => it.refClass === 'TabPanel');
  
      return /*html*/`
        <div class="tab-header" ref="$header">
          ${children.map(it => {
            return /*html*/`
              <div class="tab-item" data-value="${it.props.value}" title='${it.props.title}'>
                <label class='icon'>${it.props.icon}</label>
              </div>         
            `
          }).join('')}
        </div>    
  
        <div class="tab-body" ref="$body">
          ${content}
        </div>
      `
    }
  
    [CLICK("$header .tab-item:not(.empty-item)")](e) {
  
      var selectedValue = e.$dt.attr('data-value')
  
      this.setValue(selectedValue);
    }

    updateData(data) {
      this.setState(data, false);
      this.parent.trigger(this.props.onchange, this.getValue());
    }

    getValue() {
      return this.state.selectedValue;
    }
  
    setValue(selectedValue) {
      this.$el.$(`* > .tab-item[data-value="${selectedValue}"]`)?.onlyOneClass('selected');
      this.$el.$(`* > .tab-content[data-value="${selectedValue}"]`)?.onlyOneClass('selected');

      this.updateData({ selectedValue })
    }
  
  }