import UIElement from "@core/UIElement";

import { CLICK } from "@core/Event";
import property from "../property/index";
import icon from "@icon/icon";

export default class Inspector extends UIElement {

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
              <div class="tab-item" data-value="5" title='${this.$i18n('inspector.tab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>       
              <div class="tab-item" data-value="6" title='${this.$i18n('inspector.tab.title.history')}'>
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

                <!-- Image --> 
                <object refClass="ImageProperty" />

                <!-- Video --> 
                <object refClass="VideoProperty" />

                <!-- Component -->
                <object refClass="ComponentProperty" />                
                
                <!-- Appearance --> 

                <object refClass="BackgroundImageProperty" />                
                <object refClass="PatternProperty" />
                <object refClass="BorderNewProperty" />
                <object refClass="BorderRadiusProperty" />

                <object refClass="BoxModelProperty" />                
                <object refClass="LayoutProperty" />
                <object refClass="FlexLayoutItemProperty" />
                <object refClass="GridLayoutItemProperty" />      

                <!-- effect -->
                <object refClass="BoxShadowProperty" />
                <object refClass="FilterProperty" />
                <object refClass="BackdropFilterProperty" />
                <object refClass="ClipPathProperty" />       

                <!-- transform --> 
                <object refClass="TransformOriginProperty" />                 
                <object refClass="TransformProperty" />                  
                <!-- <PerspectiveProperty /> -->
                <!-- <PerspectiveOriginProperty /> --> 

                <!-- ArtBoard --> 
                <object refClass="ArtBoardSizeProperty" />    
                
                <!-- SVG -->
                <!-- <PathDataProperty /> -->

                <!-- tool -->                
                <object refClass="ExportProperty" />


                <div class='empty'></div>
              </div>     
              <div class="tab-content scrollbar" data-value="2">

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
                <object refClass="MotionProperty" />
                <!-- SelectorProperty" /> --> 
                <object refClass="TransitionProperty" />                            
                <object refClass="AnimationProperty" />
                <object refClass="KeyframeProperty" />                          
                <div class='empty'></div>                
              </div>                        
              <div class="tab-content" data-value="5">
                <object refClass="CodeViewProperty" />
                <div class='empty'></div>                           
              </div>       
              
              <div class="tab-content" data-value="6">
                <object refClass="HistoryProperty" />
                <div class='empty'></div>                           
              </div>                     
            </div>
          </div>
        </div>
      </div>
    `;
  }

  components() {
    return property;
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
