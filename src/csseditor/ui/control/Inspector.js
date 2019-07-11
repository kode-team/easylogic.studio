import UIElement from "../../../util/UIElement";
import property from "./panel/property/index";
import { CLICK } from "../../../util/Event";
import icon from "../icon/icon";

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
              <div class="tab-item" data-value="3">
                <label>Text</label>
              </div>
              <div class="tab-item" data-value="4">
                <label>Transform</label>
              </div>    
              <div class="tab-item" data-value="6">
                <label>Animation</label>
              </div>
              <div class="tab-item" data-value="8">
                <label>Object</label>
              </div>       
            </div>
            <div class="tab-body" ref="$body">
              <div class="tab-content" data-value="1">
                <ImageProperty />
                <PositionProperty />
                <SizeProperty />          
                <BoxModelProperty />
                <BackgroundColorProperty />
                <OpacityProperty />          
                <RotateProperty />  
                <BorderProperty />
                <BorderRadiusProperty />
                <!--BorderImageProperty /-->
                <OutlineProperty />
                <ArtBoardSizeProperty />

                <BackgroundClipProperty />                       
                <MixBlendModeProperty />
                <BackgroundImageProperty />
                <BoxShadowProperty />
                <FilterProperty />
                <BackdropFilterProperty />
                <ClipPathProperty />          
              </div>
              <div class="tab-content" data-value="3">
                <!-- <ContentProperty /> -->
                <!-- <FontColorProperty /> -->        
                <FontProperty />
                <TextProperty />
                <TextShadowProperty />
                <TextFillProperty />
                <FontSpacingProperty />
              </div>
              <div class='tab-content' data-value="4">
                <PerspectiveProperty />
                <PerspectiveOriginProperty />
                <TransformOriginProperty /> 
                <TransformProperty />
              </div>
              <div class='tab-content' data-value='6'>
                <VariableProperty />              
                <SelectorProperty />
                <TransitionProperty />
                <AnimationProperty />
              </div>         
              <div class='tab-content' data-value="8">
                <ProjectInformationProperty />
                <ArtBoardInformationProperty />
              </div>                          
            </div>
          </div>
        </div>
        <div>
          <div class='tab number-tab extra-tab' data-selected-value='1' ref='$extraTab'>
            <div class="tab-header" ref="$extraHeader">
              <div class="tab-item" data-value="1">
                <label>Code</label>
              </div>    
              <div class="tab-item" data-value="2">
                <label>GLOBAL</label>
              </div>                                    
              
              <div class="tab-item" data-value="3">
                <label>Color</label>
              </div>                            
              <div class="tab-item" data-value="4">
                <label>Gradient</label>
              </div>                                                                
            </div>
            <div class="tab-body" ref="$extraBody">
              <div class="tab-content" data-value="1">
                <CodeViewProperty />
              </div>              
              <div class="tab-content" data-value="2">
                <KeyframeProperty />              
                <RootVariableProperty />
                <SVGProperty />
              </div>
              <div class='tab-content' data-value='3'>
                <ColorAssetsProperty />
              </div>
              <div class='tab-content' data-value='4'>
                <GradientAssetsProperty />
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
