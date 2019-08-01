import UIElement from "../../../util/UIElement";
import property from "./panel/property/index";
import { CLICK } from "../../../util/Event";

export default class Inspector extends UIElement {
  template() {
    return `
      <div class="feature-control inspector">
        <div>
          <div class="tab number-tab" data-selected-value="1" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item" data-value="1">
                <label>Style</label>
              </div>
              <div class="tab-item" data-value="2">
                <label>Animation</label>
              </div>
              <div class="tab-item" data-value="3">
                <label>Code</label>
              </div>                                     
              
              <div class="tab-item" data-value="4">
                <label>Assets</label>
              </div>                            
            </div>
            <div class="tab-body" ref="$body">
              <div class="tab-content" data-value="1">
                <!-- ArtBoard --> 
                <ArtBoardSizeProperty />              

                <!-- Image --> 
                <ImageProperty />

                <!-- SVG Item --> 
                <SVGItemProperty />

                <!-- Text -->
                <!-- <ContentProperty /> -->    
                <FontProperty />
                <TextProperty />
                <TextShadowProperty />
                <TextFillProperty />
                <FontSpacingProperty />
                <TextClipProperty />

                <div class='split'></div>

                <!-- Default Property --> 
                <PositionProperty />
                <SizeProperty /> 
                <BoxModelProperty />
                <BackgroundColorProperty />
                <BackgroundImageProperty />                
                <BorderProperty />
                <BorderRadiusProperty />

                <!-- effect -->
                <BoxShadowProperty />
                <FilterProperty />
                <ClipPathProperty />       

                <!-- transform --> 
                <PerspectiveOriginProperty />                
                <PerspectiveProperty />
                <TransformOriginProperty /> 
                <TransformProperty />                

                <!--BorderImageProperty /-->                
                <!-- <BackdropFilterProperty /> -->
                <!-- <OutlineProperty /> -->
                <!-- <BackgroundClipProperty /> -->  
                
                <div class='empty'></div>
              </div>
              <div class='tab-content' data-value='2'>
                <!-- <RootVariableProperty /> -->
                <!-- <VariableProperty /> -->
                <SelectorProperty />
                <TransitionProperty />
                <KeyframeProperty />                              
                <AnimationProperty />

                <div class='empty'></div>                
              </div>                   
              <div class="tab-content" data-value="3">
                <CodeViewProperty />
              </div>              
              <div class='tab-content' data-value='4'>
                <!--SVGProperty /-->              
                <SVGFilterAssetsProperty />
                <!-- SVGPathAssetsProperty /-->
                <ColorAssetsProperty />
                <GradientAssetsProperty />    
                
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

  [CLICK("$header .tab-item")](e) {
    this.refs.$tab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }

  [CLICK("$extraHeader .tab-item")](e) {
    this.refs.$extraTab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }
}
