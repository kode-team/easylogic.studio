import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ThreeRenderView.scss';
import { SUBSCRIBE } from 'el/sapa/Event';

export default class ThreeRenderView extends EditorElement {

    afterRender() {

        setTimeout(() => {
            this.refresh();
        }, 100);

    }

    renderCanvas(time) {

        this.renderer.render( this.$sceneManager.scene, this.$sceneManager.viewportCamera );
    }

    refresh() {

        const rect = this.refs.$view.offsetRect();       
        
        if (!this.renderer) {
            const renderer = new THREE.WebGLRenderer( { 
                canvas: this.refs.$view.el, antialias: true ,
                
            } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( rect.width, rect.height );


            const controls = new OrbitControls( this.$sceneManager.viewportCamera, renderer.domElement );
            controls.addEventListener( 'change', () => {
                this.refreshCanvas();
            } );

            this.renderer = renderer;
        }

        this.renderCanvas(20);

    }

    refreshCanvasSize() {

        this.$sceneManager.camera.aspect = rect.width / rect.height;
        this.$sceneManager.camera.updateProjectionMatrix();                

        const rect = this.refs.$view.offsetRect();
        this.renderer.setSize( rect.width, rect.height );

    }

    [SUBSCRIBE('objectAdded')] () {
        this.renderCanvas(0);
    }

    [SUBSCRIBE('resize.window', 'resizeCanvas')]() {
        this.refreshCanvasSize();
    }
    

    /** template */
    template() {
        return /*html*/`
            <div class='elf--element-view' ref='$body'>
                <canvas class='canvas-view' ref='$view'></canvas>
                ${this.$injectManager.generate("render.view")}
            </div>
        `
    }

}