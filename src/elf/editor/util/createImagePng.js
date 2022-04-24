import { Dom } from "sapa";

export default function createImagePng(img, callback, imageType = "image/png") {
  var canvas = Dom.create("canvas");
  var { width, height } = img;
  canvas.resize({ width, height });
  canvas.drawImage(img);

  callback && callback(canvas.toDataURL(imageType));
}
