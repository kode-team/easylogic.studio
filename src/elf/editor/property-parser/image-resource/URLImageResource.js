import { ImageResource } from "./ImageResource";

import { GradientType } from "elf/editor/types/model";

const IMAGE_LIST = ["jpg", "jpeg", "png", "gif", "svg"];

// refer to https://github.com/graingert/datauritoblob/blob/master/dataURItoBlob.js
// MIT License
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = window.atob(dataURI.split(",")[1]);
  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  // write the bytes of the string to an ArrayBuffer
  var ab = new window.ArrayBuffer(byteString.length);
  var dw = new window.DataView(ab);
  for (var i = 0; i < byteString.length; i++) {
    dw.setUint8(i, byteString.charCodeAt(i));
  }
  // write the ArrayBuffer to a blob, and you're done
  return new window.Blob([ab], { type: mimeString });
}

export class URLImageResource extends ImageResource {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: GradientType.URL,
      url: "",
      datauri: "",
      ...obj,
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("url", "datauri"),
    };
  }

  static parse(str) {
    var url = str.split("(")[1].split(")")[0];

    return new URLImageResource({ url });
  }

  isUrl() {
    return true;
  }

  toString(url) {
    return `url(${url || this.json.url})`;
  }

  static isImageFile(fileExt) {
    return IMAGE_LIST.includes(fileExt);
  }
}

export class FileImageResource extends URLImageResource {
  getDefaultObject() {
    return super.getDefaultObject({ type: "file" });
  }

  isUrl() {
    return false;
  }
  isFile() {
    return true;
  }

  convert(json) {
    if (!json.url && json.datauri) {
      json.url = this.makeURL(json.datauri);
    }
    return json;
  }

  remove() {
    this.removeURL();
    super.remove();
  }

  removeURL() {
    window.URL.revokeObjectURL(this.json.url);
  }

  makeURL(datauri) {
    var file = dataURItoBlob(datauri);

    return window.URL.createObjectURL(file);
  }

  toJSON() {
    return {
      type: "file",
      id: this.json.id,
      datauri: this.json.datauri,
    };
  }
}
