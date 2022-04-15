import * as THREE  from 'three';

import { Editor } from "el/editor/manager/Editor";
/**
 * 
 * @param {Editor} editor 
 */
export default function addCubeBox (editor) {

    const geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xf0fff0 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.name = 'Box';

    mesh.position.y = 0.5;

    editor.sceneManager.addObject( mesh );
    editor.sceneManager.select( mesh );

}