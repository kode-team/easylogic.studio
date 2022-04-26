import { LOAD, DOMDIFF, SUBSCRIBE } from "sapa";

import "./ViewportHelper.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class ViewportHelper extends EditorElement {
  template() {
    return <div class="elf--viewport-helper"></div>;
  }

  [LOAD("$el") + DOMDIFF]() {
    const scene = this.$sceneManager.scene;

    let objects = 0,
      vertices = 0,
      triangles = 0;

    for (let i = 0, l = scene.children.length; i < l; i++) {
      const object = scene.children[i];

      object.traverseVisible(function (object) {
        objects++;

        if (object.isMesh) {
          const geometry = object.geometry;

          vertices += geometry.attributes.position.count;

          if (geometry.index !== null) {
            triangles += geometry.index.count / 3;
          } else {
            triangles += geometry.attributes.position.count / 3;
          }
        }
      });
    }

    return /*html*/ `
      <div class="viewport-info">
          objects: ${objects}, 
          vertices: ${vertices},
          triangles: ${triangles}
      </div>
    `;
  }

  [SUBSCRIBE("objectAdded", "objectRemoved", "geometryChanged")]() {
    this.refresh();
  }
}
