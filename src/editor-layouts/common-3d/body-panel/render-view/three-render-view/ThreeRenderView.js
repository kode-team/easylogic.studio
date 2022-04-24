import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./ThreeRenderView.scss";
import { SUBSCRIBE } from "sapa";

export default class ThreeRenderView extends EditorElement {
  afterRender() {
    window.setTimeout(() => {
      this.refresh();
    }, 100);
  }

  renderCanvas() {
    // console.log(this.$sceneManager.scene.children);

    // console.log(this.$sceneManager.viewportCamera);
    // this.$sceneManager.scene.add(this.grid);

    this.renderer.render(
      this.$sceneManager.scene,
      this.$sceneManager.viewportCamera
    );
    // this.$sceneManager.scene.remove(this.grid);

    // console.log(this.$sceneManager.sceneHelpers.children);
    // this.renderer.render(this.$sceneManager.sceneHelpers, this.$sceneManager.viewportCamera);
  }

  initializeCamera(rect) {
    const camera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.x = 1;
    camera.position.y = 3;
    camera.position.z = 1;
    // camera.translateZ(5);
    // camera.rotateZ(10);
    // camera.rotateX();

    // transform origin
    camera.lookAt(0, 0, 0);

    this.$sceneManager.camera = camera;
    this.$sceneManager.addCamera(camera);
    this.$sceneManager.setViewportCamera(camera.uuid);
  }

  initializeRenderer() {
    const rect = this.refs.$view.offsetRect();
    // const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera( 75, rect.width / rect.height, 0.1, 1000 );

    // const renderer = new THREE.WebGLRenderer({
    //     antialias: true,
    //     canvas: this.refs.$view.el
    // });
    // renderer.setSize( rect.width, rect.height );

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // camera.position.z = 5;

    // function animate() {
    //     // requestAnimationFrame( animate );

    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;

    //     renderer.render( scene, camera );
    // };

    // animate();

    // return;

    // console.log(rect);

    this.state.rect = rect;

    this.initializeCamera(rect);

    // camera.position.z = 5;

    // this.$sceneManager.viewportCamera.aspect = rect.width / rect.height;
    // this.$sceneManager.viewportCamera.updateProjectionMatrix();

    console.log(this.$sceneManager.viewportCamera);

    const renderer = new THREE.WebGLRenderer({
      canvas: this.refs.$view.el,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(rect.width, rect.height);
    // renderer.setViewport( 0, 0, rect.width, rect.height );
    // renderer.setAnimationLoop(animate);
    // renderer.setClearColor(0xaaaaaa);

    const controls = new OrbitControls(
      this.$sceneManager.viewportCamera,
      this.refs.$body.el
    );
    controls.addEventListener("change", () => {
      this.renderCanvas();
    });

    // // helpers

    const grid = new THREE.Group();

    const grid1 = new THREE.GridHelper(30, 30, 0x888888, "yellow");
    grid1.material.color.setHex(0x888888);
    grid1.material.vertexColors = false;
    grid.add(grid1);

    const grid2 = new THREE.GridHelper(30, 6, 0x222222, "white");
    grid2.material.color.setHex(0x222222);
    grid2.material.depthFunc = THREE.AlwaysDepth;
    grid2.material.vertexColors = false;
    grid.add(grid2);

    this.grid = grid;
    this.$sceneManager.addObject(this.grid, undefined, undefined, false);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    this.$sceneManager.scene.add(light);

    const box = new THREE.Box3();

    const selectionBox = new THREE.Box3Helper(box);
    selectionBox.material.depthTest = false;
    selectionBox.material.transparent = true;
    selectionBox.visible = false;
    this.$sceneManager.sceneHelpers.add(selectionBox);

    let objectPositionOnDown = null;
    let objectRotationOnDown = null;
    let objectScaleOnDown = null;

    const transformControls = new TransformControls(
      this.$sceneManager.viewportCamera,
      this.refs.$view.el
    );
    this.transformControls = transformControls;
    transformControls.addEventListener("change", () => {
      // const object = transformControls.object;

      // if (object !== undefined) {

      //     box.setFromObject(object, true);

      //     const helper = this.$sceneManager.helpers[object.id];

      //     if (helper !== undefined && helper.isSkeletonHelper !== true) {

      //         helper.update();

      //     }

      //     this.emit('refreshSidebarObject3D', object);
      // }

      this.renderCanvas();
    });
    transformControls.addEventListener("mouseDown", () => {
      const object = transformControls.object;

      objectPositionOnDown = object.position.clone();
      objectRotationOnDown = object.rotation.clone();
      objectScaleOnDown = object.scale.clone();

      controls.enabled = false;
    });
    transformControls.addEventListener("mouseUp", () => {
      const object = transformControls.object;

      if (object !== undefined) {
        switch (transformControls.getMode()) {
          case "translate":
            if (!objectPositionOnDown.equals(object.position)) {
              this.emit(
                "SetPosition",
                object,
                object.position,
                objectPositionOnDown
              );
            }

            break;

          case "rotate":
            if (!objectRotationOnDown.equals(object.rotation)) {
              this.emit(
                "SetRotation",
                object,
                object.rotation,
                objectRotationOnDown
              );
            }

            break;

          case "scale":
            if (!objectScaleOnDown.equals(object.scale)) {
              this.emit("SetScale", object, object.scale, objectScaleOnDown);
            }

            break;
        }
      }

      controls.enabled = true;
    });

    this.$sceneManager.scene.add(transformControls);

    return renderer;
  }

  refresh() {
    if (!this.renderer) {
      const renderer = this.initializeRenderer();

      console.log(renderer);

      this.renderer = renderer;
    }

    const self = this;
    function animate(time) {
      // requestAnimationFrame(animate);

      // console.log(self);
      self.renderCanvas(time);
    }

    animate(0);
  }

  refreshCanvasSize() {
    const rect = this.refs.$view.offsetRect();

    this.state.rect = rect;

    this.$sceneManager.viewportCamera.aspect = rect.width / rect.height;
    this.$sceneManager.viewportCamera.updateProjectionMatrix();

    this.renderer.setSize(rect.width, rect.height);

    this.renderCanvas(0);
  }

  [SUBSCRIBE("objectSelected")]() {
    this.transformControls.attach(this.$sceneManager.selected);
  }

  [SUBSCRIBE("objectAdded")]() {
    this.renderCanvas(0);
  }

  [SUBSCRIBE("resize.window", "resizeCanvas")]() {
    console.log("resize");
    this.refreshCanvasSize();
  }

  /** template */
  template() {
    return /*html*/ `
            <div class='elf--element-three-view' ref='$body'>
                <canvas class='canvas-view' ref='$view'></canvas>
                ${this.$injectManager.generate("render.view")}
            </div>
        `;
  }
}
