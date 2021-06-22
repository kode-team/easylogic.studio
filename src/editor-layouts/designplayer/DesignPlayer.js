
import Dom from "el/base/Dom";


import "el/editor/items";
import "el/editor/ui/view/PlayCanvasView";

import { registElement } from "el/base/registElement";
import { KEYDOWN, KEYUP, SUBSCRIBE } from "el/base/Event";

import { Component } from "el/editor/items/Component";
import MenuItem from "el/editor/ui/menu-items/MenuItem";
import LayerRender from "el/editor/renderer/HTMLRenderer/LayerRender";

import BaseLayout from "../BaseLayout";
import { isArray } from "el/base/functions/func";

export default class DesignPlayer extends BaseLayout {
  
  initialize () {
    super.initialize()

    if (isArray(this.opt.plugins)) {
      this.$editor.registerPluginList(this.opt.plugins);
    }

    this.emit('load.json', this.opt.data.projects);

    this.$editor.initPlugins({
      Component,
      MenuItem,
      LayerRender
    });
  }

  afterRender() {
    this.$el.attr('data-theme', this.$editor.theme);
    this.$el.addClass(navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default')
  }
  
  [SUBSCRIBE('changed.locale')] () {
    this.rerender()
  }

  template() {
    return /*html*/`
      <div class="designeditor">    
        <div class="layout-main player">
          <object refClass='PlayCanvasView' />        
        </div>
      </div>
    `;
  }

  [SUBSCRIBE('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
  }

  [SUBSCRIBE('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [SUBSCRIBE('refreshAllSelectProject')] () {      
    this.emit('refreshArtboard')
  }

  [KEYDOWN('document')] (e) {
    this.emit('keymap.keydown', e);
  }  


  [KEYUP('document')] (e) {
    this.emit('keymap.keyup', e);
  }  

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.opt.$container.toggleFullscreen();
  }

}

registElement({ DesignPlayer })