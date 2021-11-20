
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { Tabs } from "el/editor/ui/view/Tabs";
import { BIND } from "el/sapa/Event";
import { variable } from 'el/sapa/functions/registElement';

export default class Inspector extends EditorElement {

  components() {
    return {
      Tabs
    }
  }


  afterRender() {
    this.$el.toggle(this.$config.get('editor.design.mode') === 'design');
  }

  [BIND('$el')] () {
    return {
      style: {
        display: this.$config.get('editor.design.mode') === 'design' ? 'block' : 'none'
      }
    }
  }

  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
          <object refClass="Tabs" 
            ref="$tab" 
            ${variable({
              selectedValue: 'style',
              onchange: (value) => {
                this.$config.set("inspector.selectedValue", value);
              }
            })}
          >
            <object refClass="TabPanel" value="style" title="${this.$i18n('inspector.tab.title.style')}">
              <object refClass="AlignmentProperty" />            
              <object refClass="DepthProperty" />
              <object refClass="PathToolProperty" />              

              <!-- Default Property --> 
              <object refClass="PositionProperty" />
              <object refClass="AppearanceProperty" />                                   

              ${this.$injectManager.generate('inspector.tab.style')}                             
              <div class='empty'></div>
            </object>

            <object refClass="TabPanel" value="transition" title="${this.$i18n('inspector.tab.title.transition')}">
              ${this.$injectManager.generate('inspector.tab.transition')}              
              <div class='empty'></div>                
            </object>            

            <object refClass="TabPanel" value="code" title="${this.$i18n('inspector.tab.title.code')}">
              ${this.$injectManager.generate('inspector.tab.code')}              
              <div class='empty'></div>                
            </object>    
            
            ${this.$injectManager.getTargetMenuItems('inspector.tab').map(it => {
              const { value, title, loadElements } = it.class;

              return /*html*/`
                <object refClass="TabPanel" value="${value}" title="${title}" icon=${variable(it.icon)}>
                  ${loadElements.map(element => {
                    return /*html*/`<object refClass="${element}" />`
                  })}
                  ${this.$injectManager.generate('inspector.tab.' + it.value)}              
                  <div class='empty'></div>                
                </object> 
              `   
            })}
          </object>
          </div>
        </div>
      </div>
    `;
  }
}