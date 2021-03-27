import { uuid } from "@sapa/functions/math";

export default class ItemRender {

  async render (item, renderer) {
    return await this.toCloneObject(item, renderer)
  }

  async toCloneObject (item, renderer) {
    var json = item.attrs(
      'itemType', 'elementType', 'type', 'visible', 'lock', 'selected'
    )

    json.referenceId = item.id; 
    json.newTargetId = uuid();

    let layers = []

    for(var i = 0, len = item.layers.length; i < len; i++) {
      layers.push(await renderer.render(item.layers[i], renderer));
    }

    json.layers = layers;

    return json; 
  }
}