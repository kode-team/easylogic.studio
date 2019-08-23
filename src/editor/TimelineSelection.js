export class TimelineSelection {
  constructor(editor) {
    this.editor = editor;
    this.items = [];
    this.itemKeys = {} 
  }

  initialize() {
    this.items = [];
    this.itemKeys = {} 
  }

  currentArtBoard (callback) {
    var artboard = this.editor.selection.currentArtBoard;

    if (artboard) {
      callback && callback (artboard);
    }
  }

  refreshCache (list) {
    this.items = list.map(it => it.id);
    this.itemKeys = {} 

    list.forEach(it => {
      this.itemKeys[it.id] = it; 
    })
  }

  checked (id) {
    return !!this.itemKeys[id]
  }

  selectLayer (layerId) {

    this.currentArtBoard(artboard => {
      var list = artboard.keyframes.filter(it => it.layerId === layerId).map(it => it.id);
      this.refreshCache(list);
    })
  }

  selectProperty (layerId, property) {
    this.currentArtBoard(artboard => {
      var list = artboard.keyframes.filter(it => {
        return it.layerId === layerId && it.property === property;
      })

      this.refreshCache(list);
    })
  }  

  select (...args) {
    this.refreshCache(args);
  }


  checkLayer (layerId) {
    return Object.keys(this.itemKeys).some(key => {
      return this.itemKeys[key].layerId === layerId
    })
  }

  checkProperty (layerId, property) {
    return Object.keys(this.itemKeys).some(key => {
      return this.itemKeys[key].layerId === layerId && this.itemKeys[key].property === property
    })
  }  
}
