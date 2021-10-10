import { DRAGOVER, DROP, PREVENT, TRANSITIONEND, POINTERSTART, BIND, SUBSCRIBE, CONFIG } from "el/sapa/Event";

import { Length } from "el/editor/unit/Length";

import BaseLayout from "../common/BaseLayout"; 
import BodyPanel from "../common/BodyPanel";
import PopupManager from "../common/PopupManager";
import KeyboardManager from "../common/KeyboardManager";

import Inspector from "./area/Inspector";
import StatusBar from './area/StatusBar';
import ToolBar from "./area/ToolBar";
import PageSubEditor from "./area/PageSubEditor";
import designEditorPlugins from "plugins/design-editor-plugins";
import LayerTab from "./area/LayerTab";
import { END, MOVE } from "el/editor/types/event";
import { isFunction } from 'el/sapa/functions/func';
import IconManager from '../common/IconManager';
import PathKitInit from "pathkit-wasm/bin/pathkit.js";
import ItemLayerTab from "./area/ItemLayerTab";
import SingleInspector from './area/SingleInspector';
export default class DesignEditor extends BaseLayout {

  initialize() {
    super.initialize();

    (async () => {
      this.$pathkit.registerPathKit(await PathKitInit());
    })()
  }

  components() {
    return {
      LayerTab,
      ItemLayerTab,
      PageSubEditor,
      ToolBar,
      StatusBar,
      Inspector,
      SingleInspector,
      BodyPanel,
      PopupManager,
      KeyboardManager,
      IconManager
    }
  }

  getPlugins() {
    return designEditorPlugins
  }

  initState() {
    return {
      leftSize: 340,
      rightSize: 280,
      bottomSize: 0,
      lastBottomSize: 150
    }
  }

  template() {
    return /*html*/`
      <div class="designeditor">
        <div class="layout-main">
          <div class='layout-top' ref='$top'>
            <object refClass="ToolBar" />
            <object refClass="PageSubEditor" />
          </div>
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              <object refClass="BodyPanel" ref="$bodyPanelView" />
            </div>                           
            <div class='layout-left' ref='$leftPanel'>
              <object refClass='LayerTab' />
              <object refClass='ItemLayerTab' />
            </div>
            <div class="layout-right" ref='$rightPanel'>
              <object refClass='Inspector' />
              <object refClass="SingleInspector" />
            </div>

            <div class='layout-footer' ref='$footerPanel'>
              <div class='footer-splitter' ref='$footerSplitter' title="${this.$i18n('timeline.property.resize')}"></div>
              <object refClass='TimelineProperty' />
            </div>   
            <div class='splitter' ref='$splitter'></div>
          </div>
          <object refClass='StatusBar' />
          <object refClass="KeyboardManager" />                
        </div>
        <object refClass="PopupManager" />
        <object refClass="IconManager" />          
      </div>
    `;
  }

  [BIND('$el')] () {
    return {
      'data-design-mode': this.$config.get('editor.design.mode')
    }
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

    // this.trigger('changeTimelineHeight');
  }  

  // [SUBSCRIBE('changeTimelineHeight') + THROTTLE(100)] () {
  //   this.emit('refreshTimeline')
  // }

  refresh () {

    this.bindData('$el');
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

  [CONFIG('show.left.panel')]() {
    this.refresh();
    this.nextTick(() => {
      this.emit('resizeCanvas');
    })
  }

  [CONFIG('show.right.panel')]() {
    this.refresh();
    this.nextTick(() => {
      this.emit('resizeCanvas');
    })
  }  

  [CONFIG('editor.design.mode')] () {
    this.bindData('$el');
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

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {}
  /** 드랍존 설정을 위해서 남겨놔야함 */  

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.$el.toggleFullscreen();
  }

  [SUBSCRIBE('getLayoutElement')] (callback) {
    if (isFunction(callback)) {
      callback(this.refs);
    }
  }
}