// 객체 로드용 절대로 지우지 마세요. 
// Please do not remove this statement absolutely.
import items from "../../editor/items";
// 객체 로드용 절대로 지우지 마세요. 


import CanvasView from "../ui/view/CanvasView";
import ToolMenu from "../ui/view/ToolMenu";

import UIElement, { EVENT } from "../../util/UIElement";
import { DRAGOVER, DROP, PREVENT, TRANSITIONEND, KEYDOWN, KEYUP, IF, POINTERSTART, MOVE, END, BIND, CUSTOM, CLICK } from "../../util/Event";
import Inspector from "../ui/control/Inspector";


import popup from "../ui/popup";  
import ObjectList from "../ui/control/ObjectList";
import LogoView from "../ui/view/LogoView";
import ExternalToolMenu from "../ui/view/ExternalToolMenu";
import icon from "../ui/icon/icon";
import Dom from "../../util/Dom";
import Resource from "../../editor/util/Resource";
import windowList from "../ui/window-list";
import ImageFileView from "../ui/view/ImageFileView";
import TimelineProperty from "../ui/control/TimelineProperty";
import StatusBar from "../ui/view/StatusBar";

import PreviewToolMenu from "../ui/view/PreviewToolMenu";
import { Length } from "../../editor/unit/Length";
import PageSubEditor from "../ui/view-items/PageSubEditor";
import NotificationView from "../ui/view/NotificationView";


const formElements = ['TEXTAREA', 'INPUT', 'SELECT']

export default class CSSEditor extends UIElement {
  
  initialize () {
    super.initialize()


    var $body = Dom.body();
    
    $body.attr('data-theme', this.$editor.theme);
    $body.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }

  initState() {
    return {
      hideLeftPanel: false,
      hideRightPanel: false,
      leftSize: 340,
      rightSize: 260,
    }
  }

  
  [EVENT('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="layout-main">
        <div class='layout-top' ref='$top'>

        </div>
        <div class="layout-middle" ref='$middle'>
          <div class="layout-header" ref='$headerPanel'>
              <ToolMenu />    
              <PageSubEditor />      
          </div>        
          <div class="layout-body" ref='$bodyPanel'>
            <CanvasView />        
          </div>                           
          <div class='layout-left' ref='$leftPanel'>
            <ObjectList />
          </div>
          <div class="layout-right" ref='$rightPanel'>
            <Inspector />
          </div>

          <div class='layout-footer'>
            <TimelineProperty />
          </div>   
          <div class='splitter' ref='$splitter'></div>
          <button type="button" class='toggleLeft' ref='$toggleLeftButton'></button>
          <button type="button" class='toggleRight' ref='$toggleRightButton'></button>
        </div>
        
        <StatusBar />

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
        <PatternInfoPopup />
        <SVGFilterPopup />
        <ExportWindow />
        <ShortcutWindow />
        <!-- LoginWindow / -->
        <!-- SignWindow / -->
        <ImageFileView />
        <NotificationView />
      </div>
    `;
  }

  [BIND('$headerPanel')] () {

    let left = `${this.state.leftSize}px`
    let right = `${this.state.rightSize}px`

    if (this.state.hideLeftPanel) {
      left = `0px`
    }

    if (this.state.hideRightPanel) {
      right = `0px`
    }

    return {
      style: { left, right }
    }
  }

  [BIND('$splitter')] () {
    let left = `${this.state.leftSize}px`    
    if (this.state.hideLeftPanel) {
      left = `0px`
    }

    return {
      style: { left }
    }
  }

  [BIND('$leftPanel')] () {
    let left = `0px`    
    let width = Length.px(this.state.leftSize);
    if (this.state.hideLeftPanel) {
      left = `-${this.state.leftSize}px`    
    }

    return {
      style: { left, width }
    }
  }  

  [BIND('$toggleLeftButton')] () {
    let left = '0px';
    let iconString = icon.arrowRight
    if (this.state.hideLeftPanel === false) {
      left = `${this.state.leftSize}px`
      iconString = icon.arrowLeft
    }    
    return {
      style : { left },
      html: iconString
    }
  }

  [BIND('$toggleRightButton')] () {
    let right = '0px';
    let iconString = icon.arrowLeft    
    if (this.state.hideRightPanel === false) {
      right = `${this.state.rightSize}px`
      iconString = icon.arrowRight
    }    
    return {
      style : { right },
      html: iconString
    }
  }  

  [BIND('$rightPanel')] () {
    let right = `0px`    
    if (this.state.hideRightPanel) {
      right = `-${this.state.rightSize}px`    
    }

    return {
      style: { right }
    }
  }    

  [BIND('$bodyPanel')] () {
   
    let left = `${this.state.leftSize}px`
    let right = `${this.state.rightSize}px`

    if (this.state.hideLeftPanel) {
      left = `0px`
    }

    if (this.state.hideRightPanel) {
      right = `0px`
    }
 
    return {
      style: { left, right }
    }
  }    

  components() {
    return {
      ...windowList,
      ...popup,
      ObjectList,
      Inspector,
      ToolMenu,
      PageSubEditor,
      CanvasView,
      LogoView,
      ExternalToolMenu,
      ImageFileView,
      StatusBar,
      TimelineProperty,
      PreviewToolMenu,
      NotificationView,
    };
  }

  [POINTERSTART('$splitter') + MOVE('moveSplitter') + END('moveEndSplitter')] () {

    this.minSize = this.$theme('left_size');
    this.maxSize = this.$theme('left_max_size');
    this.leftSize = Length.parse(this.refs.$splitter.css('left')).value;
  }

  moveSplitter (dx) {
    this.setState({
      leftSize: Math.max(Math.min(this.leftSize + dx, this.maxSize), this.minSize)
    })

  }

  refresh () {

    this.bindData('$splitter');
    this.bindData('$headerPanel');    
    this.bindData('$leftPanel');
    this.bindData('$rightPanel');
    this.bindData('$toggleRightButton');
    this.bindData('$toggleLeftButton');            
    this.bindData('$bodyPanel');    
    
    this.emit('resizeEditor');
  }

  [CLICK('$toggleRightButton')] () {
    this.toggleState('hideRightPanel');
  }

  [CLICK('$toggleLeftButton')] () {
    this.toggleState('hideLeftPanel');
  }  

  [EVENT('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
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
    this.emit('refreshArtboard')
  }

  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {
    this.emit('fileDropItems', Resource.getAllDropItems(e));
  }

  isNotFormElement(e) {
    var tagName = e.target.tagName;

    if (formElements.includes(tagName)) return false; 
    else if (Dom.create(e.target).attr('contenteditable') === 'true') return false; 

    return true;
  }  

  [KEYDOWN('document') + IF('isNotFormElement')] (e) {
    this.emit('keymap.keydown', e);
  }

  [KEYUP('document') + IF('isNotFormElement')] (e) {
    this.emit('keymap.keyup', e);
  }
}
