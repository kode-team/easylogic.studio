import { isFunction } from "../util/functions/func";


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

    this.setRectCache();
  }

  check (item) {
    return this.items.includes(item);
  }

  empty () {
    this.select()
  }

  selectById(id) {


    this.select(... _traverse(this.artboard, id))
  }

  setRectCache () {
    this.cachedItems = this.items.map(it => it.toBound())
  }

  each (callback) {

    if ( isFunction(callback)) {
      this.items.forEach( (item, index) => {
        callback (item, this.cachedItems[index]);
      })
    }

  }
}
