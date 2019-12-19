import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, KEYUP, KEY, PREVENT, STOP, FOCUSOUT, VDOM, DRAGSTART, KEYDOWN, DRAGOVER, DROP, DRAG, BIND, DRAGEND } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";

import { Layer } from "../../../editor/items/Layer";
import Color from "../../../util/Color";
import { Length } from "../../../editor/unit/Length";

const i18n = editor.initI18n('layer.tree.property');

const DRAG_START_CLASS = 'drag-start'

export default class LayerTreeProperty extends BaseProperty {
  getTitle() {
    return `<span>${icon.account_tree}</span> ${i18n('title')}`;
  }

  getClassName() {
    return 'full'
  }

  initState() {
    return {
      hideDragPointer: true,
      lastDragOverPosition: 0,
      lastDragOverOffset: 0,
      rootRect: { top: 0 },
      itemRect: { height: 0 }
    }
  }

  getTools() {
    return /*html*/`
      <button type='button' ref='$add' title="Add a layer">${icon.add}</button>
    `
  }

  getBody() {
    return /*html*/`
      <div class="layer-list scrollbar" ref="$layerList"></div>
      <div class='drag-point' ref='$dragPointer'></div>
    `;
  }

  [BIND('$dragPointer')] () {


    var offset = this.state.lastDragOverOffset 
    var dist = this.state.itemRect.height/3; 
    var bound = {} 

    if (this.state.lastDragOverOffset < dist) {
      offset = 0;

      var top = this.state.lastDragOverPosition + offset - this.state.rootRect.top

      bound = {
        top: Length.px(top),
        height: '1px',
        width: '100%',
        left: '0px'
      }

      this.state.lastDragOverItemDirection = 'before';
    } else if (this.state.lastDragOverOffset > this.state.itemRect.height - dist) {
      offset = this.state.itemRect.height; 

      var top = this.state.lastDragOverPosition + offset - this.state.rootRect.top

      bound = {
        top: Length.px(top),
        height: '1px',
        width: '100%',
        left: '0px'
      }            
      this.state.lastDragOverItemDirection = 'after';      
    } else {
      offset = 0; 

      var top = this.state.lastDragOverPosition + offset - this.state.rootRect.top

      bound = {
        top: Length.px(top),
        height: Length.px(this.state.itemRect.height),
        width: '100%',
        left: '0px'
      }      
      this.state.lastDragOverItemDirection = 'self';      
    }

    

    return {
      style: {
        position: 'absolute',
        ...bound,
        'display': this.state.hideDragPointer ? 'none':  'block'
      }
    }
  }

  getIcon (item) {
    // return '';

    switch(item.itemType) {
    case 'circle': 
      return icon.circle;
    case 'image': return icon.photo;
    case 'text': 
    case 'svg-textpath':
      return icon.title;

    case 'cube' : 
      return icon.cube;
    case 'svg-path': 
    case 'svg-polygon': 
      var rate = item.width.value === 0 ? 0 : (24/item.width.value);    
      var strokeWidth = rate > 1 ? 1: 1/(rate === 0 ? 1 : rate);       

      switch (item.itemType) {
      case 'svg-path': 
        return `<svg viewBox="0 0 ${item.width.value} ${item.height.value}"><path d="${item.d}" stroke-width="${strokeWidth}" /></svg>`;
      case 'svg-polygon': 
        return `<svg viewBox="0 0 ${item.width.value} ${item.height.value}"><polygon points="${item.points}" stroke-width="${strokeWidth}" /></svg>`;
      }

    default: 
      return icon.rect
    }
  }

  makeLayerList (parentObject, depth = 0) {
    if (!parentObject.layers) return '';

    return parentObject.layers.map( (layer, index) => {

      var selected = editor.selection.check(layer) ? 'selected' : '';
      var name = layer.name; 

      if (layer.is('text')) {
        name = layer.text || layer.name 
      }
      var title = ''; 

      if (layer.hasLayout()) {
        title = i18n('layout.title.' + layer.layout)
      }


      return /*html*/`        
      <div class='layer-item ${selected}' data-depth="${depth}" data-layout='${layer.layout}' data-layer-id='${layer.id}' draggable="true">
        <div class='detail'>
          <label data-layout-title='${title}'> 
            <span class='icon' data-item-type="${layer.itemType}">${this.getIcon(layer)}</span> 
            <span class='name'>${name}</span>
          </label>
          <div class="tools">
            <button type="button" class="lock" data-lock="${layer.lock}" title='Lock'>${layer.lock ? icon.lock : icon.lock_open}</button>
            <button type="button" class="visible" data-visible="${layer.visible}" title='Visible'>${icon.visible}</button>
            <button type="button" class="copy" title='Copy'>${icon.copy}</button>
            <button type="button" class="remove" title='Remove'>${icon.remove2}</button>
          </div>
        </div>
      </div>

      ${this.makeLayerList(layer, depth+1)}
    `
    }).join('')
  }

  [EVENT('refreshContent')] (arr) {
    this.refresh();
  }

  [LOAD("$layerList") + VDOM]() {

    var artboard = editor.selection.currentArtboard;
    if (!artboard) return ''

    return this.makeLayerList(artboard, 0) + /*html*/`
      <div class='layer-item ' data-depth="0" data-is-last="true">
      </div>
    `
  }

