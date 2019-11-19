import UIElement from "../../../util/UIElement";

import { CLICK } from "../../../util/Event";
import property from "../property/index";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

const i18n = editor.initI18n('inspector');

export default class Inspector extends UIElement {
  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
          <div class="tab number-tab" data-selected-value="1" ref="$tab">
            <div class="tab-header" ref="$header">
              <div class="tab-item" data-value="1" title='${i18n('tab.title.style')}'>
                <label class='icon'>${icon.brush}</label>
              </div>
              <div class="tab-item" data-value="2" title="${i18n('tab.title.component')}">
                <label class='icon'>${icon.cube}</label>
              </div>              
              <div class="tab-item" data-value="3" title="${i18n('tab.title.transition')}">
                <label>${icon.flash_on}</label>
              </div>
              
              <div class="tab-item" data-value="4" title='${i18n('tab.title.asset')}'>
                <label class='icon'>${icon.view_list}</label>
              </div>                                     
              <div class="tab-item" data-value="5" title='${i18n('tab.title.code')}'>
                <label class='icon'>${icon.code}</label>
              </div>                                     
            </div>
            <div class="tab-body" ref="$body">

              <div class="tab-content" data-value="1">
                <AlignmentProperty />

                <!-- Default Property --> 
                <PositionProperty />
                <SizeProperty /> 
                <BoxModelProperty />
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
                <PerspectiveProperty />
                <PerspectiveOriginProperty />                                
              

                <!--BorderImageProperty /-->                

                <!-- <OutlineProperty /> -->
                <!-- <BackgroundClipProperty /> -->  

                <ExportProperty />
                
                <div class='empty'></div>
              </div>
              <div class="tab-content" data-value="2">

                <!-- ArtBoard --> 
                <ArtBoardSizeProperty />              

                <!-- SVG Item --> 
                <SVGTextProperty />        
                <SVGItemProperty />
                <!--ShapeInsideProperty /-->                
                <PathDataProperty />
                <PolygonDataProperty />

                <ComponentProperty />

                <!-- Image --> 
                <ImageProperty />

                <!-- Text -->
                <!-- <ContentProperty /> -->    
                <FontProperty />
                <TextProperty />
                <TextShadowProperty />
                <TextFillProperty />
                <FontSpacingProperty />
                <TextClipProperty />
                <!-- <RootVariableProperty /> -->
                <!-- <VariableProperty /> -->


                <div class='empty'></div>                
              </div>              
              <div class='tab-content' data-value='3'>
                <MotionProperty />              
                <!-- <RootVariableProperty /> -->
                <!-- <VariableProperty /> -->
                <!-- SelectorProperty /> --> 
                <TransitionProperty />                            
                <AnimationProperty />
                <KeyframeProperty />    
                <SelectorProperty />                              
                <div class='empty'></div>                
              </div>                        
              <div class='tab-content' data-value='4'>
                <ImageAssetsProperty />
                <!--SVGProperty /-->              
                <SVGFilterAssetsProperty />
                <!-- SVGPathAssetsProperty /-->
                <ColorAssetsProperty />
                <GradientAssetsProperty />    
                
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
      e.$delegateTarget.attr("data-value")
    );
  }

  [CLICK("$extraHeader .tab-item(.empty-item)")](e) {
    this.refs.$extraTab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }
}
