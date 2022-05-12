import icon from "elf/editor/icon/icon";
import { LayerModel } from "elf/editor/model/LayerModel";

export class VideoLayer extends LayerModel {
  static getIcon() {
    return icon.video;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "video",
      name: "New Video",
      elementType: "video",

      /** source property */
      src: "",
      srcType: "video/mp4",

      /** video property */
      controls: false,
      preload: "auto", // none, metadata
      poster: "",
      autoplay: false,
      buffered: false,
      crossorigin: "anonymous", // or "use-credentials"
      loop: false,
      muted: false,
      played: false,
      currentTime: 0,
      playbackRate: 1.0,

      //
      playTime: "0:1:1", // 0 is first,  1 is last
      ...obj,
    });
  }

  enableHasChildren() {
    return false;
  }

  getDefaultTitle() {
    return "Video";
  }

  getIcon() {
    return icon.video;
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("src"),
  //   };
  // }

  resize() {
    this.reset({
      width: this.json.naturalWidth.clone(),
      height: this.json.naturalHeight.clone(),
    });
  }
}
