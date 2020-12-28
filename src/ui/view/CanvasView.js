import UIElement, { EVENT } from "@core/UIElement";

import HTMLRenderView from "./render-view/HTMLRenderView";
import PageTools from "../view-items/PageTools";
import PageSubEditor from "../view-items/PageSubEditor";
import { BIND, normalizeWheelEvent, PREVENT, WHEEL } from "@core/Event";
import { vec3 } from "gl-matrix";

export default class CanvasView extends UIElement {

  components() {
    return {
      PageTools,
      HTMLRenderView,
      PageSubEditor,
    }
  }

  initState() {
    return {
      zoomFactor: 0,
      cachedViewportMatrix: {
        origin: vec3.create(),
        mouse: vec3.create(),
        scale: 1, 
      }
    }
  }

  afterRender() {
    this.emit('load.json');
    this.trigger('resizeCanvas');    
  }
  template() {
    return/*html*/`
      <div class='page-container' tabIndex="-1">
        <div class='page-view'>
          <div class='page-lock scrollbar' ref='$lock'>
            <HTMLRenderView ref='$elementView' />
            <div ref='$viewport'></div>
          </div>
        </div>
        <!--<PageSubEditor /> -->
        <PageTools />
      </div>
    `;
  }

  makeViewportConsole () {

    if (!this.$viewport.verties) return '';
    const {cachedViewportMatrix} = this.state;

    const mouse = this.$viewport.pos;

    return /*html*/`
      <div style='background-color: rgba(0, 0, 0, 0.5); color: white;position:absolute;left:0px;top:0px;bottom:0px;right:0px;pointer-events:none;'>
        <div>left: ${this.$viewport.verties[0][0]}</div>
        <div>right: ${this.$viewport.verties[2][0]}</div>      
        <div>top: ${this.$viewport.verties[0][1]}</div>
        <div>bototm: ${this.$viewport.verties[2][1]}</div>                  
        <div style='position:absolute;top:50%;left:50%;display:inline-block;'>${this.$viewport.transformOrigin.join(', ')}</div>  
        <div style='position:absolute;left:${mouse[0]}%;top:${mouse[1]}%;display:inline-block;'>
          mouse: ${this.$viewport.mouse.map(it => Math.floor(it)).join(', ')} <br />
          translate: ${this.$viewport.translate.join(', ')} <br />          
          origin: ${vec3.lerp([], this.$viewport.verties[0], this.$viewport.verties[2], 0.5).join(', ')} <br />
          zoom : ${this.$viewport.zoomFactor} <br />
        </div>                  
        <div style='position:absolute;width:1px;height:100%;top:0px;left:50%;transform:translateX(-50%);background-color:black;'></div>  
        <div style='position:absolute;height:1px;width:100%;top:50%;transform:translateY(-50%);background-color:black;'></div>          
      </div>
    `
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

          this.$viewport.pan(-newDx, -newDy, 0);
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

}
