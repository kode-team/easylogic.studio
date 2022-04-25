import { isObject, isString } from "sapa";

import AssetParser from "elf/editor/parser/AssetParser";

export class AssetManager {
  constructor(editor) {
    this.$editor = editor;
  }

  get project() {
    return this.$editor.selection.currentProject;
  }

  /**
   *
   * recover origin to local blob url for Asset
   *
   * @param {string} value JSON String for project list
   */
  revokeResource(value) {
    var json = JSON.parse(value || "[]");
    var assets = {};

    json.forEach((project) => {
      project.images.forEach((it) => {
        assets[`#${it.id}`] = it;
      });
    });

    Object.keys(assets).map((idString) => {
      var a = assets[idString];
      var info = AssetParser.parse(a.original, true);
      a.local = info.local;
    });

    json.forEach((project) => {
      project.layers = this.applyAsset(project.layers, assets);
    });

    return json;
  }

  applyAsset(json, assets) {
    if (Array.isArray(json)) {
      json = json.map((it) => this.applyAsset(it, assets));
    } else if (isObject(json)) {
      Object.keys(json).forEach((key) => {
        json[key] = this.applyAsset(json[key], assets);
      });
    } else if (isString(json)) {
      Object.keys(assets).forEach((idString) => {
        var a = assets[idString];
        if (json.indexOf(`#${a.id}`) > -1) {
          json = json.replace(new RegExp(`#${a.id}`, "g"), a.local);
        }
      });
    }

    return json;
  }
}
