import { SVGModel } from "./SVGModel";

import { PathParser } from "elf/core/parser/PathParser";
import icon from "elf/editor/icon/icon";

export class PathModel extends SVGModel {
  getIcon() {
    return icon.edit;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "svg-path",
      name: "New Path",
      strokeWidth: 1,
      d: "", // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다.
      totalLength: 0,
      ...obj,
    });
  }

  enableHasChildren() {
    return false;
  }

  reset(json, context = { origin: "*" }) {
    const isChanged = super.reset(json, context);

    if (this.hasChangedField("d")) {
      // d 속성이 변경 될 때 성능을 위해서 PathParser 로 미리 객체를 생성해준다.
      // 이때 width, height 를 같이 해둬야 한다.
      this.cachePath = new PathParser(this.d);
      this.cacheWidth = this.width;
      this.cacheHeight = this.height;

      // this.modelManager.setChanged('resetCache', this.id, { path: this.cachePath, width: this.cacheWidth, height: this.cacheHeight });
    }

    return isChanged;
  }

  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField("d")) {
      this.addCache("pathString", new PathParser(this.get("d")));
      this.addCache("pathWidth", this.width);
      this.addCache("pathHeight", this.height);
    } else if (this.hasChangedField("width", "height")) {
      this.d = this.getCache("pathString")
        .clone()
        .scale(this.width / this.cacheWidth, this.height / this.cacheHeight).d;
      this.manager.setChanged("reset", this.id, { d: this.d });
    }

    // this.modelManager.setChanged('refreshMatrixCache', this.id, { start: true, redefined: true })
  }

  setCache() {
    super.setCache();

    this.addCache("pathString", new PathParser(this.get("d")));
    this.addCache("pathWidth", this.width);
    this.addCache("pathHeight", this.height);
  }

  get d() {
    if (!this.get("d")) {
      return null;
    }

    if (!this.hasCache("pathString")) {
      this.addCache("pathString", new PathParser(this.get("d")));
      this.addCache("pathWidth", this.width);
      this.addCache("pathHeight", this.height);
    }

    return this.getCache("pathString")
      .clone()
      .scale(
        this.width / this.getCache("pathWidth"),
        this.height / this.getCache("pathHeight")
      ).d;
  }

  set d(value) {
    this.set("d", value);
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     d: this.d,
  //   };
  // }

  getDefaultTitle() {
    return "Path";
  }
}
