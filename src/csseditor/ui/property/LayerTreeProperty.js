import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, KEYUP, KEY, PREVENT, STOP, FOCUSOUT, VDOM, DRAGSTART, KEYDOWN } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";

import { Layer } from "../../../editor/items/Layer";
import Color from "../../../util/Color";
import { Length } from "../../../editor/unit/Length";


export default class LayerTreeProperty extends BaseProperty {
  getTitle() {
    return "Layers";
  }

  getClassName() {
    return 'full'
  }

  getTools() {
    return `
      <button type='button' ref='$add' title="Add a layer">${icon.add}</button>
    `
  }

  getBody() {
    return `
      <div class="layer-list" ref="$layerList"></div>
    `;
  }

  getIcon (item) {
    // return '';

    switch(item.itemType) {
    case 'circle': 
      return icon.circle;
    case 'image': return icon.photo;
    case 'text': return icon.title;
    case 'cube' : return icon.cube;
    case 'svg-path': 
      var rate = (24/item.width.value); 

      var strokeWidth = rate > 1 ? 1: 1/rate; 

      return `<svg viewBox="0 0 ${item.width.value} ${item.height.value}"><path d="${item.d}" stroke-width="${strokeWidth}" /></svg>`;
    case 'svg-polygon': 
      var rate = (24/item.width.value);    
      var strokeWidth = rate > 1 ? 1: 1/rate;       
      return `<svg viewBox="0 0 ${item.width.value} ${item.height.value}"><polygon points="${item.points}" stroke-width="${strokeWidth}" /></svg>`;
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
      return /*html*/`        
      <div class='layer-item ${selected}' data-depth="${depth}" data-layer-id='${layer.id}' draggable="true">
        <div class='detail'>
          <label> 
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

    return this.makeLayerList(artboard, 0)
  }

  [DRAGSTART('$layerList .layer-item')] (e) {
    var layerId = e.$delegateTarget.attr('data-layer-id');
    e.dataTransfer.setData('layer/id', layerId);
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
      item.remove();

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

}
