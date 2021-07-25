

import { CLICK } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class Inspector extends EditorElement {

  initState() {
    return {
      selectedIndexValue: 1
    }
  }

  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
          <div class="tab number-tab" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item selected" data-value="1" title='${this.$i18n('inspector.tab.title.style')}'>
                <label class='icon'>${icon.palette}</label>
              </div>
              <!--div class="tab-item" data-value="2" title='${this.$i18n('inspector.tab.title.text')}'>
                <label class='icon'>${icon.title}</label>
              </div-->              
              <div class="tab-item" data-value="3" title="${this.$i18n('inspector.tab.title.transition')}">
                <label>${icon.flash_on}</label>
              </div>
              <div class="tab-item" data-value="4" title='${this.$i18n('inspector.tab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>       
              <!--div class="tab-item" data-value="5" title='${this.$i18n('inspector.tab.title.history')}'>
                <label class='icon'>${icon.expand}</label>
              </div-->               

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

              <div class="tab-content selected scrollbar" data-value="1">
                <object refClass="AlignmentProperty" />

                <!-- Default Property --> 
                <object refClass="PositionProperty" />
                <object refClass="AppearanceProperty" />                                   

                ${this.$menuManager.generate('inspector.tab.style')}                             
                <div class='empty'></div>
              </div>     
              <!--div class="tab-content scrollbar" data-value="2">
                <ContentProperty />
                <div class='empty'></div>
              </div-->                   
              <div class='tab-content scrollbar' data-value='3'>
                ${this.$menuManager.generate('inspector.tab.transition')}              
                <div class='empty'></div>                
              </div>                        
              <div class="tab-content" data-value="4">
                ${this.$menuManager.generate('inspector.tab.code')}                            
                <div class='empty'></div>                           
              </div>       
              
              <!--div class="tab-content" data-value="5">
                ${this.$menuManager.generate('inspector.tab.history')}                            
                <div class='empty'></div>                           
              </div--> 
              
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