

import { DRAGOVER, DROP, IF, MOVE, normalizeWheelEvent, POINTERSTART, PREVENT, SUBSCRIBE, WHEEL } from "el/base/Event";
import { vec3 } from "gl-matrix";
import { KEY_CODE } from "el/editor/types/key";
import Resource from "el/editor/util/Resource";
import Dom from "el/base/Dom";
import { registElement } from "el/base/registElement";
import "./render-view/PlayerHTMLRenderView";
import { EditorElement } from "../common/EditorElement";


export default class PlayCanvasView extends EditorElement {

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
            <object refClass='PlayerHTMLRenderView' ref='$elementView' />
          </div>
        </div>
      </div>
    `;
  }

  // space 키가 눌러져 있을 때만 실행한다. 
  checkSpace () {
    return this.$keyboardManager.check(this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space))
  }

  [POINTERSTART('$lock') + IF('checkSpace') + MOVE('movePan')] (e) {
    this.lastDist = vec3.create()
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

  [SUBSCRIBE('resize.window', 'resizeCanvas')] () {
    this.refreshCanvasSize();
  }

}

registElement({ PlayCanvasView })