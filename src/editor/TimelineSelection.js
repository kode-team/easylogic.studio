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
    var artboard = this.editor.selection.currentArtboard;

    if (artboard) {
      callback && callback (artboard);
    }
  }

  empty () {
    this.select();
  }

  each (callback) {
    this.items.forEach((item, index) => {
      callback && callback(item, index)
    })
  }

  refreshCache (list) {
    this.items = list;
    this.itemKeys = {} 

    this.items.forEach(it => {
      this.itemKeys[it.id] = it; 
    })
  }

  cachedList () {
    return this.items.map(it => {
      return {...it}
    })
  }

  checked (id) {
    return !!this.itemKeys[id]
  }

  selectLayer (layerId) {

    this.currentArtBoard(artboard => {
      var list = artboard.getKeyframeListReturnArray().filter(it => {
        return it.layerId === layerId
      })
      this.refreshCache(list);
    })
  }

  toggleLayerContainer (animationId) {

    this.currentArtBoard(artboard => {
      artboard.getSelectedTimeline().animations.filter(it => {
        return it.id === animationId
      }).forEach(it => {
        it.collapsed = !it.collapsed
      })
    })
  }  

  selectProperty (layerId, property) {
    this.currentArtBoard(artboard => {
      var list = artboard.getKeyframeListReturnArray().filter(it => {
        return it.layerId === layerId && it.property === property;
      })

      this.refreshCache(list);
    })
  }  

  select (...args) {
    this.refreshCache(args);
  }

  selectBySearch (list, startTime, endTime) {
    this.currentArtBoard(artboard => {

      var totalList = []

      list.forEach(it => {
        var results = []  
        if (it.property) {

          var p = artboard.getTimelineProperty(it.layerId, it.property)

          results = p.keyframes.filter(keyframe => {
            return startTime <= keyframe.time && keyframe.time <= endTime; 
          })
        } else {

          var p = artboard.getTimelineObject(it.layerId)

          p.properties.filter(property => {
            return property.property === it.property
          }).forEach(property => {
            results.push(...property.keyframes.filter(keyframe => {
              return startTime <= keyframe.time && keyframe.time <= endTime; 
            }))
          }) 
        }

        totalList.push(...results);

      })

      var uniqueOffset = {}
      totalList.forEach(it => {
        uniqueOffset[it.id] = it; 
      })

      this.select(...Object.values(uniqueOffset))
    })
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
