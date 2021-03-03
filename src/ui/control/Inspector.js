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
                <span refClass="AlignmentProperty" />

                <!-- Default Property --> 
                <span refClass="PositionProperty" />
                <!--SizeProperty / --> 
                <span refClass="AppearanceProperty" />
                
                <!-- SVG Item --> 
                <span refClass="SVGItemProperty" />              

                <!-- Image --> 
                <span refClass="ImageProperty" />

                <!-- Video --> 
                <span refClass="VideoProperty" />

                <!-- Component -->
                <span refClass="ComponentProperty" />                
                
                <!-- Appearance --> 

                <span refClass="BackgroundImageProperty" />                
                <span refClass="PatternProperty" />
                <span refClass="BorderNewProperty" />
                <span refClass="BorderRadiusProperty" />

                <span refClass="BoxModelProperty" />                
                <span refClass="LayoutProperty" />
                <span refClass="FlexLayoutItemProperty" />
                <span refClass="GridLayoutItemProperty" />      

                <!-- effect -->
                <span refClass="BoxShadowProperty" />
                <span refClass="FilterProperty" />
                <span refClass="BackdropFilterProperty" />
                <span refClass="ClipPathProperty" />       

                <!-- transform --> 
                <span refClass="TransformOriginProperty" />                 
                <span refClass="TransformProperty" />                  
                <!-- <PerspectiveProperty /> -->
                <!-- <PerspectiveOriginProperty /> --> 

                <!-- ArtBoard --> 
                <span refClass="ArtBoardSizeProperty" />    
                
                <!-- SVG -->
                <!-- <PathDataProperty /> -->

                <!-- tool -->                
                <span refClass="ExportProperty" />


                <div class='empty'></div>
              </div>     
              <div class="tab-content scrollbar" data-value="2">

                <!-- <ContentProperty /> -->    
                <span refClass="SVGTextProperty" />                        
                <span refClass="FontProperty" />
                <span refClass="TextProperty" />
                <span refClass="TextShadowProperty" />
                <span refClass="TextFillProperty" />
                <span refClass="FontSpacingProperty" />
                <span refClass="TextClipProperty" />  
                <div class='empty'></div>
              </div>                   
              <div class='tab-content scrollbar' data-value='3'>
                <span refClass="MotionProperty" />
                <!-- SelectorProperty" /> --> 
                <span refClass="TransitionProperty" />                            
                <span refClass="AnimationProperty" />
                <span refClass="KeyframeProperty" />                          
                <div class='empty'></div>                
              </div>                        
              <div class="tab-content" data-value="5">
                <span refClass="CodeViewProperty" />
                <div class='empty'></div>                           
              </div>       
              
              <div class="tab-content" data-value="6">
                <span refClass="HistoryProperty" />
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