  [DRAGSTART('$layerList .layer-item')] (e) {
    var layerId = e.$delegateTarget.attr('data-layer-id');
    e.$delegateTarget.addClass(DRAG_START_CLASS);
    e.dataTransfer.setData('layer/id', layerId);
    this.state.rootRect = this.refs.$layerList.rect()
    this.state.itemRect = e.$delegateTarget.rect();
    this.setState({
      hideDragPointer: false 
    }, false)

    this.bindData('$dragPointer');
  }

  [DRAGEND('$layerList .layer-item')] (e) {
    this.setState({
      hideDragPointer: true 
    }, false)

    this.bindData('$dragPointer');

    this.refs.$layerList.$$(`.${DRAG_START_CLASS}`).forEach(it => {
      it.removeClass(DRAG_START_CLASS);
    })
  }

  [DRAGOVER(`$layerList .layer-item:not(.${DRAG_START_CLASS})`) + PREVENT] (e) {
    var targetLayerId = e.$delegateTarget.attr('data-layer-id') 
    // console.log({targetLayerId, x: e.offsetX, y: e.offsetY});

    this.state.lastDragOverItemId = targetLayerId;
    this.state.lastDragOverPosition = e.$delegateTarget.rect().top;
    this.state.lastDragOverOffset = e.offsetY;

    this.bindData('$dragPointer')

  }
  [DROP(`$layerList .layer-item:not(.${DRAG_START_CLASS})`)] (e) {
    var targetLayerId = e.$delegateTarget.attr('data-layer-id')
    var sourceLayerId = e.dataTransfer.getData('layer/id');

    if (targetLayerId === sourceLayerId) return; 
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var targetItem = artboard.searchById(targetLayerId);
      var sourceItem = artboard.searchById(sourceLayerId);

      if (targetItem.hasParent(sourceItem.id)) return; 

      targetItem.add(sourceItem, this.state.lastDragOverItemDirection);

      editor.selection.select(sourceItem);

      this.setState({
        hideDragPointer: true 
      })

      this.emit('refreshAllSelectArtBoard')      

    }
  }

  [DOUBLECLICK('$layerList .layer-item')] (e) {
    this.startInputEditing(e.$delegateTarget.$('.name'))
  }



  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {


      var id = input.closest('layer-item').attr('data-layer-id');

      var artboard = editor.selection.currentArtboard;
      if (artboard) {
        var item = artboard.searchById(id)
        if (item) {
          item.reset({
            name: text
          })
        }
  
      }


    });    
  }

  [KEYDOWN('$layerList .layer-item .name') + KEY('Enter') + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  [FOCUSOUT('$layerList .layer-item .name') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  selectLayer(layer) {

    if (layer) {
      editor.selection.select(layer)
    }

    this.refresh()
    this.emit('refreshSelection');
  }

  addLayer (layer) {
    if (layer) {
      editor.selection.select(layer);

      this.emit('refreshAllSelectArtBoard')
    }
  }

  [CLICK('$add')] (e) {
    var artboard = editor.selection.currentArtboard;
    if (artboard) {
      var layer = artboard.add(new Layer({
        'background-color': Color.random(),
        width: Length.px(200),
        height: Length.px(100)
      }))

      this.addLayer(layer);
    }
  }

  [CLICK('$layerList .layer-item .remove')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var item = artboard.searchById(id);
      if (item) item.remove();

      this.emit('refreshAllSelectArtBoard');
      
    }
  }


  [CLICK('$layerList .layer-item label')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {

      var $item = e.$delegateTarget.closest('layer-item')
      $item.onlyOneClass('selected');

      var id = $item.attr('data-layer-id');
      var item = artboard.searchById(id);
      editor.selection.select(item)

      this.emit('refreshSelection');      

    }
  }

  [CLICK('$layerList .layer-item .visible')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var item = artboard.searchById(id);      
      item.toggle('visible')
      e.$delegateTarget.attr('data-visible', item.visible);

      this.emit('refreshElement', item);
    }
  }


  [CLICK('$layerList .layer-item .lock')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var item = artboard.searchById(id);
      item.toggle('lock')
      e.$delegateTarget.attr('data-lock', item.lock);

      this.emit('refreshElement', item);
    }
  }


  [CLICK('$layerList .layer-item .copy')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var obj = artboard.searchById(id)
      var copyObject = obj.copy();

      editor.selection.select(copyObject);
      this.refresh();
      this.emit('refreshElement');
    }
  }

  [EVENT('emptySelection')] () {
    this.refs.$layerList.$$('.selected').forEach(it => {
      it.removeClass('selected')
    })
  }

  [EVENT('changeSelection')] () {
    if (this.refs.$layerList) {    
      this.refs.$layerList.$$('.selected').forEach(it => {
        it.removeClass('selected')
      })

      var selector = editor.selection.items.map(it => {
        return `[data-layer-id="${it.id}"]`
      }).join(',')

      if (selector) {
        this.refs.$layerList.$$(selector).forEach(it => {

          it.addClass('selected')

          var item = editor.selection.itemKeys[it.attr('data-layer-id')]
          if (item.is('svg-path', 'svg-polygon') ) {
            it.$('.icon').html(this.getIcon(item));
          }

        })
      }


    }

  }  

  [EVENT('refreshSelection', 'refreshStylePosition', 'refreshSelectionStyleView', 'refreshCanvasForPartial')] () { 
    this.trigger('changeSelection')
  }

  [EVENT('refreshLayerTreeView')] () {
    this.refresh();
  }

  [EVENT('changeItemLayout')] () {
    this.refresh();
  }


}
