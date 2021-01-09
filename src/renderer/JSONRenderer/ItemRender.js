export default class ItemRender {

  async render (item, renderer) {
    return await this.toCloneObject(item, renderer)
  }

  async toCloneObject (item, renderer) {
    var json = item.attrs(
      'itemType', 'elementType', 'type', 'visible', 'lock', 'selected'
    )

    json.layers = await Promise.all(item.layers.map(async (layer) => await renderer.render(layer, renderer)))

    return json; 
  }
}