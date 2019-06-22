import CanvasView from "../ui/view/CanvasView";
import ToolMenu from "../ui/view/ToolMenu";

import UIElement from "../../util/UIElement";
import { RESIZE, DEBOUNCE } from "../../util/Event";
import { RESIZE_WINDOW } from "../types/event";
import Inspector from "../ui/control/Inspector";

import popup from "../ui/control/popup";
import StyleView from "../ui/view/StyleView";
import ObjectList from "../ui/control/ObjectList";
import LogoView from "../ui/view/LogoView";
import ExternalToolMenu from "../ui/view/ExternalToolMenu";

export default class CSSEditor extends UIElement {
  afterRender() {
    this.emit("setTargetElement", this.parent.opt.targetElement);
  }
  template() {
    if (this.props.embed) {
      return this.templateForEmbed();
    } else {
      return this.templateForEditor();
    }
  }

  templateForEmbed() {
    return `
      <div class="embed-editor layout-main" ref="$layoutMain">
        <CanvasView embed="true" />
        <Inspector />
        <FillPopup />
        <BackgroundPropertyPopup />
        <BoxShadowPropertyPopup />   
        <TextShadowPropertyPopup />        
        <StyleView />     
      </div>
    `;
  }

  templateForEditor() {
    return `
      <div class="layout-main" ref="$layoutMain">
        <div class="layout-header">
            <LogoView />
            <ToolMenu />
            <ExternalToolMenu />
        </div>
        <div class="layout-middle">
          <div class='layout-left'>
            <ObjectList />
          </div>
          <div class="layout-right">
            <Inspector />
          </div>
          <div class="layout-body">
            <CanvasView />
            <DrawingView />            
          </div>                              
        </div>
        <FillPopup />
        <ColorPickerPopup  />
        <BoxShadowPropertyPopup />
        <TextShadowPropertyPopup />
        <AnimationPropertyPopup />
        <TransitionPropertyPopup />
        <KeyframePopup />
        <ClipPathPopup />
        <SVGPropertyPopup />
        <SelectorPopup />
        <StyleView />        
      </div>
    `;
  }

  components() {
    return {
      ...popup,
      ObjectList,
      Inspector,
      ToolMenu,
      CanvasView,
      StyleView,
      LogoView,
      ExternalToolMenu
    };
  }

  [RESIZE("window") + DEBOUNCE(100)](e) {
    this.emit(RESIZE_WINDOW);
  }
}
