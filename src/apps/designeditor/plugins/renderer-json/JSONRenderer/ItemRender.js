import { uuid } from "elf/core/math";

export default class ItemRender {
  async render(item, renderer) {
    return await this.toCloneObject(item, renderer);
  }

  async toCloneObject(item, renderer) {
    var json = item.attrs(
      "itemType",
      "name",
      "elementType",
      "type",
      "visible",
      "lock",
      "selected"
    );

    // parent가 project 가 아니면 parentId 를 넣어준다.
    if (item.parent && item.parent.isNot("project")) {
      json.parentId = item.parentId;
    }

    json.referenceId = item.id;
    json.newTargetId = uuid();

    let layers = [];

    for (var i = 0, len = item.layers.length; i < len; i++) {
      layers.push(await renderer.render(item.layers[i], renderer));
    }

    json.layers = layers;

    return json;
  }
}
