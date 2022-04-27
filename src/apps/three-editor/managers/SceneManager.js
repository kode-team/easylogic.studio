import * as THREE from "three";

import { isArray } from "sapa";

var _DEFAULT_CAMERA = new THREE.PerspectiveCamera(3, 1, 0.01, 1000);
_DEFAULT_CAMERA.name = "Camera";
_DEFAULT_CAMERA.position.set(0, 5, 10);
_DEFAULT_CAMERA.lookAt(new THREE.Vector3());

/**
 * 렌더링 객체를 관리하는 자료구조입니다.
 *
 */
export class SceneManager {
  constructor(editor) {
    this.editor = editor;

    this.camera = _DEFAULT_CAMERA.clone();

    this.scene = new THREE.Scene();
    this.scene.name = "Scene";

    this.sceneHelpers = new THREE.Scene();

    this.object = {};
    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.scripts = {};

    this.materialsRefCounter = new Map(); // tracks how often is a material used by a 3D object

    this.mixer = new THREE.AnimationMixer(this.scene);

    this.selected = null;
    this.helpers = {};

    this.cameras = {};
    this.viewportCamera = this.camera;

    this.addCamera(this.camera);
  }

  emit(event, ...args) {
    this.editor.emit(event, ...args);
  }

  setScene(scene) {
    this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;

    this.scene.background = scene.background;
    this.scene.environment = scene.environment;
    this.scene.fog = scene.fog;

    this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

    // avoid render per object

    while (scene.children.length > 0) {
      // emit 하지 않고 객체 추가하기
      this.addObject(scene.children[0], undefined, undefined, false);
    }

    this.emit("sceneChanged", this.scene);
  }

  // eslint-disable-next-line no-unused-vars
  addObject(object, parent, index, hasEmit = true) {
    object.traverse((child) => {
      if (child.geometry !== undefined) this.addGeometry(child.geometry);
      if (child.material !== undefined) this.addMaterial(child.material);

      this.addCamera(child);
      this.addHelper(child);
    });

    if (parent === undefined) {
      this.scene.add(object);
    } else {
      parent.children.splice(index, 0, object);
      object.parent = parent;
    }

    this.emit("objectAdded", object);
    this.emit("sceneGraphChanged");
  }

  moveObject(object, parent, before) {
    if (parent === undefined) {
      parent = this.scene;
    }

    parent.add(object);

    // sort children array

    if (before !== undefined) {
      var index = parent.children.indexOf(before);
      parent.children.splice(index, 0, object);
      parent.children.pop();
    }

    this.emit("sceneGraphChanged");
  }

  nameObject(object, name) {
    object.name = name;
    this.emit("sceneGraphChanged");
  }

  removeObject(object) {
    if (object.parent === null) return; // avoid deleting the camera or scene

    object.traverse((child) => {
      this.removeCamera(child);
      this.removeHelper(child);

      if (child.material !== undefined) this.removeMaterial(child.material);
    });

    object.parent.remove(object);

    this.emit("objectRemoved", object);
    this.emit("sceneGraphChanged");
  }

  addGeometry(geometry) {
    this.geometries[geometry.uuid] = geometry;
  }

  setGeometryName(geometry, name) {
    geometry.name = name;
    this.emit("sceneGraphChanged");
  }

  addMaterial(material) {
    if (isArray(material)) {
      for (var i = 0, l = material.length; i < l; i++) {
        this.addMaterialToRefCounter(material[i]);
      }
    } else {
      this.addMaterialToRefCounter(material);
    }

    this.emit("materialAdded");
  }

  addMaterialToRefCounter(material) {
    var materialsRefCounter = this.materialsRefCounter;

    var count = materialsRefCounter.get(material);

    if (count === undefined) {
      materialsRefCounter.set(material, 1);
      this.materials[material.uuid] = material;
    } else {
      count++;
      materialsRefCounter.set(material, count);
    }
  }

  removeMaterial(material) {
    if (isArray(material)) {
      for (var i = 0, l = material.length; i < l; i++) {
        this.removeMaterialFromRefCounter(material[i]);
      }
    } else {
      this.removeMaterialFromRefCounter(material);
    }

    this.emit("materialRemoved");
  }

  removeMaterialFromRefCounter(material) {
    var materialsRefCounter = this.materialsRefCounter;

    var count = materialsRefCounter.get(material);
    count--;

    if (count === 0) {
      materialsRefCounter.delete(material);
      delete this.materials[material.uuid];
    } else {
      materialsRefCounter.set(material, count);
    }
  }

  getMaterialById(id) {
    return Object.values(this.materials).find((m) => m.id === id);
  }

  setMaterialName(material, name) {
    material.name = name;
    this.emit("sceneGraphChanged");
  }

  addTexture(texture) {
    this.textures[texture.uuid] = texture;
  }

  addCamera(camera) {
    if (camera.isCamera) {
      this.cameras[camera.uuid] = camera;

      this.emit("cameraAdded", camera);
    }
  }

  removeCamera(camera) {
    if (this.cameras[camera.uuid] !== undefined) {
      delete this.cameras[camera.uuid];

      this.emit("cameraRemoved", camera);
    }
  }

