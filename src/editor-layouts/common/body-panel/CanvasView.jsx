
import { BIND, CONFIG, DRAGOVER, DROP, IF, normalizeWheelEvent, POINTERSTART, PREVENT, SUBSCRIBE, WHEEL } from "el/sapa/Event";
import { vec3 } from "gl-matrix";
import { KEY_CODE } from "el/editor/types/key";
import Resource from "el/editor/util/Resource";
import Dom from "el/sapa/functions/Dom";
import { END, MOVE } from "el/editor/types/event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import HTMLRenderView from "./render-view/html-render-view/HTMLRenderView";
import PageTools from "./render-view/util-panels/PageTools";

import DragAreaView from "./render-view/draw-panels/DragAreaView";
import DragAreaRectView from "./render-view/draw-panels/DragAreaRectView";


import './CanvasView.scss';
import { createComponent } from "el/sapa/functions/jsx";


export default class CanvasView extends EditorElement {

  components() {
    return {
      PageTools,
      DragAreaRectView,
      HTMLRenderView,
      DragAreaView
    }
  }

  initState() {
    return {
      cursor: 'auto',
      cursorArgs: []
    }
  }

  afterRender() {
    this.nextTick(() => {
      this.trigger('resizeCanvas');
      this.emit('moveSelectionToCenter', true);
      this.refreshCursor();
    }, 100)
  }
  template() {
    return <div class='elf--page-container' tabIndex="-1" ref='$container'>
        <div class='page-view' ref="$pageView">
          <div class='page-lock scrollbar' ref='$lock'>            
            <DragAreaView ref='$dragArea'/>
            <HTMLRenderView ref='$htmlRenderView'/>
            <DragAreaRectView ref='$dragAreaRectView'/>
            
            {this.$injectManager.generate('canvas.view')}              

          </div>
        </div>
        ${createComponent('PageTools')}
      </div>
  }

  [BIND('$pageView')]() {
    return {
      style: {
        '--elf--canvas-background-color': this.$config.get('style.canvas.background.color')
      }
    }
  }

  // space 키가 눌러져 있을 때만 실행한다. 
  checkSpace(e) {
    // hand 툴이 on 되어 있으면 항상 드래그 모드가 된다. 
    if (this.$config.get('set.tool.hand')) {
      return true;
    }

    return this.$keyboardManager.check(this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space))
  }

  [POINTERSTART('$lock') + IF('checkSpace') + MOVE('movePan') + END('moveEndPan')](e) {
    this.startMovePan();
  }

  [CONFIG('set.tool.hand')](value) {
    if (value) {
      this.startMovePan();

      this.emit('refreshCursor', 'grab');
    } else {
      this.emit('recoverCursor', 'auto')
      this.emit('addStatusBarMessage', '');
    }


  }

  startMovePan() {
    this.lastDist = vec3.create()
    this.emit('addStatusBarMessage', this.$i18n('viewport.panning.enable'));
  }

  movePan(dx, dy) {
    this.emit('refreshCursor', 'grabbing');
    const currentDist = vec3.fromValues(dx, dy, 0);
    this.$viewport.pan(...vec3.transformMat4(
      [],
      vec3.subtract([], this.lastDist, currentDist),
      this.$viewport.scaleMatrixInverse
    ))
    this.lastDist = currentDist
  }

  refreshCursor() {
    if (this.$config.get('set.tool.hand') === false) {
      this.emit('refreshCursor', 'auto');
      this.emit('addStatusBarMessage', '');
    } else {
      this.emit('refreshCursor', 'grab');
    }
  }

  moveEndPan() {
    this.refreshCursor();

  }

  async [BIND('$container')]() {
    const cursor = await this.$editor.cursorManager.load(this.state.cursor, ...(this.state.cursorArgs || []))
    return {
      style: {
        cursor
      }
    }
  }


  [DRAGOVER('$lock') + PREVENT]() { }
  [DROP('$lock') + PREVENT](e) {
    const newCenter = this.$viewport.getWorldPosition(e);

    if (e.dataTransfer.getData('text/asset')) {

      this.emit('drop.asset', {
        asset: { id: e.dataTransfer.getData('text/asset'), center: newCenter }
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
   */
  [WHEEL('$lock') + PREVENT](e) {

    const [dx, dy] = normalizeWheelEvent(e);

    if (!this.state.gesture) {

      if (e.ctrlKey) {

        this.$viewport.setMousePoint(e.clientX, e.clientY)
      }

      this.emit('startGesture');
      this.state.gesture = true;
    } else {

      if (e.ctrlKey) {

        const zoomFactor = 1 - (2.5 * dy) / 100;

        this.$viewport.zoom(zoomFactor);

      } else {

        const newDx = - 2.5 * dx;
        const newDy = - 2.5 * dy;

        this.$viewport.pan(-newDx / this.$viewport.scale, -newDy / this.$viewport.scale, 0);
      }
    }

    clearTimeout(this.state.timer);
    this.state.timer = setTimeout(() => {
      this.state.gesture = undefined;
      this.emit('endGesture');
    }, 200)
  }

  refreshCanvasSize() {
    this.$viewport.refreshCanvasSize(this.refs.$lock.rect());
  }

  [SUBSCRIBE('resize.window', 'resizeCanvas')]() {
    this.refreshCanvasSize();
  }

  [SUBSCRIBE('changeIconView')](cursor, ...args) {

    if (`${this.state.cursor} ${this.state.cursorArgs}` === `${cursor} ${args}`) {
      return;
    }

    this.state.cursor = cursor;
    this.state.cursorArgs = args;
    this.bindData('$container')
  }

}