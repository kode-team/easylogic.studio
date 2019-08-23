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
  constructor() {

    this.project = null;
    this.artboard = null;
    this.items = [];
    this.itemKeys = {} 
  }

  initialize() {
    this.items = [];
    this.itemKeys = {} 
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

  get isEmpty () {
    return !this.length 
  }

  get length () {
    return this.items.length;
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

  get isRelative () {
    var item = this.items[0] || { }

    return item.position === 'relative'
  }

  select(...args) {
    this.items = (args || []).filter(it => !it.lock && it.isAbsolute); 

    this.itemKeys = {}
    this.items.forEach(it => {
      this.itemKeys[it.id] = it; 
    })

    this.setRectCache();
  }

  check (item) {
    return this.itemKeys[item.id]
  }

  get (id) {
    return this.itemKeys[id];
  }

  isArtBoard () {
    return this.items.length ?  this.current.is('artboard') : false;
  }

  empty () {
    this.select()
  }

  selectById(id) {
    this.select(... _traverse(this.artboard, id))
  }

  setRectCache (isCache = true) {
    
    this.cachedItems = this.items.map(it => {
      // Layer 마다 캐쉬 할게 있으면 캐쉬 하고 
      if (isCache) it.setCache();
      // 최종 결과물을 clone 한다. 
      // 이렇게 하는 이유는 복합 객체의 넓이 , 높이르 바꿀 때 실제 path 의 각각의 point 도 바뀌어야 하기 때문이다. 
      return it.clone()
    })

    this.setAllRectCache();
  }

  setAllRectCache () {

    var minX = Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;

    var maxX = Number.MIN_SAFE_INTEGER;    
    var maxY = Number.MIN_SAFE_INTEGER;

    this.cachedItems.forEach(it => {
      minX = Math.min(it.screenX.value, minX);
      minY = Math.min(it.screenY.value, minY);

      maxX = Math.max(it.screenX2.value, maxX);
      maxY = Math.max(it.screenY2.value, maxY);      
    })

    if (minX === Number.MAX_SAFE_INTEGER) minX = 0;
    if (minY === Number.MAX_SAFE_INTEGER) minY = 0;
    if (maxX === Number.MIN_SAFE_INTEGER) maxX = 0;
    if (maxY === Number.MIN_SAFE_INTEGER) maxY = 0;

    this.allRect = new MovableItem({
      x: Length.px(minX),
      y: Length.px(minY),
      width: Length.px(maxX - minX),
      height: Length.px(maxY - minY)
    })

  }

  each (callback) {

    if ( isFunction(callback)) {
      this.items.forEach( (item, index) => {
        callback (item, this.cachedItems[index]);
      })
    }

  }

  reset (obj) {
    this.each(item => item.reset(obj))
  }

  resize () {
    this.each(item => item.resize());
  }

  remove () {
    this.each(item => item.remove())
    this.empty();
  }

  copy () {
    this.copyItems = this.items.map(item => item)
  }  

  paste() {
    this.select(...this.copyItems.map(item => item.copy()));
    this.copy()
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