  addHelper(object, helper) {
    var geometry = new THREE.SphereGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      visible: false,
    });

    if (helper === undefined) {
      if (object.isCamera) {
        helper = new THREE.CameraHelper(object);
      } else if (object.isPointLight) {
        helper = new THREE.PointLightHelper(object, 1);
      } else if (object.isDirectionalLight) {
        helper = new THREE.DirectionalLightHelper(object, 1);
      } else if (object.isSpotLight) {
        helper = new THREE.SpotLightHelper(object);
      } else if (object.isHemisphereLight) {
        helper = new THREE.HemisphereLightHelper(object, 1);
      } else if (object.isSkinnedMesh) {
        helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
      } else if (object.isBone === true && object.parent?.isBone !== true) {
        helper = new THREE.SkeletonHelper(object);
      } else {
        // no helper for this object type
        return;
      }

      const picker = new THREE.Mesh(geometry, material);
      picker.name = "picker";
      picker.userData.object = object;
      helper.add(picker);
    }

    this.sceneHelpers.add(helper);
    this.helpers[object.id] = helper;

    this.emit("helperAdded", helper);
  }

  removeHelper(object) {
    if (this.helpers[object.id] !== undefined) {
      var helper = this.helpers[object.id];
      helper.parent.remove(helper);

      delete this.helpers[object.id];

      this.emit("helperRemoved", helper);
    }
  }

  addScript(object, script) {
    if (this.scripts[object.uuid] === undefined) {
      this.scripts[object.uuid] = [];
    }

    this.scripts[object.uuid].push(script);

    this.emit("scriptAdded", script);
  }

  removeScript(object, script) {
    if (this.scripts[object.uuid] === undefined) return;

    var index = this.scripts[object.uuid].indexOf(script);

    if (index !== -1) {
      this.scripts[object.uuid].splice(index, 1);
    }

    this.emit("scriptRemoved", script);
  }

  getObjectMaterial(object, slot) {
    var material = object.material;

    if (isArray(material) && slot !== undefined) {
      material = material[slot];
    }

    return material;
  }

  setObjectMaterial(object, slot, newMaterial) {
    if (isArray(object.material) && slot !== undefined) {
      object.material[slot] = newMaterial;
    } else {
      object.material = newMaterial;
    }
  }

  setViewportCamera(uuid) {
    this.viewportCamera = this.cameras[uuid];

    this.emit("viewportCameraChanged");
  }

  select(object) {
    if (this.selected === object) return;

    var uuid = null;

    if (object !== null) {
      uuid = object.uuid;
    }

    this.selected = object;

    this.editor.config.set("selected", uuid);
    this.emit("objectSelected", object);
  }

  selectById(id) {
    if (id === this.camera.id) {
      this.select(this.camera);
      return;
    }

    this.select(this.scene.getObjectById(id));
  }

  selectByUuid(uuid) {
    this.scene.traverse((child) => {
      if (child.uuid === uuid) {
        this.select(child);
      }
    });
  }

  deselect() {
    this.select(null);
  }

  focus(object) {
    if (object !== undefined) {
      this.emit("objectFocused", object);
    }
  }

  focusById(id) {
    this.focus(this.scene.getObjectById(id));
  }

  clear() {
    this.camera.copy(_DEFAULT_CAMERA);
    this.emit("cameraChanged");

    this.scene.name = "Scene";
    this.scene.userData = {};
    this.scene.background = null;
    this.scene.environment = null;
    this.scene.fog = null;

    var objects = this.scene.children;

    while (objects.length > 0) {
      this.removeObject(objects[0]);
    }

    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.scripts = {};

    this.materialsRefCounter.clear();

    this.animations = {};
    this.mixer.stopAllAction();

    this.deselect();

    this.emit("editorCleared");
  }

  async fromJSON(json) {
    var loader = new THREE.ObjectLoader();
    var camera = await loader.parseAsync(json.camera);

    this.camera.copy(camera);

    this.emit("cameraResetted");

    this.scripts = json.scripts;

    this.setScene(await loader.parseAsync(json.scene));
  }

  toJSON() {
    // scripts clean up

    var scene = this.scene;
    var scripts = this.scripts;

    for (var key in scripts) {
      var script = scripts[key];

      if (
        script.length === 0 ||
        scene.getObjectByProperty("uuid", key) === undefined
      ) {
        delete scripts[key];
      }
    }

    //

    return {
      metadata: {},
      project: {
        shadows: this.editor.config.get("project/renderer/shadows"),
        shadowType: this.editor.config.get("project/renderer/shadowType"),
        vr: this.editor.config.get("project/vr"),
        physicallyCorrectLights: this.editor.config.get(
          "project/renderer/physicallyCorrectLights"
        ),
        toneMapping: this.editor.config.get("project/renderer/toneMapping"),
        toneMappingExposure: this.editor.config.get(
          "project/renderer/toneMappingExposure"
        ),
      },
      camera: this.camera.toJSON(),
      scene: this.scene.toJSON(),
      scripts: this.scripts,
    };
  }

  objectByUuid(uuid) {
    return this.scene.getObjectByProperty("uuid", uuid, true);
  }
}
