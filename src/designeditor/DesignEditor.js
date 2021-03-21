
import Dom from "@core/Dom";
import UIElement, { EVENT } from "@core/UIElement";
import { DRAGOVER, DROP, PREVENT, TRANSITIONEND, KEYDOWN, KEYUP, IF, POINTERSTART, MOVE, BIND, CLICK, THROTTLE } from "@core/Event";

import icon from "@icon/icon";
import { Length } from "@unit/Length";

import "@ui/popup";  
import "@ui/window-list";
import "@ui/control";

import "@ui/view/CanvasView";
import "@ui/view/ToolMenu";
import "@ui/view/LogoView";
import "@ui/view/ExternalToolMenu";
import "@ui/view/StatusBar";
import "@ui/view/PreviewToolMenu";
import "@ui/view/NotificationView";
import "@ui/view-items/PageSubEditor";

import "@ui/view/HorizontalRuler";
import "@ui/view/VerticalRuler";
import { registElement } from "@core/registerElement";
 

const formElements = ['TEXTAREA', 'INPUT', 'SELECT']

export default class DesignEditor extends UIElement {
  
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
      rightSize: 300,
      bottomSize: 30,
      lastBottomSize: 150
    }
  }

  
  [EVENT('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="layout-main">
        <div class='layout-top' ref='$top'>
          <div class='logo-item'>
            <label class='logo' title='EasyLogic Studio'></label>
          </div>      
          <object refClass="ToolMenu" />
          <object refClass='PageSubEditor' />    
        </div>
        <div class="layout-middle" ref='$middle'>
          <div class="layout-header" ref='$headerPanel'>
  
          </div>        
          <div class="layout-body" ref='$bodyPanel'>
            <object refClass='HorizontalRuler' />
            <object refClass='VerticalRuler' />
            <object refClass='CanvasView' />        
          </div>                           
          <div class='layout-left' ref='$leftPanel'>
            <object refClass='ObjectList' />
          </div>
          <div class="layout-right" ref='$rightPanel'>
            <object refClass='Inspector' />
          </div>

          <div class='layout-footer' ref='$footerPanel'>
            <div class='footer-splitter' ref='$footerSplitter' title="${this.$i18n('timeline.property.resize')}"></div>
            <object refClass='TimelineProperty' />
          </div>   
          <div class='splitter' ref='$splitter'></div>
          <button type="button" class='toggleLeft' ref='$toggleLeftButton'></button>
          <button type="button" class='toggleRight' ref='$toggleRightButton'></button>
        </div>
        
        <object refClass='StatusBar' />
        <object refClass='Test' />
        <object refClass='ColorPickerPopup' />
        <object refClass='BoxShadowPropertyPopup' />
        <object refClass='BackgroundImagePositionPopup' />
        <object refClass='TextShadowPropertyPopup' />
        <object refClass='AnimationPropertyPopup' />
        <object refClass='TransitionPropertyPopup' />
        <object refClass='KeyframePopup' />
        <object refClass='ClipPathPopup' />
        <object refClass='SVGPropertyPopup' />
        <object refClass='SelectorPopup' />
        <object refClass='ImageSelectPopup' />
        <object refClass='GradientPickerPopup' />
        <object refClass='FillPickerPopup' />
        <object refClass='PatternInfoPopup' />
        <object refClass='SVGFilterPopup' />
        <object refClass='ExportWindow' />
        <object refClass='ShortcutWindow' />
        <!-- LoginWindow / -->
        <!-- SignWindow / -->
        <!-- ImageFileView / -->
        <object refClass='NotificationView' />
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
    let bottom = Length.px(this.state.bottomSize);
    if (this.state.hideLeftPanel) {
      left = `-${this.state.leftSize}px`    
    }

    return {
      style: { left, width, bottom }
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
    let bottom = Length.px(this.state.bottomSize);    
    if (this.state.hideRightPanel) {
      right = `-${this.state.rightSize}px`    
    }

    return {
      style: { right, bottom }
    }
  }    

  [BIND('$bodyPanel')] () {
   
    let left = `${this.state.leftSize}px`
    let right = `${this.state.rightSize}px`
    let bottom = `${this.state.bottomSize}px`

    if (this.state.hideLeftPanel) {
      left = `0px`
    }

    if (this.state.hideRightPanel) {
      right = `0px`
    }


 
    return {
      style: { left, right, bottom }
    }
  }  
  

  [BIND('$footerPanel')] () {
   
    let height = Length.px(this.state.bottomSize);
 
    return {
      style: { height }
    }
  }    

  [POINTERSTART('$splitter') + MOVE('moveSplitter')] () {

    this.minSize = this.$theme('left_size');
    this.maxSize = this.$theme('left_max_size');
    this.leftSize = Length.parse(this.refs.$splitter.css('left')).value;
  }

  moveSplitter (dx) {
    this.setState({
      leftSize: Math.max(Math.min(this.leftSize + dx, this.maxSize), this.minSize)
    })

  }

  [POINTERSTART('$footerSplitter') + MOVE('moveFooterSplitter')] () {

    this.minFooterSize = this.$theme('bottom_size');
    this.maxFooterSize = this.$theme('bottom_max_size');
    this.bottomSize = Length.parse(this.refs.$footerPanel.css('height')).value;
  }

  moveFooterSplitter (_, dy) {
    const bottomSize = Math.max(Math.min(this.bottomSize - dy , this.maxFooterSize), this.minFooterSize)
    this.setState({
      bottomSize,
      lastBottomSize: bottomSize      
    })

    this.trigger('changeTimelineHeight');
  }  

  [EVENT('changeTimelineHeight') + THROTTLE(100)] () {
    this.emit('refreshTimeline')
  }

  refresh () {

    this.bindData('$splitter');
    this.bindData('$headerPanel');    
    this.bindData('$leftPanel');
    this.bindData('$rightPanel');
    this.bindData('$toggleRightButton');
    this.bindData('$toggleLeftButton');            
    this.bindData('$bodyPanel');  
    this.bindData('$footerPanel');        
    
    this.emit('resizeEditor');
  }

  [CLICK('$toggleRightButton')] () {
    this.toggleState('hideRightPanel');
    setTimeout(() => {
      this.emit('resizeCanvas'); 
    }, 100)
  } 

  [CLICK('$toggleLeftButton')] () {
    this.toggleState('hideLeftPanel');
    setTimeout(() => {
      this.emit('resizeCanvas'); 
    }, 100)
  }  

  [EVENT('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
  }


  [EVENT('toggleFooter')] (isShow) {
    this.$el.toggleClass('show-footer', isShow);

    if (this.$el.hasClass('show-footer')) {
      if (this.state.bottomSize === 30) {
        this.state.bottomSize = this.state.lastBottomSize || this.$theme('bottom_size');
      }
    } else {
      this.state.bottomSize = 30
    }

    this.refresh();

  }

  [TRANSITIONEND('$el .layout-footer')] (e) {
    this.emit('toggleFooterEnd');
  }

  [EVENT('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [EVENT('refreshAllSelectProject')] () {      
    this.emit('refreshArtboard')
  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {}
  /** 드랍존 설정을 위해서 남겨놔야함 */  

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

registElement({ DesignEditor })