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

  getBody() {
    return `
      <div class="property-item layer-list" ref="$layerList"></div>
    `;
  }

  [LOAD("$layerList")]() {

    var artboard = editor.selection.currentArtboard;
    if (!artboard) return ''

    
    return artboard.layers.map( (layer, index) => {
      var selected = editor.selection.check(layer) ? 'selected' : ''
      return ` 
        <div class='property-item layer-item ${selected}' data-layer-id='${layer.id}'>
          <div class='detail'>
            <label data-index='${index}'>${layer.name}</label>
            <div class="tools">
              <button type="button" class="lock" data-index="${index}" data-lock="${layer.lock}">${layer.lock ? icon.lock : icon.lock_open}</button>
              <button type="button" class="visible" data-index="${index}" data-visible="${layer.visible}">${icon.visible}</button>
              <button type="button" class="remove" data-index="${index}">${icon.remove2}</button>
            </div>
          </div>
        </div>
      `
    })
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
      var index = +e.$delegateTarget.attr('data-index')

      artboard.layers.splice(index);

      var layer = artboard.layers[index] || artboard.layers[index - 1];

      this.selectLayer(layer);
    }
  }


  [CLICK('$layerList .layer-item label')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {

      var index = +e.$delegateTarget.attr('data-index')

      var layer = artboard.layers[index]

      this.selectLayer(layer);
    }
  }

  [CLICK('$layerList .layer-item .visible')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {

      var index = +e.$delegateTarget.attr('data-index')

      var layer = artboard.layers[index]

      layer.reset({
        visible: !layer.visible
      })

      e.$delegateTarget.attr('data-visible', layer.visible);

      this.emit('refreshCanvas');
    }
  }


  [CLICK('$layerList .layer-item .lock')] (e) {
    var artboard = editor.selection.currentArtboard
    if (artboard) {

      var index = +e.$delegateTarget.attr('data-index')

      var layer = artboard.layers[index]

      layer.reset({
        lock: !layer.lock
      })

      this.refresh();

      this.emit('refreshCanvas');
    }
  }

  [EVENT('emptySelection')] () {
    this.refs.$layerList.$$('.selected').forEach(it => {
      it.removeClass('selected')
    })
  }

  [EVENT('changeSelection')] () {
    this.refs.$layerList.$$('.selected').forEach(it => {
      it.removeClass('selected')
    })

    var selector = editor.selection.items.map(it => {
      return `[data-layer-id="${it.id}"]`
    }).join(',')

    this.refs.$layerList.$$(selector).forEach(it => {
      it.addClass('selected')
    })
  }  

  [EVENT(CHANGE_SELECTION, 'addElement')] () {
    this.refresh();
  }

}
