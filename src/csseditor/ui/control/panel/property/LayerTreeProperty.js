import BaseProperty from "./BaseProperty";
import { LOAD, CLICK } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import icon from "../../../icon/icon";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_SELECTION } from "../../../../types/event";
import { Layer } from "../../../../../editor/items/Layer";
import Color from "../../../../../util/Color";
import { Length } from "../../../../../editor/unit/Length";


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

  makeLayerList (parentObject, depth = 0) {
    if (!parentObject.layers) return '';

    return parentObject.layers.map( (layer, index) => {

      this.state.layers[layer.id] = {layer, parentObject, index}

      var selected = editor.selection.check(layer) ? 'selected' : '';
      return `        
      <div class='property-item layer-item ${selected}' data-depth="${depth}" data-layer-id='${layer.id}'>
        <div class='detail'>
          <label>${layer.name}</label>
          <div class="tools">
            <button type="button" class="lock" data-lock="${layer.lock}">${layer.lock ? icon.lock : icon.lock_open}</button>
            <button type="button" class="visible" data-visible="${layer.visible}">${icon.visible}</button>
            <button type="button" class="remove" >${icon.remove2}</button>
          </div>
        </div>
      </div>

      ${this.makeLayerList(layer, depth+1)}
    `
    }).join('')
  }

  [LOAD("$layerList")]() {

    var artboard = editor.selection.currentArtboard;
    if (!artboard) return ''

    return this.makeLayerList(artboard, 0)
  }

  selectLayer(layer) {

    if (layer) {
      editor.selection.select(layer)
    }

    this.refresh()
    this.emit('addElement')
    this.emit(CHANGE_SELECTION);
  }

  [CLICK('$add')] (e) {
    var artboard = editor.selection.currentArtboard;
    if (artboard) {
      var layer = artboard.add(new Layer({
        'background-color': Color.random(),
        width: Length.px(200),
        height: Length.px(100)
      }))

      this.selectLayer(layer);
    }
  }

  [CLICK('$layerList .layer-item .remove')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {
      var $item = e.$delegateTarget.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var obj = this.state.layers[id]
      obj.parentObject.layers.splice(obj.index);
      delete this.state.layers[id]

      this.emit('refreshCanvas')
      this.emit('addElement')
      $item.remove();
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

      this.emit(CHANGE_SELECTION);      

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

      this.emit('refreshCanvas');
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

      this.emit('refreshCanvas');
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

  [EVENT(CHANGE_SELECTION)] () {
    // this.setState({ layers: [] }, false)
    this.trigger('changeSelection')
  }

  [EVENT('addElement', 'refreshLayerTreeView')] () {
    this.setState({ layers: [] }, false)    
    this.refresh();
  }
}
