import Dom from "el/base/Dom";

import { DRAGOVER, DROP, PREVENT, TRANSITIONEND, POINTERSTART, MOVE, BIND, THROTTLE, SUBSCRIBE, END } from "el/base/Event";

import { Length } from "el/editor/unit/Length";

import "el/editor/items";
import "el/editor/ui/control";

import "el/editor/ui/view/CanvasView";
import "el/editor/ui/view/ToolMenu";
import "el/editor/ui/view/LogoView";
import "el/editor/ui/view/ExternalToolMenu";
import "el/editor/ui/view/StatusBar";
import "el/editor/ui/view/PreviewToolMenu";
import "el/editor/ui/view-items/PageSubEditor";
import "el/editor/ui/view/ToolBar";
import "el/editor/ui/view/HorizontalRuler";
import "el/editor/ui/view/VerticalRuler";

import "./BodyPanel";
import "./PopupManager";
import "./KeyboardManager";

import { registElement } from "el/base/registElement";
import { EditorElement } from "el/editor/ui/common/EditorElement";

// import 'el/plugins';

export default class DesignEditor extends EditorElement {
  
  initialize () {
    super.initialize()

    this.$editor.initPlugins();

    var $body = this.opt.$container;
    
    $body.attr('data-theme', this.$editor.theme);
    $body.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }

  initState() {
    return {
      leftSize: 340,
      rightSize: 260,
      bottomSize: 0,
      lastBottomSize: 150
    }
  }

  
  [SUBSCRIBE('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="layout-main">
        <div class='layout-top' ref='$top'>
          <object refClass="ToolBar" />
        </div>
        <div class="layout-middle" ref='$middle'>      
          <div class="layout-body" ref='$bodyPanel'>
            <object refClass="BodyPanel" ref="$bodyPanelView" />
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
        </div>
        <object refClass='StatusBar' />
        <object refClass="PopupManager" />  
        <object refClass="KeyboardManager" />                
      </div>
    `;
  }

  [BIND('$splitter')] () {
    let left = `${this.state.leftSize}px`    
    if (this.$config.false('show.left.panel')) {
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
    if (this.$config.false('show.left.panel')) {
      left = `-${this.state.leftSize}px`    
    }

    return {
      style: { left, width, bottom }
    }
  }  

  [BIND('$rightPanel')] () {
    let right = `0px`    
    let bottom = Length.px(this.state.bottomSize);    
    if (this.$config.false('show.right.panel')) {
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

    if (this.$config.false('show.left.panel')) {
      left = `0px`
    }

    if (this.$config.false('show.right.panel')) {
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

  [POINTERSTART('$splitter') + MOVE('moveSplitter') + END('moveEndSplitter')] () {

    this.minSize = this.$theme('left_size');
    this.maxSize = this.$theme('left_max_size');
    this.leftSize = Length.parse(this.refs.$splitter.css('left')).value;
    this.refs.$splitter.addClass('selected');
  }

  moveSplitter (dx) {
    this.setState({
      leftSize: Math.max(Math.min(this.leftSize + dx, this.maxSize), this.minSize)
    })

  }



  moveEndSplitter () {
    this.refs.$splitter.removeClass('selected');
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

  [SUBSCRIBE('changeTimelineHeight') + THROTTLE(100)] () {
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

  [SUBSCRIBE('config:show.left.panel')]() {
    this.refresh();
    this.nextTick(() => {
      this.emit('resizeCanvas');
    })
  }

  [SUBSCRIBE('config:show.right.panel')]() {
    this.refresh();
    this.nextTick(() => {
      this.emit('resizeCanvas');
    })
  }  

  [SUBSCRIBE('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
  }


  [SUBSCRIBE('toggleFooter')] (isShow) {
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

  [SUBSCRIBE('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [SUBSCRIBE('refreshAllSelectProject')] () {      
    this.emit('refreshArtboard')
  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {}
  /** 드랍존 설정을 위해서 남겨놔야함 */  

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.$el.toggleFullscreen();
  }
}

registElement({ DesignEditor })