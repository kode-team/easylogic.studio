import { ImageResource } from "./ImageResource";
import { editor } from "../editor";

const IMAGE_LIST = ["jpg", "jpeg", "png", "gif", "svg"];

// refer to https://github.com/graingert/datauritoblob/blob/master/dataURItoBlob.js
// MIT License
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);
  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var dw = new DataView(ab);
  for (var i = 0; i < byteString.length; i++) {
    dw.setUint8(i, byteString.charCodeAt(i));
  }
  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], { type: mimeString });
}

export class URLImageResource extends ImageResource {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "url",
      url: "",
      datauri: "",
      ...obj
    });
  }

  static parse(str) {

    var url = str.split('(')[1].split(')')[0]

    return new URLImageResource({ url })
  }

  isUrl() {
    return true;
  }

  toString(isExport = false) {
    var json = this.json;

    if (isExport) {
      return `url(${editor.getFile(json.url)})`;
    } else {
      return `url(${json.url})`;
    }
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
    URL.revokeObjectURL(this.json.url);
  }

  makeURL(datauri) {
    var file = dataURItoBlob(datauri);

    return URL.createObjectURL(file);
  }

  toJSON() {
    return {
      type: "file",
      id: this.json.id,
      datauri: this.json.datauri
    };
  }
}
