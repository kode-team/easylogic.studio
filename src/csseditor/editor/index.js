
import CanvasView from "../ui/view/CanvasView";
import ToolMenu from "../ui/view/ToolMenu";

import UIElement, { EVENT } from "../../util/UIElement";
import { DRAGOVER, DROP, PREVENT, TRANSITIONEND } from "../../util/Event";
import Inspector from "../ui/control/Inspector";


import popup from "../ui/popup";  
import StyleView from "../ui/view/StyleView";
import ObjectList from "../ui/control/ObjectList";
import LogoView from "../ui/view/LogoView";
import ExternalToolMenu from "../ui/view/ExternalToolMenu";
import icon from "../ui/icon/icon";
import CommandView from "../ui/view/CommandView";
import { editor } from "../../editor/editor";
import Dom from "../../util/Dom";
import Resource from "../../editor/util/Resource";
import windowList from "../ui/window-list";
import ImageFileView from "../ui/view/ImageFileView";
import TimelineProperty from "../ui/control/TimelineProperty";
import StatusBar from "../ui/view/StatusBar";
import items from "../../editor/items";
import PreviewToolMenu from "../ui/view/PreviewToolMenu";

export default class CSSEditor extends UIElement {
  
  initialize () {
    super.initialize()


    var $body = Dom.create(document.body);
    
    $body.attr('data-theme', editor.theme);
    $body.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }

  
  [EVENT('changed.locale')] () {
    this.rerender()
  }

  template() {
    return this.templateForEditor();
  }

  templateForEditor() {
    return /*html*/`
      <div class="layout-main">
        <div class="layout-header">
            <LogoView />
            <div class='menu-bar'>
              <PreviewToolMenu />
              <ToolMenu />
              <ExternalToolMenu />
            </div>
        </div>
        <div class="layout-middle" ref='$middle'>
          <div class="layout-body">
            <CanvasView />        
          </div>                           
          <div class='layout-left'>
            <ObjectList />
          </div>
          <div class="layout-right">
            <Inspector />
          </div>

          <div class='layout-tools'>
            <button ref='$toggleRight'>${icon.dahaze}</button>
          </div>
          <div class='layout-footer'>
            <TimelineProperty />
          </div>          
        </div>
        
        <div class='status-bar'>
          <StatusBar />
        </div>

        <FillPopup />
        <ColorPickerPopup  />
        <BoxShadowPropertyPopup />
        <BackgroundImagePositionPopup />
        <TextShadowPropertyPopup />
        <AnimationPropertyPopup />
        <TransitionPropertyPopup />
        <KeyframePopup />
        <ClipPathPopup />
        <SVGPropertyPopup />
        <SelectorPopup />
        <ImageSelectPopup />
        <GradientPickerPopup />
        <FillPickerPopup />
        <SVGFilterPopup />
        <StyleView />    
        <CommandView />    
        <ExportWindow />
        <!-- LoginWindow / -->
        <!-- SignWindow / -->
        <ImageFileView />
      </div>
    `;
  }

  components() {
    return {
      ...windowList,
      ...popup,
      ObjectList,
      CommandView,
      Inspector,
      ToolMenu,
      CanvasView,
      StyleView,
      LogoView,
      ExternalToolMenu,
      ImageFileView,
      StatusBar,
      TimelineProperty,
      PreviewToolMenu,
    };
  }

  [EVENT('changeTheme')] () {
    Dom.create(document.body).attr('data-theme', editor.theme);
  }


  [EVENT('toggleFooter')] (isShow) {
    this.$el.toggleClass('show-footer', isShow);
  }

  [TRANSITIONEND('$el .layout-footer')] (e) {
    this.emit('toggleFooterEnd');
  }

  [EVENT('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [EVENT('refreshAllSelectProject')] () {      
    this.emit('refreshArtBoardList')    
    this.trigger('refreshAllSelectArtBoard')
  }

  [EVENT('refreshAllSelectArtBoard')] () {      
    this.emit('refreshLayerTreeView')    
    this.emit('refreshAllCanvas');
    this.emit('refreshStyleView');
    this.emit('refreshAllElementBoundSize')   
  }  

  [EVENT('refreshElement')] (current) {
    this.emit('refreshCanvasForPartial', current)
    this.emit('refreshStyleView', current)

    this.emit('refreshElementBoundSize', editor.selection.getRootItem(current))
  }

  [DRAGOVER('$middle') + PREVENT] (e) {}

  [DROP('$middle') + PREVENT] (e) {

    var items = Resource.getAllDropItems(e);

    this.emit('drop.items', items);

  }
}
