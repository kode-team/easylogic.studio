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
          <div class="tab number-tab" data-selected-value="4" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item" data-value="1">
                <div class='icon'>${icon.paint}</div>
                <lable>Style</label>
              </div>
              <div class="tab-item" data-value="2">
                <div class='icon'>${icon.title}</div>
                <lable>Text & Font</label>
              </div>
              <div class="tab-item" data-value="3">
                <div class='icon'>${icon.filter}</div>
                <lable>Effect</label>
              </div>            

              <div class="tab-item" data-value="4">
                <div class='icon'>${icon.timer}</div>
                <lable>Animation</label>
              </div>                        
            </div>
            <div class="tab-body" ref="$body">
              <div class="tab-content" data-value="1">
                <SizeProperty />
                <BoxModelProperty />
                <BackgroundColorProperty />
                <BorderProperty />
                <BorderRadiusProperty />
                <BorderImageProperty />

              </div>
              <div class="tab-content" data-value="2">
                <ContentProperty />
                <FontColorProperty />         
                <FontProperty />
                <TextProperty />
                <FontSpacingProperty />
              </div>
              <div class='tab-content' data-value="3">
                <BackgroundImageProperty />                 
                <BoxShadowProperty />
                <TextShadowProperty />                   
                <TransformProperty />
                <FilterProperty />
                <BackdropFilterProperty />
                <ClipPathProperty />              
                <OutlineProperty />

              </div>
              <div class='tab-content' data-value="4">
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
                <lable>Code</label>
              </div>    
              <div class="tab-item" data-value="2">
                <div class='icon'>${icon.build}</div>
                <lable>Var</label>
              </div>    
              <div class="tab-item" data-value="3">
                <div class='icon'>${icon.build}</div>
                <lable>Root Var</label>
              </div>                                
            </div>
            <div class="tab-body" ref="$extraBody">
              <div class="tab-content" data-value="1">
                <CodeViewProperty />
              </div>
              <div class="tab-content" data-value="2">
                <VariableProperty />
              </div>
              <div class="tab-content" data-value="3">
                <RootVariableProperty />
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
