import { ImageResource } from "./ImageResource";

import { OBJECT_TO_PROPERTY } from "elf/core/func";
import { Length } from "elf/editor/unit/Length";

const IMAGE_LIST = ["jpg", "jpeg", "png", "gif", "svg"];

// refer to https://github.com/graingert/datauritoblob/blob/master/dataURItoBlob.js
// MIT License
// eslint-disable-next-line no-unused-vars
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

export class SVGImageResource extends ImageResource {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "url",
      url: "",
      datauri: "",
      patternUnits: "userSpaceOnUse",
      patternWidth: "100%",
      patternHeight: "100%",
      imageX: "0%",
      imageY: "0%",
      imageWidth: "100%",
      imageHeight: "100%",
      ...obj,
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        "url",
        "datauri",
        "patternUnits",
        "patternWidth",
        "patternHeight",
        "imageX",
        "imageY",
        "imageWidth",
        "imageHeight"
      ),
    };
  }

  static parse(str) {
    var content = str.split("(")[1].split(")")[0];

    var [url, props] = content.trim().split("#");

    if (!props) {
      return new SVGImageResource({ url });
    }

    var [
      patternUnits,
      patternWidth,
      patternHeight,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
    ] = props.split(",");

    return new SVGImageResource({
      patternUnits,
      patternWidth,
      patternHeight,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      url,
    });
  }

  isUrl() {
    return true;
  }

  static isImageFile(fileExt) {
    return IMAGE_LIST.includes(fileExt);
  }

  toString() {
    var json = this.json;
    var {
      patternUnits,
      patternWidth,
      patternHeight,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      url,
    } = json;

    var string = [
      patternUnits,
      patternWidth,
      patternHeight,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
    ]
      .join(",")
      .trim();

    return `url(${url}#${string})`;
  }

  toSVGString(id, item = {}) {
    var {
      patternUnits,
      patternWidth,
      patternHeight,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
    } = this.json;

    const localPatternWidth = Length.parse(patternWidth);
    const localPatternHeight = Length.parse(patternHeight);

    const localImageX = Length.parse(imageX);
    const localImageY = Length.parse(imageY);

    const localImageWidth = Length.parse(imageWidth);
    const localImageHeight = Length.parse(imageHeight);

    const width = item.width
      ? localPatternWidth.toPx(item.width).value
      : localPatternWidth;
    const height = item.height
      ? localPatternHeight.toPx(item.height).value
      : localPatternHeight;

    return /*html*/ `
  <pattern ${OBJECT_TO_PROPERTY({ id, patternUnits, width, height })} >
    <image xlink:href="${
      this.json.datauri || this.json.url
    }" ${OBJECT_TO_PROPERTY({
      x: localImageX.toPx(item.width).value,
      y: localImageY.toPx(item.height).value,
      width: localImageWidth.toPx(item.width).value,
      height: localImageHeight.toPx(item.height).value,
      preserveAspectRatio: "none",
    })} />
  </pattern>
      `;
  }

  toFillValue(id) {
    return `url(#${id})`;
  }
}
