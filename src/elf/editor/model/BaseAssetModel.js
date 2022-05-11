import { Keyframe } from "../property-parser/Keyframe";
import { BaseModel } from "./BaseModel";

import { uuidShort } from "elf/core/math";

export class BaseAssetModel extends BaseModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      svgfilters: [],
      keyframes: [],
      ...obj,
    });
  }

  get keyframes() {
    return this.get("keyframes");
  }

  get svgfilters() {
    return this.get("svgfilters");
  }

  addKeyframe(keyframe) {
    this.keyframes.push(keyframe);
    return keyframe;
  }

  createKeyframe(data = {}) {
    return this.addKeyframe(
      new Keyframe({
        checked: true,
        ...data,
      })
    );
  }

  removeKeyframe(removeIndex) {
    this.removePropertyList(this.keyframes, removeIndex);
  }

  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortKeyframe(startIndex, targetIndex) {
    this.sortItem(this.keyframes, startIndex, targetIndex);
  }

  updateKeyframe(index, data = {}) {
    this.keyframes[+index].reset(data);
  }

  /**
   * `@keyframes` 문자열만 따로 생성
   */
  toKeyframeString(isAnimate = false) {
    return this.keyframes
      .map((keyframe) => keyframe.toString(isAnimate))
      .join("\n\n");
  }

  // 모든 Assets 은  JSON 포맷만가진다. 따로 문자열화 하지 않는다.
  // {color, name, variable}
  // {gradient,name,variable}
  // {filters: [],id,name}
  // {mimeType, original(data or url), local, name}

  // 파싱은
  // var asset = AssetParser.parse(data);
  // asset.color, name, variable

  copyPropertyList(arr, index) {
    var copyObject = { ...arr[index] };
    arr.splice(index, 0, copyObject);
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("svgfilters", "keyframes"),
  //   };
  // }

  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }

  /* svg filters  */

  getSVGFilterIndex(id) {
    var filter = this.svgfilters
      .map((it, index) => {
        return { id: it.id, index };
      })
      .filter((it) => {
        return it.id === id;
      });

    return filter.length ? filter?.[0]?.index : -1;
  }

  removeSVGFilter(removeIndex) {
    this.removePropertyList(this.svgfilters, removeIndex);
  }

  copySVGFilter(index) {
    this.copyPropertyList(this.svgfilters, index);
  }

  sortSVGFilter(startIndex, targetIndex) {
    this.sortItem(this.svgfilters, startIndex, targetIndex);
  }

  setSVGFilterValue(index, value) {
    this.svgfilters[index] = { ...this.svgfilters[index], ...value };
  }

  addSVGFilter(obj = {}) {
    this.svgfilters.push(obj);
    var index = this.svgfilters.length - 1;
    return index;
  }

  createSVGFilter(data = {}) {
    return this.addSVGFilter({
      id: uuidShort(),
      ...data,
    });
  }
}
