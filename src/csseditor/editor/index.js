// 객체 로드용 절대로 지우지 마세요. 
// Please do not remove this statement absolutely.
import items from "../../editor/items";
// 객체 로드용 절대로 지우지 마세요. 


import CanvasView from "../ui/view/CanvasView";
import ToolMenu from "../ui/view/ToolMenu";

import UIElement, { EVENT } from "../../util/UIElement";
import { DRAGOVER, DROP, PREVENT, TRANSITIONEND, KEYDOWN, KEYUP, IF, POINTERSTART, MOVE, END, BIND } from "../../util/Event";
import Inspector from "../ui/control/Inspector";


import popup from "../ui/popup";  
import StyleView from "../ui/view/StyleView";
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


const formElements = ['INPUT','SELECT','TEXTAREA']

export default class CSSEditor extends UIElement {
  
  initialize () {
    super.initialize()


    var $body = Dom.create(document.body);
    
    $body.attr('data-theme', this.$editor.theme);
    $body.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }

  initState() {
    return {
      leftSize: 280,
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
          </div>        
          <div class="layout-body" ref='$bodyPanel'>
            <CanvasView />        
          </div>                           
          <div class='layout-left' ref='$leftPanel'>
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
          <div class='splitter' ref='$splitter'></div>                 
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
        <StyleView />    
        <ExportWindow />
        <!-- LoginWindow / -->
        <!-- SignWindow / -->
        <ImageFileView />
      </div>
    `;
  }

  [BIND('$headerPanel')] () {
    return {
      style: {
        left: `${this.state.leftSize}px`
      }
    }
  }

  [BIND('$splitter')] () {
    return {
      style: {
        left: `${this.state.leftSize}px`
      }
    }
  }

  [BIND('$leftPanel')] () {
    return {
      style: {
        width: `${this.state.leftSize}px`
      }
    }
  }  

  [BIND('$bodyPanel')] () {
    return {
      style: {
        left: `${this.state.leftSize}px`
      }
    }
  }    

  components() {
    return {
      ...windowList,
      ...popup,
      ObjectList,
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

  [POINTERSTART('$splitter') + MOVE('moveSplitter') + END('moveEndSplitter')] () {

    this.minSize = this.$theme('left_size');
    this.maxSize = this.$theme('left_max_size');
    this.leftSize = Length.parse(this.refs.$splitter.css('left')).value;
  }

  moveSplitter (dx) {
    this.setState({
      leftSize: Math.max(Math.min(this.leftSize + dx, this.maxSize), this.minSize)
    }, false)

    this.bindData('$splitter');
    this.bindData('$headerPanel');    
    this.bindData('$leftPanel');
    this.bindData('$bodyPanel');    
    
    this.emit('resizeEditor');
  }

  [EVENT('changeTheme')] () {
    Dom.create(document.body).attr('data-theme', this.$editor.theme);
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

  [EVENT('refreshAllSelectArtBoard')] (...args) {      
    this.emit('refreshLayerTreeView')    
    this.emit('refreshAllCanvas', ...args);
    this.emit('refreshStyleView');
    this.emit('refreshAllElementBoundSize')   
  }  

  [DRAGOVER('$middle') + PREVENT] (e) {}

  [DROP('$middle') + PREVENT] (e) {

    var items = Resource.getAllDropItems(e);

    this.emit('fileDropItems', items);

  }

  isNotFormElement(e) {
    var tagName = e.target.tagName;

    return formElements.includes(tagName) === false && Dom.create(e.target).attr('contenteditable') !== 'true';
  }  

  [KEYDOWN('document') + IF('isNotFormElement')] (e) {
    this.emit('keymap.keydown', e);
  }

  [KEYUP('document') + IF('isNotFormElement')] (e) {
    this.emit('keymap.keyup', e);
  }
}
