import * as THREE  from 'three';

import { Editor } from "el/editor/manager/Editor";
/**
 * 
 * @param {Editor} editor 
 */
export default function addCubeBox (editor) {

    const geometry = new THREE.CircleGeometry( 1, 8, 0, Math.PI * 2 );
		const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xf000ff),
        }) );
		mesh.name = 'Circle';

    editor.sceneManager.addObject( mesh );
    editor.sceneManager.select( mesh );

}