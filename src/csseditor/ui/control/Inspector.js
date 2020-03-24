import UIElement from "../../../util/UIElement";

import { CLICK } from "../../../util/Event";
import property from "../property/index";
import icon from "../icon/icon";

export default class Inspector extends UIElement {
  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
          <div class="tab number-tab" data-selected-value="1" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item" data-value="1" title='${this.$i18n('inspectortab.title.style')}'>
                <label class='icon'>${icon.palette}</label>
              </div>
              <div class="tab-item" data-value="2" title="${this.$i18n('inspectortab.title.component')}">
                <label class='icon'>${icon.cube}</label>
              </div>              
              <div class="tab-item" data-value="4" title='${this.$i18n('inspectortab.title.text')}'>
                <label class='icon'>${icon.title}</label>
              </div>              
              <div class="tab-item" data-value="3" title="${this.$i18n('inspectortab.title.transition')}">
                <label>${icon.flash_on}</label>
              </div>
              <div class="tab-item" data-value="5" title='${this.$i18n('inspectortab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>                                     
            </div>
            <div class="tab-body" ref="$body">

              <div class="tab-content scrollbar" data-value="1">
                <AlignmentProperty />

                <!-- Default Property --> 
                <PositionProperty />
                <SizeProperty /> 
                <LayoutProperty />
                <FlexLayoutItemProperty />
                <GridLayoutItemProperty />
                <BoxModelProperty />

                <!-- Appearance --> 
                <BackgroundColorProperty />
                <BackgroundImageProperty />                
                <BorderNewProperty />
                <BorderRadiusProperty />

                <!-- effect -->
                <BoxShadowProperty />
                <FilterProperty />
                <BackdropFilterProperty />
                <ClipPathProperty />       

                <!-- transform --> 
                <TransformProperty />                  
                <TransformOriginProperty /> 
                
                <div class='empty'></div>
              </div>
              <div class="tab-content scrollbar" data-value="2">

                <PerspectiveProperty />
                <PerspectiveOriginProperty />
                <ExportProperty />
                
                <!-- ArtBoard --> 
                <ArtBoardSizeProperty />              

                <!-- SVG Item --> 
                <SVGTextProperty />        
                <SVGItemProperty />              
                <PathDataProperty />

                <!-- Image --> 
                <ImageProperty />

                <!-- Component -->
                <ComponentProperty />                

                <div class='empty'></div>                
              </div>              
              <div class='tab-content scrollbar' data-value='3'>
                <MotionProperty />
                <!-- SelectorProperty /> --> 
                <TransitionProperty />                            
                <AnimationProperty />
                <KeyframeProperty />    
                <SelectorProperty />                              
                <div class='empty'></div>                
              </div>                        
              <div class='tab-content' data-value='4'>
                <!-- Text -->
                <!-- <ContentProperty /> -->    
                <FontProperty />
                <TextProperty />
                <TextShadowProperty />
                <TextFillProperty />
                <FontSpacingProperty />
                <TextClipProperty />  
                
                <div class='empty'></div>                
              </div>
              <div class="tab-content" data-value="5">
                <CodeViewProperty />
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
    this.refs.$tab.attr(
      "data-selected-value",
      e.$dt.attr("data-value")
    );
  }

  [CLICK("$extraHeader .tab-item(.empty-item)")](e) {
    this.refs.$extraTab.attr(
      "data-selected-value",
      e.$dt.attr("data-value")
    );
  }
}
