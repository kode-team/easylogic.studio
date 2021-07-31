

import { CLICK } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class Inspector extends EditorElement {

  initState() {
    return {
      selectedIndexValue: 'style'
    }
  }

  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
          <div class="tab number-tab" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item selected" data-value="style" title='${this.$i18n('inspector.tab.title.style')}'>
                <label class='icon'>${icon.palette}</label>
              </div>         
              <div class="tab-item" data-value="transition" title="${this.$i18n('inspector.tab.title.transition')}">
                <label>${icon.flash_on}</label>
              </div>
              <div class="tab-item" data-value="code" title='${this.$i18n('inspector.tab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>          

              ${this.$menuManager.getTargetMenuItems('inspector.tab').map(it => {
                const { value, title} = it.class;              
                return /*html*/`
                  <div class='tab-item' data-value='${value}' data-direction="right"  data-tooltip="${title}">
                    <label>${icon[it.class.icon] || it.class.icon}</label>
                  </div>
                `
              })}
            </div>
            <div class="tab-body" ref="$body">

              <div class="tab-content selected scrollbar" data-value="style">
                <object refClass="AlignmentProperty" />

                <!-- Default Property --> 
                <object refClass="PositionProperty" />
                <object refClass="AppearanceProperty" />                                   

                ${this.$menuManager.generate('inspector.tab.style')}                             
                <div class='empty'></div>
              </div>     
              <div class='tab-content scrollbar' data-value='transition'>
                ${this.$menuManager.generate('inspector.tab.transition')}              
                <div class='empty'></div>                
              </div>                        
              <div class="tab-content" data-value="code">
                ${this.$menuManager.generate('inspector.tab.code')}                            
                <div class='empty'></div>                           
              </div>       
            
              
              ${this.$menuManager.getTargetMenuItems('inspector.tab').map(it => {
                const { value, title, loadElements } = it.class;
                return /*html*/`
                  <div class='tab-content' data-value='${value}'>
                    ${loadElements.map(element => {
                      return `<object refClass="${element}" />`
                    }).join('\n')}
                    ${this.$menuManager.generate(`inspector.tab.${value}`)}
                  </div>
                `
              })}              
            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.empty-item)")](e) {

    var selectedIndexValue = e.$dt.attr('data-value')
    if (this.state.selectedIndexValue === selectedIndexValue) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndexValue}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndexValue}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndexValue }, false);

  }
}