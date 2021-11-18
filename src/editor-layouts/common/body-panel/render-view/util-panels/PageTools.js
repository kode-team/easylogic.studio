

import { CLICK, PREVENT, STOP, SUBSCRIBE, CONFIG, LOAD, DOMDIFF } from "el/sapa/Event";
import { OBJECT_TO_CLASS } from "el/utils/func";

import icon, { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './PageTools.scss';
import PathParser from 'el/editor/parser/PathParser';

export default class PageTools extends EditorElement {

  template() {
    return /*html*/`     
      <div class='elf--page-tools'>
        <button type='button' ref='$minus'>${iconUse("remove2")}</button>
        <div class='select'>
          <object 
            refClass="NumberInputEditor" 
            ref='$scale' 
            min='10' 
            max='240' 
            step="1" 
            key="scale" 
            value="${this.$viewport.scale * 100}" 
            onchange=${this.subscribe((key, scale) => {
      this.$viewport.setScale(scale / 100);
      this.emit('updateViewport');
      this.trigger('updateViewport');
    }, 1000)}
        />
        </div>
        <label>%</label>
        <button type='button' ref='$plus'>${iconUse("add")}</button>        
        <button type='button' ref='$center' data-tooltip="Move to Center" data-direction="top">${iconUse("gps_fixed")}</button>    
        <button type='button' ref='$ruler' data-tooltip="Toggle Ruler" data-direction="top">${iconUse("straighten")}</button>    
        <button type='button' ref='$fullscreen' data-tooltip="FullScreen Canvas" data-direction="top">${iconUse("fullscreen")}</button>                        
        <button type='button' ref='$pantool' class="${OBJECT_TO_CLASS({
      on: this.$config.get('set.tool.hand')
    })}" data-tooltip="Hand | H" data-direction="top">${iconUse("pantool")}</button>   
        <span class="divider">|</span>
        <button type="button" ref="$selectedCount" style="color:var(--elf--selected-color);font-weight: bold;text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1)"></button>
        <span ref="$buttons"></span>
        ${this.$injectManager.generate('page.tools')}                             
      </div>

    `;
  }


  [SUBSCRIBE('updateViewport')]() {
    const scale = Math.floor(this.$viewport.scale * 100)

    if (this.children.$scale) {
      this.children.$scale.setValue(scale);
    }

  }

  [CLICK('$plus') + PREVENT + STOP]() {
    const oldScale = this.$viewport.scale
    this.$viewport.setScale(oldScale + 0.01);
    this.emit('updateViewport');
    this.trigger('updateViewport');
  }

  [CLICK('$minus') + PREVENT + STOP]() {
    const oldScale = this.$viewport.scale
    this.$viewport.setScale(oldScale - 0.01);
    this.emit('updateViewport');
    this.trigger('updateViewport');
  }

  [CLICK('$center') + PREVENT + STOP]() {
    this.emit('moveSelectionToCenter');
  }

  [CLICK('$pantool') + PREVENT + STOP]() {
    this.$config.toggle('set.tool.hand');
  }

  [CLICK('$ruler') + PREVENT + STOP]() {
    this.$config.toggle('show.ruler');
  }

  [CLICK('$fullscreen') + PREVENT + STOP]() {
    this.emit('bodypanel.toggle.fullscreen');
  }

  [CLICK('$buttons button') + PREVENT + STOP](e) {
    const itemId = e.$dt.data('item-id');
    const pathIndex = e.$dt.data('path-index');

    const current = this.$selection.get(itemId);

    if (current.editablePath) {
      this.emit('open.editor', current);
    } else {

      const pathList = PathParser.fromSVGString(current.accumulatedPath().d).toPathList()

      this.emit('showPathEditor', 'modify', {
        box: 'canvas',
        current,
        matrix: current.matrix,
        d: pathList[pathIndex].d,
        changeEvent: (data) => {
  
          pathList[pathIndex].reset(data.d);
  
          const newPathD = current.invertPath(PathParser.joinPathList(pathList).d).d;
  
          this.command("setAttributeForMulti", "modify sub path", {
            [itemId]: current.updatePath(newPathD)
          });
        }
      })
    }

    this.emit('hideSelectionToolView');
  }

  [CONFIG('set.tool.hand')]() {
    this.refs.$pantool.toggleClass('on', this.$config.get('set.tool.hand'));
  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refs.$selectedCount.html(this.$selection.length + "");

    this.load('$buttons')
  }

  [LOAD('$buttons') + DOMDIFF]() {

    if (this.$selection.isEmpty) return "";


    const buttons = [];

    this.$selection.items.forEach(item => {

      const list = PathParser.fromSVGString(item.accumulatedPath().d).toPathList()

      list.forEach((path, index) => {
        buttons.push({
          item,
          index,
          path
        })
      })

    })

    return buttons.map((it) => {
      const { item, index, path } = it;
      return /*html*/`
        <button type="button" data-item-id="${item.id}" data-path-index="${index}">
          <svg width="16" height="16" overflow="visible">
            <path d="${path.scaleWith(16, 16).d}" style="fill:${item.fill};stroke:currentColor" stroke-width="1" />
          </svg>
        </button>
      `
    })
  }
}