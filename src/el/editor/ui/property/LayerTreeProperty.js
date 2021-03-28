import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, PREVENT, STOP, FOCUSOUT, DOMDIFF, DRAGSTART, KEYDOWN, DRAGOVER, DROP, BIND, DRAGEND, ENTER, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";


import Color from "el/base/Color";
import { Length } from "el/editor/unit/Length";
import { registElement } from "el/base/registerElement";

const DRAG_START_CLASS = 'drag-start'

export default class LayerTreeProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('layer.tree.property.title')
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

    bound.display = this.state.hideDragPointer ? 'none':  'block';

    return {
      style: bound
    }
  }

  //FIXME: 개별 객체가 아이콘을 리턴 할 수 있도록 구조를 맞춰보자. 
  getIcon (item) {
    // return '';

    if (item.isGroup && item.is('artboard') === false) {
      return icon.group
    }

    switch(item.itemType) {
    case 'artboard':
      return icon.artboard;
    case 'circle': 
      return icon.lens;
    case 'image': 
      return icon.image;
    case 'text': 
    case 'svg-text':
      return icon.title;    
    case 'svg-textpath':
      return icon.text_rotate;
    case 'svg-path': 
      return icon.pentool      
    case 'cube' : 
      return icon.cube;
    case 'cylinder':
      return icon.cylinder;
    default: 
      return icon.rect
    }
  }

  makeLayerList (parentObject, depth = 0) {
    if (!parentObject.layers) return '';

    const layers = parentObject.layers
    const data = []

    for(var last = layers.length - 1; last > -1; last-- ) {
      var layer = layers[last];
      var selected = this.$selection.check(layer) ? 'selected' : '';
      var hovered = this.$selection.checkHover(layer) ? 'hovered' : '';
      var name = layer.name; 

      if (layer.is('text')) {
        name = layer.text || layer.name 
      }
      var title = ''; 

      if (layer.hasLayout()) {
        title = this.$i18n('layer.tree.property.layout.title.' + layer.layout)
      }

      const isHide = layer.isTreeItemHide()
      const depthPadding = Length.px(depth * 24);

      data.push(/*html*/`        
        <div class='layer-item ${selected} ${hovered}' data-is-group="${layer.isGroup}" data-depth="${depth}" data-layout='${layer.layout}' data-layer-id='${layer.id}' data-is-hide="${isHide}"  draggable="true">
          <div class='detail'>
            <label data-layout-title='${title}' style='padding-left: ${depthPadding}' > 
              <div class='folder ${layer.collapsed ? 'collapsed' : ''}'>${icon.arrow_right}</div>
              <span class='icon' data-item-type="${layer.itemType}">${this.getIcon(layer)}</span> 
              <span class='name'>${name}</span>
            </label>
            <div class="tools">
              <button type="button" class="lock" data-lock="${layer.lock}" title='Lock'>${layer.lock ? icon.lock : icon.lock_open}</button>
              <button type="button" class="visible" data-visible="${layer.visible}" title='Visible'>${icon.visible}</button>
              <button type="button" class="remove" title='Remove'>${icon.remove2}</button>            
            </div>
          </div>
        </div>

        ${this.makeLayerList(layer, depth+1)}
      `)
    }

    return data.join(' ');
  }

  [SUBSCRIBE('refreshContent')] (arr) {
    this.refresh();
  }

  [LOAD("$layerList") + DOMDIFF]() {

    var project = this.$selection.currentProject;
    if (!project) return ''

    return this.makeLayerList(project, 0) + /*html*/`
      <div class='layer-item ' data-depth="0" data-is-last="true">
      </div>
    `
  }

  [DRAGSTART('$layerList .layer-item')] (e) {
    var layerId = e.$dt.attr('data-layer-id');
    e.$dt.addClass(DRAG_START_CLASS);
    e.dataTransfer.setData('layer/id', layerId);
    this.state.rootRect = this.refs.$layerList.rect()
    this.state.itemRect = e.$dt.rect();
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
    var targetLayerId = e.$dt.attr('data-layer-id') 
    // console.log({targetLayerId, x: e.offsetX, y: e.offsetY});

    this.state.lastDragOverItemId = targetLayerId;
    this.state.lastDragOverPosition = e.$dt.rect().top;
    this.state.lastDragOverOffset = e.offsetY;

    this.bindData('$dragPointer')

  }
  [DROP(`$layerList .layer-item:not(.${DRAG_START_CLASS})`)] (e) {
    var targetLayerId = e.$dt.attr('data-layer-id')
    var sourceLayerId = e.dataTransfer.getData('layer/id');

    if (targetLayerId === sourceLayerId) return; 
    var project = this.$selection.currentProject

    var targetItem = project.searchById(targetLayerId);
    var sourceItem = project.searchById(sourceLayerId);

    if (targetItem && targetItem.hasParent(sourceItem.id)) return; 

    switch(this.state.lastDragOverItemDirection) {
    case 'self': 
      targetItem.appendChildItem(sourceItem);
      break; 
    case 'before':
      targetItem.appendBefore(sourceItem);
      break; 
    case 'after':
      targetItem.appendAfter(sourceItem);
      break;       
    }

    this.$selection.select(sourceItem);

    this.setState({
      hideDragPointer: true 
    })

    this.emit('refreshAll')
  }

  [DOUBLECLICK('$layerList .layer-item')] (e) {
    this.startInputEditing(e.$dt.$('.name'))
  }



  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {


      var id = input.closest('layer-item').attr('data-layer-id');

      var project = this.$selection.currentProject;
      var item = project.searchById(id)
      if (item) {
        item.reset({
          name: text
        })

        if (item.is('artboard')) {
          this.emit('refreshArtBoardName', item.id, item.name)
        }
        
      }

    });    
  }

  [KEYDOWN('$layerList .layer-item .name') + ENTER + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  [FOCUSOUT('$layerList .layer-item .name') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  selectLayer(layer) {

    if (layer) {
      this.$selection.select(layer)
    }

    this.refresh()
    this.emit('refreshSelection');
  }

  addLayer (layer) {
    if (layer) {
      this.$selection.select(layer);

      this.emit('refreshArtboard')
    }
  }

  [CLICK('$add')] (e) {

    this.emit('newComponent', 'rect', {
      'background-color': Color.random(),
      width: Length.px(200),
      height: Length.px(100)
    });
  }

  [CLICK('$layerList .layer-item label .name')] (e) {

      var $item = e.$dt.closest('layer-item')
      $item.onlyOneClass('selected');

      var id = $item.attr('data-layer-id');
      var item = this.$selection.currentProject.searchById(id);
      this.$selection.select(item)

      this.emit('history.refreshSelection');   
  }

  [CLICK('$layerList .layer-item label .folder')] (e) {
    const project = this.$selection.currentProject;

    var $item = e.$dt.closest('layer-item')
    var id = $item.attr('data-layer-id');
    var item = project.searchById(id);

    item.reset({
      collapsed: !item.collapsed
    })

    this.refresh();

  }  

  [CLICK('$layerList .layer-item .visible')] (e) {
    var project = this.$selection.currentProject

      var $item = e.$dt.closest('layer-item')
      var id = $item.attr('data-layer-id');

      var item = project.searchById(id);      
      e.$dt.attr('data-visible', !item.visible);

      this.command('setAttribute', 'change visible for layer', {
        visible: !item.visible
      }, item.id)
  }

  [CLICK('$layerList .layer-item .remove')] (e) {
    var project = this.$selection.currentProject

      var $item = e.$dt.closest('layer-item')
      var id = $item.attr('data-layer-id');

      // 객체 지우기 command 로 만들어야 함 
      this.$selection.removeById(id);

      var item = project.searchById(id);   
      item.remove();
      
      this.refresh();

      this.emit('refreshArtboard');
  }  


  [CLICK('$layerList .layer-item .lock')] (e) {
    var project = this.$selection.currentProject
    var $item = e.$dt.closest('layer-item')
    var id = $item.attr('data-layer-id');

    var item = project.searchById(id);
    var lastLock = !item.lock;
    e.$dt.attr('data-lock', lastLock);

    if (lastLock) {
      this.$selection.removeById(id);
      this.emit('history.refreshSelection');         
    }

    this.command('setAttribute', 'change lock for layer', {
      lock: lastLock
    }, item.id)
  }


  [SUBSCRIBE('changeHoverItem')] () {
    this.refs.$layerList.$$('.hovered').forEach(it => {
      it.removeClass('hovered')
    })    


    if (this.$selection.hoverItems.length) {
      var selector = this.$selection.hoverItems.map(it => {
        return `[data-layer-id="${it.id}"]`
      }).join(',')
      this.refs.$layerList.$$(selector).forEach(it => {
        it.addClass('hovered')
      })
    }
  }


  [SUBSCRIBE('changeSelection')] (isSelection = false) {
    if (isSelection && this.refs.$layerList) {    
      this.refs.$layerList.$$('.selected').forEach(it => {
        it.removeClass('selected')
      })

      var selector = this.$selection.items.map(it => {
        return `[data-layer-id="${it.id}"]`
      }).join(',')

      if (selector) {
        this.refs.$layerList.$$(selector).forEach(it => {

          it.addClass('selected')

          var item = this.$selection.itemKeys[it.attr('data-layer-id')]
          if (item.is('svg-path', 'svg-polygon') ) {
            it.$('.icon').html(this.getIcon(item));
          }

        })
      }
    }
  }  

  [SUBSCRIBE('refreshSelection', 'history.refreshSelection')] () { 
    this.trigger('changeSelection', true)
  }

  [SUBSCRIBE('refreshStylePosition')] () { 
    this.trigger('changeSelection')
  }

  [SUBSCRIBE('refreshLayerTreeView')] () {
    this.refresh();
  }

  [SUBSCRIBE('changeItemLayout')] () {
    this.refresh();
  }


}


registElement({ LayerTreeProperty })