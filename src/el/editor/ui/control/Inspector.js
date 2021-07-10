

import { CLICK } from "el/base/Event";
import "../property/index";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

export default class Inspector extends EditorElement {

  initState() {
    return {
      selectedIndex: 1
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
              <div class="tab-item" data-value="2" title='${this.$i18n('inspector.tab.title.text')}'>
                <label class='icon'>${icon.title}</label>
              </div>              
              <div class="tab-item" data-value="3" title="${this.$i18n('inspector.tab.title.transition')}">
                <label>${icon.flash_on}</label>
              </div>
              <div class="tab-item" data-value="4" title='${this.$i18n('inspector.tab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>       
              <div class="tab-item" data-value="5" title='${this.$i18n('inspector.tab.title.history')}'>
                <label class='icon'>${icon.expand}</label>
              </div>                                                   
            </div>
            <div class="tab-body" ref="$body">

              <div class="tab-content selected scrollbar" data-value="1">
                <object refClass="AlignmentProperty" />

                <!-- Default Property --> 
                <object refClass="PositionProperty" />
                <!--SizeProperty / --> 
                <object refClass="AppearanceProperty" />                
                
                <!-- SVG Item --> 
                <object refClass="SVGItemProperty" />              

                <!-- Appearance --> 
                <object refClass="BorderRadiusProperty" />

                <object refClass="BoxModelProperty" />                

                <!-- effect -->
                <object refClass="FilterProperty" />
                <object refClass="BackdropFilterProperty" />
                <object refClass="ClipPathProperty" />       
                                
                
                ${this.$menuManager.generate('inspector.tab.style')}

                <!-- Component -->
                <object refClass="ComponentProperty" />                
                

                <!-- SVG -->
                <!-- <PathDataProperty /> -->

                <!-- transform --> 
                <object refClass="TransformOriginProperty" />
                <object refClass="TransformProperty" />
                <!-- <PerspectiveProperty /> -->
                <!-- <PerspectiveOriginProperty /> -->                 

                <!-- tool -->                
                <object refClass="ExportProperty" />

                <div class='empty'></div>
              </div>     
              <div class="tab-content scrollbar" data-value="2">
                ${this.$menuManager.generate('inspector.tab.text')}
                <!-- <ContentProperty /> -->    
                <object refClass="SVGTextProperty" />                        
                <object refClass="FontProperty" />
                <object refClass="TextProperty" />
                <object refClass="TextShadowProperty" />
                <object refClass="TextFillProperty" />
                <object refClass="FontSpacingProperty" />
                <object refClass="TextClipProperty" />  
                <div class='empty'></div>
              </div>                   
              <div class='tab-content scrollbar' data-value='3'>
                ${this.$menuManager.generate('inspector.tab.transition')}              
                <!--object refClass="MotionProperty" /-->
                <object refClass="TransitionProperty" />                            
                <object refClass="AnimationProperty" />           
                <object refClass="SelectorProperty" />
                <div class='empty'></div>                
              </div>                        
              <div class="tab-content" data-value="4">
                ${this.$menuManager.generate('inspector.tab.code')}                            
                <object refClass="CodeViewProperty" />
                <div class='empty'></div>                           
              </div>       
              
              <div class="tab-content" data-value="5">
                ${this.$menuManager.generate('inspector.tab.history')}                            
                <object refClass="HistoryProperty" />
                <div class='empty'></div>                           
              </div>                     
            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.empty-item)")](e) {

    var selectedIndex = +e.$dt.attr('data-value')
    if (this.state.selectedIndex === selectedIndex) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndex}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndex}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndex }, false);

  }
}

registElement({ Inspector })