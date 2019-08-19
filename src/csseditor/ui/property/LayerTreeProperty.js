import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, KEYUP, KEY, PREVENT, STOP, FOCUSOUT, VDOM, DRAGSTART } from "../../../util/Event";
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

  initState() {
    return {
      layers: [] 
    }
  }

  getBody() {
    return `
      <div class="property-item layer-list" ref="$layerList"></div>
    `;
  }

  getIcon (type) {
    return '';

    switch(type) {
    case 'circle': return icon.circle;
    case 'image': return icon.outline_image;
    case 'text': return icon.title;
    case 'cube' : return icon.cube;
    case 'path': return icon.edit;
    case 'polygon': return icon.polygon;
    default: 
      return icon.rect
    }
  }

  makeLayerList (parentObject, depth = 0) {
    if (!parentObject.layers) return '';

    return parentObject.layers.map( (layer, index) => {

      this.state.layers[layer.id] = {layer, parentObject, index}

      var selected = editor.selection.check(layer) ? 'selected' : '';
      return `        
      <div class='layer-item ${selected}' data-depth="${depth}" data-layer-id='${layer.id}' draggable="true">
        <div class='detail'>
          <span class='icon'>${this.getIcon(layer.itemType)}</span> 
          <label>${layer.name}</label>
          <div class="tools">
            <button type="button" class="lock" data-lock="${layer.lock}" title='Lock'>${layer.lock ? icon.lock : icon.lock_open}</button>
            <button type="button" class="visible" data-visible="${layer.visible}" title='Visible'>${icon.visible}</button>
            <button type="button" class="remove" title='Remove'>${icon.remove2}</button>
          </div>
        </div>
      </div>

      ${this.makeLayerList(layer, depth+1)}
    `
    }).join('')
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
    this.startInputEditing(e.$delegateTarget.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {


      var id = input.closest('layer-item').attr('data-layer-id');
      var layerInfo = this.state.layers[id] 
      if (layerInfo) {

        layerInfo.layer.reset({
          name: text
        })
      }

    });    
  }

  [KEYUP('$layerList .layer-item label') + KEY('Enter') + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  [FOCUSOUT('$layerList .layer-item label') + PREVENT  + STOP ] (e) {
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

      var obj = this.state.layers[id]
      obj.parentObject.layers.splice(obj.index, 1);
      delete this.state.layers[id]

      this.emit('refreshAllSelectArtBoard');
      // $item.remove();
    }
  }


  [CLICK('$layerList .layer-item label')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {

      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var obj = this.state.layers[id]
      editor.selection.select(obj.layer)
      $item.onlyOneClass('selected');

      this.emit('refreshSelection');      

    }
  }

  [CLICK('$layerList .layer-item .visible')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var obj = this.state.layers[id]

      obj.layer.reset({
        visible: !obj.layer.visible
      })

      e.$delegateTarget.attr('data-visible', obj.layer.visible);

      this.emit('refreshElement', obj.layer);
    }
  }


  [CLICK('$layerList .layer-item .lock')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var obj = this.state.layers[id]

      obj.layer.reset({
        lock: !obj.layer.lock
      })

      e.$delegateTarget.attr('data-lock', obj.layer.lock);

      this.emit('refreshElement', obj.layer);
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
        })
      }

    }

  }  

  [EVENT('refreshSelection')] () {
    // this.setState({ layers: [] }, false)
    this.trigger('changeSelection')
  }

  [EVENT('refreshLayerTreeView')] () {
    this.setState({ layers: [] }, false)    
    this.refresh();
  }
}
