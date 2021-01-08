export default class ItemRender {

  render (item, renderer) {
    return this.toCloneObject(item, renderer)
  }

  toCloneObject (item, renderer) {
    var json = item.attrs(
      'itemType', 'elementType', 'type', 'visible', 'lock', 'selected'
    )

    json.layers = item.layers.map(layer => renderer.render(layer, renderer))

    return json; 
  }
}