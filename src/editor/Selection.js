import { isFunction } from "../util/functions/func";
import { Length } from "./unit/Length";
import { MovableItem } from "./items/MovableItem";



const roundedLength = (px, fixedRound = 1) => {
  return Length.px(px).round(fixedRound);
}

function _traverse(obj, id) {
  var results = [] 

  obj.layers.length && obj.layers.forEach(it => {
    results.push(..._traverse(it, id));
  })

  if (obj.id === id) {
    results.push(obj);
  }

  return results; 
}

export class Selection {
  constructor(editor) {
    this.editor = editor;

    this.project = null;
    this.artboard = null;
    this.items = [];
  }

  initialize() {
    this.items = [];
  }

  /**
   * get first item instance
   */
  get current() {
    return this.items[0]
  }

  get currentProject () {
    return this.project;
  }

  get currentArtboard () {
    return this.artboard;
  }

  selectProject (project) {
    this.project = project;
    this.artboard = null;
    if (this.project.artboards.length) {
      this.selectArtboard(this.project.artboards[0]);
    }
  }

  selectArtboard (artboard) {
    this.artboard = artboard;

    this.items = [];
    if (this.artboard.layers.length) {
      this.select(this.artboard.layers[0]);
    }

  }

  select(...args) {
    this.items = (args || []).filter(it => !it.lock); 

    this.itemKeys = {}
    this.items.forEach(it => {
      this.itemKeys[it.id] = true; 
    })

    this.setRectCache();
  }

  check (item) {
    return this.itemKeys[item.id]
  }

  empty () {
    this.select()
  }

  selectById(id) {


    this.select(... _traverse(this.artboard, id))
  }

  setRectCache () {
    this.cachedItems = this.items.map(it => it.toBound())

    this.setAllRectCache();
  }

  setAllRectCache () {

    var minX = Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;

    var maxX = Number.MIN_SAFE_INTEGER;    
    var maxY = Number.MIN_SAFE_INTEGER;

    this.cachedItems.forEach(it => {
      if (it.x.value < minX) { minX = it.x.value; }
      if (it.y.value < minY) { minY = it.y.value; }
      if (it.x2.value > maxX) { maxX = it.x2.value; }
      if (it.y2.value > maxY) { maxY = it.y2.value; }
    })

    this.allRect = new MovableItem({
      x: Length.px(minX),
      y: Length.px(minY),
      width: Length.px(maxX - minX),
      height: Length.px(maxY - minY),
      x2: Length.px(maxX),
      y2: Length.px(maxY)
    })
  }

  each (callback) {

    if ( isFunction(callback)) {
      this.items.forEach( (item, index) => {
        callback (item, this.cachedItems[index]);
      })
    }

  }

  move (dx, dy) {
    this.each ((item, cachedItem, ) => {
      item.move( 
        roundedLength(cachedItem.x.value + dx),
        roundedLength(cachedItem.y.value + dy)
      )
    })
  }

  moveRight (dx) {
    this.each ((item, cachedItem, ) => {
      item.resizeWidth(roundedLength(cachedItem.width.value + dx))
    })
  }

  moveLeft (dx) {
    this.each ((item, cachedItem, ) => {
      if (cachedItem.width.value - dx >= 0) {
          item.moveX( roundedLength(cachedItem.x.value + dx) )
          item.resizeWidth( roundedLength(cachedItem.width.value - dx) )
      }
    })    
  }

  moveBottom (dy) {
    this.each ((item, cachedItem, ) => {
      item.resizeHeight( roundedLength(cachedItem.height.value + dy) )
    })    
  }

  moveTop (dy) {
    this.each ((item, cachedItem, ) => {
      if ( cachedItem.height.value - dy >= 0 ) {
          item.moveY( roundedLength(cachedItem.y.value + dy) )                                
          item.resizeHeight( roundedLength(cachedItem.height.value - dy) )    
      }
    })
  }
}
