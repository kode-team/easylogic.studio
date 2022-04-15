import { EditorElement } from "el/editor/ui/common/EditorElement";
import "./ViewportHelper.scss";
import { LOAD } from 'el/sapa/Event';
import { DOMDIFF } from 'el/sapa/Event';
import { SUBSCRIBE } from 'el/sapa/Event';

export default class ViewportHelper extends EditorElement {
  template() {
    return <div class="elf--viewport-helper"></div>;
  }

  [LOAD('$el') + DOMDIFF]() {

    const scene = this.$sceneManager.scene;

		let objects = 0, vertices = 0, triangles = 0;

		for ( let i = 0, l = scene.children.length; i < l; i ++ ) {

			const object = scene.children[ i ];

			object.traverseVisible( function ( object ) {

				objects ++;

				if ( object.isMesh ) {

					const geometry = object.geometry;

					vertices += geometry.attributes.position.count;

					if ( geometry.index !== null ) {

						triangles += geometry.index.count / 3;

					} else {

						triangles += geometry.attributes.position.count / 3;

					}

				}

			} );

		}

    return /*html*/`
      <div class="viewport-info">
          objects: ${objects}, 
          vertices: ${vertices},
          triangles: ${triangles}
      </div>
    `
  }

  [SUBSCRIBE('objectAdded', 'objectRemoved', 'geometryChanged')] () {
    this.refresh();
  }

}
