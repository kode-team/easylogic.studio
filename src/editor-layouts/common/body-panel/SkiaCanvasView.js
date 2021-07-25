
import { BIND, DRAGOVER, DROP, END, IF, MOVE, normalizeWheelEvent, POINTERSTART, PREVENT, SUBSCRIBE, WHEEL } from "el/base/Event";
import { vec3 } from "gl-matrix";
import { KEY_CODE } from "el/editor/types/key";
import Resource from "el/editor/util/Resource";
import Dom from "el/base/Dom";

import { EditorElement } from "el/editor/ui/common/EditorElement";
import SkiaRenderView from "./render-view/skia-render-view/SkiaRenderView";
import PageTools from "./render-view/util-panels/PageTools";

import LayerAppendView from "./render-view/draw-panels/LayerAppendView";
import PathDrawView from "./render-view/draw-panels/PathDrawView";
import PathEditorView from "./render-view/draw-panels/PathEditorView";
import HoverView from "./render-view/draw-panels/HoverView";
import GuideLineView from "./render-view/draw-panels/GuideLineView";
import SelectionInfoView from "./render-view/draw-panels/SelectionInfoView";
import GridLayoutLineView from "./render-view/draw-panels/GridLayoutLineView";
import DragAreaView from "./render-view/draw-panels/DragAreaView";
import DragAreaRectView from "./render-view/draw-panels/DragAreaRectView";
import SelectionToolView from "./render-view/draw-panels/SelectionToolView";
import GroupSelectionToolView from "./render-view/draw-panels/GroupSelectionToolView";


import './SkiaCanvasView.scss';


export default class CanvasView extends EditorElement {

  components() {
    return {
      SelectionToolView,
      GroupSelectionToolView,
      PageTools,
      GridLayoutLineView,
      DragAreaRectView,
      SkiaRenderView,
      SelectionInfoView,
      LayerAppendView,
      PathEditorView,
      PathDrawView,
      HoverView,
      GuideLineView,
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
      this.emit('moveSelectionToCenter', false);
      this.refreshCursor();
    })
  }
  template() {
    return/*html*/`
      <div class='elf--page-container' tabIndex="-1" ref='$container'>
        <div class='page-view' ref="$pageView">
          <div class='page-lock scrollbar' ref='$lock'>            
            <object refClass="DragAreaView" ref="$dragAreaView" />                                             
            <object refClass='SkiaRenderView' ref='$elementView' />
            <object refClass='SelectionToolView' ref='$selectionTool' />
            <object refClass='GroupSelectionToolView' ref='$groupSelectionTool' />
            <object refClass="DragAreaRectView" ref="$dragAreaRectView" />                  
            <object refClass='GridLayoutLineView' ref='$gridLayoutLineView' />            
            <object refClass='SelectionInfoView' ref='$selectionInfoView' />                                                            
            <object refClass='GuideLineView' ref='$guideLineView' />            
            <object refClass='HoverView' ref='$hoverView' />     
            <object refClass='LayerAppendView' ref='$objectAddView' />       
            <object refClass='PathEditorView' ref='$pathEditorView' />                 
            <object refClass='PathDrawView' ref='$pathDrawView' />            
          </div>
        </div>
        <object refClass='PageTools' />
      </div>
    `;
  }

  [BIND('$pageView')]() {
    return {
      style: {
        '--elf--page-view-color': this.$config.get('style.page-view-color')
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

  [SUBSCRIBE('config:set.tool.hand')](value) {
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

    if (e.dataTransfer.getData('text/artboard')) {

      this.emit('drop.asset', {
        artboard: { id: e.dataTransfer.getData('text/artboard'), center: newCenter }
      })

    } else if (e.dataTransfer.getData('text/custom-component')) {
      this.emit('drop.asset', {
        customComponent: { id: e.dataTransfer.getData('text/custom-component'), center: newCenter }
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