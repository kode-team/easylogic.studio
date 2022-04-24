import { mat4 } from "gl-matrix";
import { calculateMatrix } from "elf/utils/math";
import { itemsToRectVerties } from "elf/utils/collision";
import { TimelineModel } from "elf/editor/model/TimelineModel";

const identity = mat4.create();

export class Project extends TimelineModel {
  getDefaultTitle() {
    return "New Project";
  }

  get isAbsolute() {
    return false;
  }

  get parent() {
    return null;
  }

  get nestedAngle() {
    return 0;
  }

  toRootVariableCSS() {
    var obj = {};
    this.json.rootVariable
      .split(";")
      .filter((it) => it.trim())
      .forEach((it) => {
        var [key, value] = it.split(":");

        obj[`--${key}`] = value;
      });

    return obj;
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      name: "new Project",
      description: "",
      rootVariable: "",
      ...obj,
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("name", "description", "rootVariable"),
    };
  }

  get artboards() {
    return (this.layers || []).filter((it) => it.is("artboard"));
  }

  get offsetX() {
    return 0;
  }

  get offsetY() {
    return 0;
  }

  get screenWidth() {
    return 0;
  }

  get screenHeight() {
    return 0;
  }

  isLayoutItem() {
    return false;
  }

  hasLayout() {
    return false;
  }

  getAbsoluteMatrix() {
    return mat4.create();
  }

  getTransformMatrix() {
    return mat4.create();
  }
  /**
   * 부모를 기준으로 childItem 의 transform 을 맞춘다.
   *
   * [newParentInverse] * [childMatrix] * [childItemMatrixInverse] = translate;
   *
   * @param {Item} childItem
   */
  resetMatrix(childItem) {
    const [x, y] = mat4.getTranslation(
      [],
      calculateMatrix(childItem.absoluteMatrix, childItem.localMatrixInverse)
    );

    childItem.reset({
      x: x,
      y: y,
    });
  }

  get rectVerties() {
    return this.layers?.length ? itemsToRectVerties(this.layers) : null;
  }

  get absoluteMatrix() {
    return identity;
  }

  get absoluteMatrixInverse() {
    return identity;
  }

  get contentBox() {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  }
}
