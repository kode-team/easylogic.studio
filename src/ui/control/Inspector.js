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
                <AlignmentProperty />

                <!-- Default Property --> 
                <PositionProperty />
                <!--SizeProperty / --> 
                <AppearanceProperty />
                
                <!-- SVG Item --> 
                <SVGItemProperty />              

                <!-- Image --> 
                <ImageProperty />

                <!-- Video --> 
                <VideoProperty />

                <!-- Component -->
                <ComponentProperty />                
                
                <!-- Appearance --> 

                <BackgroundImageProperty />                
                <PatternProperty />
                <BorderNewProperty />
                <BorderRadiusProperty />

                <BoxModelProperty />                
                <LayoutProperty />
                <FlexLayoutItemProperty />
                <GridLayoutItemProperty />      

                <!-- effect -->
                <BoxShadowProperty />
                <FilterProperty />
                <BackdropFilterProperty />
                <ClipPathProperty />       

                <!-- transform --> 
                <TransformProperty />                  
                <TransformOriginProperty /> 
                <!-- <PerspectiveProperty /> -->
                <!-- <PerspectiveOriginProperty /> --> 

                <!-- ArtBoard --> 
                <ArtBoardSizeProperty />    
                
                <!-- SVG -->
                <PathDataProperty />                

                <!-- tool -->                
                <ExportProperty />


                <div class='empty'></div>
              </div>     
              <div class="tab-content scrollbar" data-value="2">

                <!-- <ContentProperty /> -->    
                <SVGTextProperty />                        
                <FontProperty />
                <TextProperty />
                <TextShadowProperty />
                <TextFillProperty />
                <FontSpacingProperty />
                <TextClipProperty />  
                <div class='empty'></div>
              </div>                   
              <div class='tab-content scrollbar' data-value='3'>
                <MotionProperty />
                <!-- SelectorProperty /> --> 
                <TransitionProperty />                            
                <AnimationProperty />
                <KeyframeProperty />                          
                <div class='empty'></div>                
              </div>                        
              <div class="tab-content" data-value="5">
                <CodeViewProperty />
                <div class='empty'></div>                           
              </div>       
              
              <div class="tab-content" data-value="6">
                <HistoryProperty />
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
