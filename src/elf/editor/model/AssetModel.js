import { Keyframe } from "../property-parser/Keyframe";
import { BaseModel } from "./BaseModel";

export class AssetModel extends BaseModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      comments: [], // { id: xxxx, pos: [0, 0, 0], comments: [ { userId: '', message: '', createdAt: '', updatedAt : '' } ] }
      colors: [],
      gradients: [],
      svgfilters: [],
      svgimages: [],
      keyframes: [],
      images: [], //  { id: xxxx, url : '' }
      imageKeys: [],
      videos: [], //  { id: xxxx, url : '' }
      videoKeys: [],
      audios: [], //  { id: xxxx, url : '' }
      ...obj,
    });
  }

  get comments() {
    return this.get("comments");
  }

  get colors() {
    return this.get("colors");
  }

  get gradients() {
    return this.get("gradients");
  }

  get svgfilters() {
    return this.get("svgfilters");
  }

  get svgimages() {
    return this.get("svgimages");
  }

  get keyframes() {
    return this.get("keyframes");
  }

  get videos() {
    return this.get("videos");
  }

  get images() {
    return this.get("images");
  }

  set images(value) {
    this.set("images", value);
  }

  get imageKeys() {
    return this.get("imageKeys");
  }

  get videoKeys() {
    return this.get("videoKeys");
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

  copyPropertyList(arr, index) {
    var copyObject = { ...arr[index] };
    arr.splice(index, 0, copyObject);
  }

  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }

  /* color assets manage */

  removeColor(removeIndex) {
    this.removePropertyList(this.colors, removeIndex);
  }

  copyColor(index) {
    this.copyPropertyList(this.colors, index);
  }

  sortColor(startIndex, targetIndex) {
    this.sortItem(this.colors, startIndex, targetIndex);
  }

  setColorValue(index, value = {}) {
    this.colors[index] = { ...this.colors[index], ...value };
  }

  getColorIndex(index) {
    return this.colors[index];
  }

  getColor(name) {
    return this.colors.filter((item) => item.name === name)[0];
  }

  addColor(obj) {
    this.colors.push(obj);
    return obj;
  }

  createColor(data = {}) {
    return this.addColor(data);
  }

  /* image assets manage */

  removeImage(removeIndex) {
    this.removePropertyList(this.images, removeIndex);
    this.refreshImageKeys();
  }

  copyImage(index) {
    this.copyPropertyList(this.images, index);
    this.refreshImageKeys();
  }

  sortImage(startIndex, targetIndex) {
    this.sortItem(this.images, startIndex, targetIndex);
  }

  setImageValue(index, value = {}) {
    this.images[index] = { ...this.images[index], ...value };
    this.refreshImageKeys();
  }

  getImageValueById(id, defaultValue = "") {
    const image = this.imageKeys[id];

    if (!image) return id || defaultValue;

    return image.local;
  }

  getImageDataURIById(id) {
    const image = this.imageKeys[id];
    if (!image) return undefined;

    return image.original;
  }

  refreshImageKeys() {
    let imageKeys = {};
    this.images.forEach((it) => {
      imageKeys[it.id] = it;
    });

    this.reset({
      imageKeys,
    });
  }

  addImage(obj) {
    this.images.push(obj);
    this.refreshImageKeys();
    return obj;
  }

  createImage(data = {}) {
    return this.addImage(data);
  }

  /* video assets manage */

  removeVideo(removeIndex) {
    this.removePropertyList(this.videos, removeIndex);
    this.refreshVideoKeys();
  }

  copyVideo(index) {
    this.copyPropertyList(this.videos, index);
    this.refreshVideoKeys();
  }

  sortVideo(startIndex, targetIndex) {
    this.sortItem(this.videos, startIndex, targetIndex);
  }

  setVideoValue(index, value = {}) {
    this.videos[index] = { ...this.videos[index], ...value };
  }

  getVideoValueById(id) {
    const video = this.videoKeys[id];
    if (!video) return undefined;

    return video.local;
  }

  refreshVideoKeys() {
    let videoKeys = {};
    this.videos.forEach((it) => {
      videoKeys[it.id] = it;
    });

    this.reset({
      videoKeys,
    });
  }

  addVideo(obj) {
    this.videos.push(obj);
    this.refreshVideoKeys();
    return obj;
  }

  createVideo(data = {}) {
    return this.addVideo(data);
  }

  /* gradient assets manage */

  removeGradient(removeIndex) {
    this.removePropertyList(this.gradients, removeIndex);
  }

  copyGradient(index) {
    this.copyPropertyList(this.gradients, index);
  }

  sortGradient(startIndex, targetIndex) {
    this.sortItem(this.gradients, startIndex, targetIndex);
  }

  setGradientValue(index, value) {
    this.gradients[index] = { ...this.gradients[index], ...value };
  }

  getGradientIndex(index) {
    return this.gradients[index];
  }

  getGradient(name) {
    return this.gradients.filter((item) => item.name === name)[0];
  }

  addGradient(obj = {}) {
    this.gradients.push(obj);
    return obj;
  }

  createGradient(data = {}) {
    return this.addGradient(data);
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
    return this.addSVGFilter(data);
  }

  /* svg clip-path images   */

  getSVGImageIndex(id) {
    var filter = this.svgimages
      .map((it, index) => {
        return { id: it.id, index };
      })
      .filter((it) => {
        return it.id === id;
      })[0];

    return filter ? filter.index : -1;
  }

  removeSVGImage(removeIndex) {
    this.removePropertyList(this.svgimages, removeIndex);
  }

  copySVGImage(index) {
    this.copyPropertyList(this.svgimages, index);
  }

  sortSVGImage(startIndex, targetIndex) {
    this.sortItem(this.svgimages, startIndex, targetIndex);
  }

  setSVGImageValue(index, value) {
    this.svgimages[index] = { ...this.svgimages[index], ...value };
  }

  addSVGImage(obj = {}) {
    this.svgimages.push(obj);
    var index = this.svgimages.length - 1;
    return index;
  }

  createSVGImage(data = {}) {
    return this.addSVGImage(data);
  }
}
