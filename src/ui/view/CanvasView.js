import UIElement, { EVENT } from "@core/UIElement";

import HTMLRenderView from "./render-view/HTMLRenderView";
import PageTools from "../view-items/PageTools";
import PageSubEditor from "../view-items/PageSubEditor";
import { BIND, DRAGOVER, DROP, IF, MOVE, normalizeWheelEvent, POINTERSTART, PREVENT, WHEEL } from "@core/Event";
import { vec3 } from "gl-matrix";
import { KEY_CODE } from "@types/key";
import Resource from "@util/Resource";
import Dom from "@core/Dom";

export default class CanvasView extends UIElement {

  components() {
    return {
      PageTools,
      HTMLRenderView,
      PageSubEditor,
    }
  }

  initState () {
    return {
      cursor: 'auto',
      cursorArgs: []
    }
  }

  afterRender() {
    this.emit('load.json');
    this.trigger('resizeCanvas');    
    this.nextTick(() => {
      this.emit('moveSelectionToCenter');
    })
  }
  template() {
    return/*html*/`
      <div class='page-container' tabIndex="-1" ref='$container'>
        <div class='page-view'>
          <div class='page-lock scrollbar' ref='$lock'>
            <object refClass='HTMLRenderView' ref='$elementView' />
            <div ref='$viewport'></div>
          </div>
        </div>
        <!--<PageSubEditor /> -->
        <object refClass='PageTools' />
      </div>
    `;
  }

  makeViewportConsole () {

    if (!this.$viewport.verties) return '';
    const mouse = this.$viewport.pos;

    return /*html*/`
      <div style='background-color: rgba(0, 0, 0, 0.5); color: white;position:absolute;left:0px;top:0px;bottom:0px;right:0px;pointer-events:none;'>
        <div style='position:absolute;width:1px;height:100%;top:0px;left:50%;transform:translateX(-50%);background-color:black;'></div>  
        <div style='position:absolute;height:1px;width:100%;top:50%;transform:translateY(-50%);background-color:black;'></div>                
        <div style='position:absolute;display:inline-block;left:0px;top:50%;transform:translateY(-50%);'>${Math.floor(this.$viewport.minX)}</div>
        <div style='position:absolute;display:inline-block;right:0px;top:50%;transform:translateY(-50%);'>${Math.floor(this.$viewport.maxX)}</div>
        <div style='position:absolute;display:inline-block;left:50%;top:0px;transform:translateX(-50%)'>${Math.floor(this.$viewport.minY)}</div>
        <div style='position:absolute;display:inline-block;left:50%;bottom:0px;transform:translateX(-50%)'>${Math.floor(this.$viewport.maxY)}</div>
        <div style='position:absolute;top:50%;left:50%;display:inline-block;'>${this.$viewport.transformOrigin.map(it => Math.floor(it)).join(', ')}</div>
        <div style='position:absolute;left:${mouse[0]}%;top:${mouse[1]}%;display:inline-block;'>
          mouse: ${this.$viewport.mouse.map(it => Math.floor(it)).join(', ')} <br />
          translate: ${this.$viewport.translate.join(', ')} <br />          
          zoom : ${this.$viewport.zoomFactor} <br />
        </div>                  

      </div>
    `
  }

  // space 키가 눌러져 있을 때만 실행한다. 
  checkSpace () {
    return this.$keyboardManager.check(this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space))
  }

  [POINTERSTART('$lock') + IF('checkSpace') + MOVE('movePan')] (e) {
    this.lastDist = vec3.create()
    this.emit('addStatusBarMessage', this.$i18n('viewport.panning.enable'));
  }

  movePan (dx, dy) {
    const currentDist = vec3.fromValues(dx, dy, 0);
    this.$viewport.pan(...vec3.transformMat4(
      [], 
      vec3.subtract([], this.lastDist, currentDist), 
      this.$viewport.scaleMatrixInverse
    ))
    this.lastDist = currentDist
  }

  /** viewport 디버그 용  */
  [BIND('$viewport')] () {

    return '';

    return {
      style: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
        'pointer-events': 'none'
      },
      innerHTML : this.makeViewportConsole()
    }
  }

  async [BIND('$container')] () {
    const cursor = await this.$editor.cursorManager.load(this.state.cursor, ...(this.state.cursorArgs || []))
    return {
      style: {
        cursor
      }
    }
  }


  [DRAGOVER('$lock') + PREVENT] () {}
  [DROP('$lock') + PREVENT] (e) {

    if (e.dataTransfer.getData('text/artboard')) {
      const newCenter = this.$viewport.createWorldPosition(e.clientX, e.clientY);
      
      this.emit('drop.asset', {
          artboard: { id: e.dataTransfer.getData('text/artboard'), center: newCenter }
      })

    } else {
      const files = Resource.getAllDropItems(e)
      const id = Dom.create(e.target).attr('data-id');

      if (id) {
        this.emit('drop.asset', {
          gradient: e.dataTransfer.getData('text/gradient'),
          pattern: e.dataTransfer.getData('text/pattern'),
          color: e.dataTransfer.getData('text/color'),
          imageUrl: e.dataTransfer.getData('image/info'),
        }, id)
      } else {
        const imageUrl = e.dataTransfer.getData('image/info')
        this.emit('dropImageUrl', imageUrl)
      }
    }

  }  

    /**
     * wheel 은 제어 할 수 있다. 
     *  내 위치를 나타낼려면 wheel 로 제어해야한다. 
     * transform-origin 을 현재 보고 있는 시점의 좌표로 맞출 수 있어야 한다. 
     * 그런 다음 scale 을 한다. 
     * // 내 마우스 위치를 
     * 
     * @param {*} e 
     */
  [WHEEL('$lock') + PREVENT] (e) {

      const [dx, dy] = normalizeWheelEvent(e);

      if (!this.state.gesture) {

        if (e.ctrlKey) {

          this.$viewport.setMousePoint(e.clientX, e.clientY)
        }

        this.emit('startGesture');        
        this.state.gesture = true;    
      } else {

        if (e.ctrlKey) {

          const zoomFactor = 1 - (2.5 * dy)/100;

          this.$viewport.zoom(zoomFactor);

        } else {            

          const newDx =  - 2.5 * dx;
          const newDy =  - 2.5 * dy;

          this.$viewport.pan(-newDx/this.$viewport.scale, -newDy/this.$viewport.scale, 0);
        }
      }

      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(() => {
        this.state.gesture = undefined;
        this.emit('endGesture');
      }, 200)
  }

  refreshCanvasSize () {
    this.$viewport.refreshCanvasSize(this.refs.$lock.rect());
  }

  [EVENT('resize.window', 'resizeCanvas')] () {
    this.refreshCanvasSize();
  }

  [EVENT('updateViewport')] () {
    this.bindData('$viewport');
  }

  [EVENT('changeIconView')] (cursor, ...args) {

    if (`${this.state.cursor} ${this.state.cursorArgs}` === `${cursor} ${args}`) {
      return;
    }

    this.state.cursor = cursor; 
    this.state.cursorArgs = args; 
    this.bindData('$container')
  }

}
