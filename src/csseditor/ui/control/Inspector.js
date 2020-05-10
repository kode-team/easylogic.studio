import UIElement from "../../../util/UIElement";

import { CLICK } from "../../../util/Event";
import property from "../property/index";
import icon from "../icon/icon";

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
              <div class="tab-item" data-value="3" title="${this.$i18n('inspector.tab.title.transition')}">
                <label>${icon.flash_on}</label>
              </div>
              <div class="tab-item" data-value="5" title='${this.$i18n('inspectortab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>                                     
            </div>
            <div class="tab-body" ref="$body">

              <div class="tab-content selected scrollbar" data-value="1">
                <AlignmentProperty />

                <!-- Default Property --> 
                <PositionProperty />
                <SizeProperty /> 

                <!-- SVG Item --> 
                <SVGTextProperty />        
                <SVGItemProperty />              

                <!-- Image --> 
                <ImageProperty />

                <!-- Component -->
                <ComponentProperty />                
                
                <!-- Appearance --> 
                <BackgroundColorProperty />
                <BackgroundImageProperty />                
                <PatternProperty />
                <BorderNewProperty />
                <BorderRadiusProperty />

                <BoxModelProperty />                
                <LayoutProperty />
                <FlexLayoutItemProperty />
                <GridLayoutItemProperty />      

                <!-- <ContentProperty /> -->    
                <FontProperty />
                <TextProperty />
                <TextShadowProperty />
                <TextFillProperty />
                <FontSpacingProperty />
                <TextClipProperty />  

                <!-- effect -->
                <BoxShadowProperty />
                <FilterProperty />
                <BackdropFilterProperty />
                <ClipPathProperty />       

                <!-- transform --> 
                <TransformProperty />                  
                <TransformOriginProperty /> 
                <PerspectiveProperty />
                <PerspectiveOriginProperty />

                <!-- ArtBoard --> 
                <ArtBoardSizeProperty />    
                
                <!-- SVG -->
                <PathDataProperty />                

                <!-- tool -->                
                <ExportProperty />


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

    var selectedIndex = +e.$dt.attr('data-value')
    if (this.state.selectedIndex === selectedIndex) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndex}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndex}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndex }, false);

  }
}
