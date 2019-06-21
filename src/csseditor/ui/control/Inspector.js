import UIElement from "../../../util/UIElement";
import { html } from "../../../util/functions/func";
import property from "./panel/property/index";
import { CLICK } from "../../../util/Event";
import icon from "../icon/icon";

export default class Inspector extends UIElement {
  template() {
    return html`
      <div class="feature-control">
        <div>
          <div class="tab number-tab" data-selected-value="7" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item" data-value="7">
                <div class='icon'>${icon.shape}</div>
                <label>Element</label>
              </div>            
              <div class="tab-item" data-value="1">
                <div class='icon'>${icon.paint}</div>
                <label>Style</label>
              </div>
              <div class="tab-item" data-value="2">
                <div class='icon'>${icon.title}</div>
                <label>Text</label>
              </div>
              <div class="tab-item" data-value="3">
                <div class='icon'>${icon.transform}</div>
                <label>Transform</label>
              </div>            
              <div class="tab-item" data-value="4">
                <div class='icon'>${icon.filter}</div>
                <label>Effect</label>
              </div>                          
              <div class="tab-item" data-value="5">
                <div class='icon'>${icon.scatter}</div>
                <label>Selector</label>
              </div>                          
              <div class="tab-item" data-value="6">
                <div class='icon'>${icon.timer}</div>
                <label>Animation</label>
              </div>                        
            </div>
            <div class="tab-body" ref="$body">
              <div class="tab-content" data-value="7">
                <SizeProperty />              
                <PositionProperty />
              </div>
              <div class="tab-content" data-value="1">
                <BoxModelProperty />
                <BackgroundColorProperty />
                <OpacityProperty />                     
                <BorderProperty />
                <BorderRadiusProperty />
                <BorderImageProperty />
                <OutlineProperty />
              </div>
              <div class="tab-content" data-value="2">
                <ContentProperty />
                <FontColorProperty />         
                <FontProperty />
                <TextProperty />
                <FontSpacingProperty />
              </div>
              <div class='tab-content' data-value="3">
      
                <PerspectiveProperty />
                <PerspectiveOriginProperty />
                <TransformOriginProperty /> 
                <TransformProperty />
              </div>
              <div class='tab-content' data-value="4">

                <BackgroundClipProperty />                         
                <MixBlendModeProperty />
                <BackgroundImageProperty />                 
                <BoxShadowProperty />
                <TextShadowProperty />                   
                <FilterProperty />
                <BackdropFilterProperty />
                <ClipPathProperty />
              </div>
              <div class='tab-content' data-value='5'>
                <SelectorProperty />
              </div>
              <div class='tab-content' data-value="6">
                <TransitionProperty />
                <KeyframeProperty />
                <AnimationProperty />
              </div>            
            </div>
          </div>
        </div>
        <div>
          <div class='tab number-tab extra-tab' data-selected-value='1' ref='$extraTab'>
            <div class="tab-header" ref="$extraHeader">
              <div class="tab-item" data-value="1">
                <div class='icon'>${icon.code}</div>
                <label>Code</label>
              </div>    
              <div class="tab-item" data-value="2">
                <div class='icon'>${icon.code}</div>
                <label>Computed</label>
              </div>                  
              <div class="tab-item" data-value="3">
                <div class='icon'>${icon.build}</div>
                <label>Var</label>
              </div>    
              <div class="tab-item" data-value="4">
                <div class='icon'>${icon.build}</div>
                <label>Root Var</label>
              </div>  
              <div class="tab-item" data-value="5">
                <div class='icon'>${icon.gradient}</div>
                <label>SVG</label>
              </div>                                              
            </div>
            <div class="tab-body" ref="$extraBody">
              <div class="tab-content" data-value="1">
                <CodeViewProperty />
              </div>
              <div class="tab-content" data-value="2">
                <ComputedCodeViewProperty />
              </div>              
              <div class="tab-content" data-value="3">
                <VariableProperty />
              </div>
              <div class="tab-content" data-value="4">
                <RootVariableProperty />
              </div>                 
              <div class='tab-content' data-value='5'>
                <SVGProperty />
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
