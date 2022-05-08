import { vec3 } from "gl-matrix";

import { Selector } from "../property-parser/Selector";
import { GroupModel } from "./GroupModel";

import { rectToVerties } from "elf/core/collision";
import { STRING_TO_CSS } from "elf/core/func";
import {
  calculateRotationOriginMat4,
  degreeToRadian,
  vertiesMap,
} from "elf/core/math";
import { PathParser } from "elf/core/parser/PathParser";
import { BackgroundImage } from "elf/editor/property-parser/BackgroundImage";
import { Border } from "elf/editor/property-parser/Border";
import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { Pattern } from "elf/editor/property-parser/Pattern";
import {
  Constraints,
  GradientType,
  Layout,
  VisibilityType,
} from "elf/editor/types/model";
import { Length } from "elf/editor/unit/Length";

const editableList = [
  "appearance",
  "position",
  "right",
  "bottom",
  "rootVariable",
  "variable",
  "transform",
  "filter",
  "backdrop-filter",
  "background-color",
  "background-image",
  "border-radius",
  "border",
  "box-shadow",
  "clip-path",
  "color",
  "perspective-origin",
  "transform-origin",
  "transform-style",
  "perspective",
  "mix-blend-mode",
  "overflow",
  "opacity",
  "box-model",
  "layout",
  "flex-layout",
  "grid-layout",
  "animation",
  "transition",
  "pattern",
  "boolean-operation",
];

const editableKeys = {};
editableList.forEach(function (key) {
  editableKeys[key] = true;
});

export class DomModel extends GroupModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      position: "absolute",
      rootVariable: "",
      variable: "",
      color: "black",
      // 'font-size': 13,
      overflow: "visible",
      opacity: 1,
      // 'transform-style': 'preserve-3d',
      layout: Layout.DEFAULT,
      "flex-layout": "display:flex;",
      "grid-layout": "display:grid;",
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: [],
      "constraints-vertical": Constraints.MIN,
      "constraints-horizontal": Constraints.MIN,
      selectors: [],
      svg: [],
      ...obj,
    });
  }

  toCloneObject() {
    var json = this.json;

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        "position",
        "rootVariable",
        "variable",
        "transform",
        "filter",
        "backdrop-filter",
        "background-color",
        "background-image",
        "text-clip",
        "border-radius",
        "border",
        "border-top",
        "border-left",
        "border-right",
        "border-bottom",
        "box-shadow",
        "text-shadow",
        "clip-path",
        "color",
        "font-size",
        "line-height",
        "text-align",
        "text-transform",
        "text-decoration",
        "letter-spacing",
        "word-spacing",
        "text-indent",
        "perspective-origin",
        "transform-origin",
        "transform-style",
        "perspective",
        "mix-blend-mode",
        "overflow",
        "opacity",
        "flex-layout",
        "grid-layout",
        "animation",
        "transition",
        "margin-top",
        "margin-left",
        "margin-right",
        "margin-bottom",
        "padding-top",
        "padding-right",
        "padding-left",
        "padding-bottom",
        "constraints-horizontal",
        "constraints-vertical"
      ),

      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: json.keyframes.map(keyframe => keyframe.clone()),
      selectors: json.selectors.map((selector) => selector.clone()),
      svg: json.svg.map((svg) => svg.clone()),
    };
  }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case "svg-item":
      // case 'box-model':
      // case 'transform':
      // eslint-disable-next-line no-fallthrough
      case "transform-origin":
      case "perspective":
      case "perspective-origin":
        return false;
    }

    return Boolean(editableKeys[editablePropertyName]);
  }

  get changedBoxModel() {
    return this.hasChangedField(
      "margin-top",
      "margin-left",
      "margin-bottom",
      "margin-right",
      "padding-top",
      "padding-left",
      "padding-right",
      "padding-bottom"
    );
  }

  get changedFlexLayout() {
    return this.hasChangedField(
      "flex-direction",
      "flex-wrap",
      "justify-content",
      "align-items",
      "align-content",
      "order",
      "flex-basis",
      "flex-grow",
      "flex-shrink",
      "flex-flow"
    );
  }

  get changedGridLayout() {
    return this.hasChangedField(
      "grid-template-rows",
      "grid-template-columns",
      "grid-template-areas",
      "grid-auto-rows",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-row-gap",
      "grid-column-gap",
      "grid-row-start",
      "grid-row-end",
      "grid-column-start",
      "grid-column-end",
      "grid-area"
    );
  }

  get changedLayoutItem() {
    return this.hasChangedField("resizingHorizontal", "resizingVertical");
  }

  get changedLayout() {
    return (
      this.hasChangedField("layout") ||
      this.changedBoxModel ||
      this.changedFlexLayout ||
      this.changedGridLayout ||
      this.changedLayoutItem
    );
  }

  addSelector(selector) {
    this.json.selectors.push(selector);
    return selector;
  }

  createSelector(data = {}) {
    return this.addSelector(
      new Selector({
        checked: true,
        ...data,
      })
    );
  }

  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }

  removeSelector(removeIndex) {
    this.removePropertyList(this.json.selectors, removeIndex);
  }

  enableHasChildren() {
    return true;
  }

  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  updateSelector(index, data = {}) {
    this.json.selectors[+index].reset(data);
  }

  traverse(item, results, hasLayoutItem) {
    // var parentItemType = item.parent().itemType;
    if (item.isAttribute()) return;
    // if (parentItemType == 'layer') return;
    if (!hasLayoutItem && item.isLayoutItem() && !item.isRootItem()) return;

    results.push(item);

    item.children.forEach((child) => {
      this.traverse(child, results);
    });
  }

  tree(hasLayoutItem) {
    var results = [];

    this.children.forEach((item) => {
      this.traverse(item, results, hasLayoutItem);
    });

    return results;
  }

  convert(json) {
    json = super.convert(json);

    // padding 을 동시에 설정하기
    if (json.padding) {
      json["padding-top"] = Length.parse(json.padding);
      json["padding-right"] = Length.parse(json.padding);
      json["padding-bottom"] = Length.parse(json.padding);
      json["padding-left"] = Length.parse(json.padding);

      delete json.padding;
    }

    return json;
  }

  reset(obj, context = { origin: "*" }) {
    const isChanged = super.reset(obj, context);

    // transform 에 변경이 생기면 미리 캐슁해둔다.
    if (this.hasChangedField("clip-path")) {
      this.setClipPathCache();
    }

    if (this.hasChangedField("width", "height")) {
      if (this.cacheClipPath) {
        const d = this.cacheClipPath
          .clone()
          .scale(
            this.json.width / this.cacheClipPathWidth,
            this.json.height / this.cacheClipPathHeight
          ).d;
        this.json["clip-path"] = `path(${d})`;

        this.modelManager.setChanged("reset", this.id, {
          "clip-path": this.json["clip-path"],
        });
      }
    }

    if (this.hasChangedField("background-image", "pattern")) {
      this.setBackgroundImageCache();
    }

    return isChanged;
  }

  setBackgroundImageCache() {
    let list = [];

    if (this.json.pattern) {
      const patternList = this.computed("pattern", (pattern) => {
        return Pattern.parseStyle(pattern).map((it) => {
          return BackgroundImage.parseStyle(STRING_TO_CSS(it.toCSS()));
        });
      });

      for (var i = 0, len = patternList.length; i < len; i++) {
        list.push.apply(list, patternList[i]);
      }
    }

    if (this.json["background-image"]) {
      const backgroundList = this.computed(
        "background-image",
        (backgroundImage) => {
          return BackgroundImage.parseStyle(STRING_TO_CSS(backgroundImage));
        }
      );

      // visibility 가 hidden 이 아니면 모두 보여준다.
      list.push.apply(
        list,
        backgroundList.filter((it) => it.visibility !== VisibilityType.HIDDEN)
      );
    }

    if (list.length) {
      const project = this.top;
      this.cacheBackgroundImage = BackgroundImage.joinCSS(list);

      const cacheList = list
        .filter((it) => it.type === GradientType.URL)
        .map((it) => it.image.url);
      let cacheImage = this.cacheBackgroundImage["background-image"];

      // project 에 있는 image 와 합쳐준다.
      cacheList.forEach((url) => {
        const imageUrl = project.getImageValueById(url);

        cacheImage = cacheImage.replace(url, `"${imageUrl}"`);
      });

      this.cacheBackgroundImage["background-image"] = cacheImage;
    } else {
      this.cacheBackgroundImage = {};
      this.cacheBackgroundImageOriginal = [];
    }
  }

  setClipPathCache() {
    var obj = ClipPath.parseStyle(this.json["clip-path"]);

    this.cacheClipPathObject = obj;
    if (obj.type === "path") {
      this.cacheClipPath = new PathParser(obj.value.trim());
      this.cacheClipPathWidth = this.json.width;
      this.cacheClipPathHeight = this.json.height;
    }
  }

  setCache() {
    super.setCache();

    this.setClipPathCache();
  }

  // eslint-disable-next-line getter-return
  get clipPathString() {
    if (!this.cacheClipPath) {
      this.setClipPathCache();
    }

    if (this.cacheClipPath) {
      return this.cacheClipPath
        .clone()
        .scale(
          this.json.width / this.cacheClipPathWidth,
          this.json.height / this.cacheClipPathHeight
        ).d;
    }
  }

  getBackgroundImage(index) {
    const backgroundImages = BackgroundImage.parseStyle(
      STRING_TO_CSS(this.json["background-image"])
    );

    return backgroundImages[index || 0];
  }

  get borderWidth() {
    const border = Border.parseStyle(this.json.border);
    const borderObject = Border.parseValue(border.border);

    if (borderObject?.width) {
      return {
        borderLeftWidth: borderObject?.width,
        borderRightWidth: borderObject?.width,
        borderTopWidth: borderObject?.width,
        borderBottomWidth: borderObject?.width,
      };
    }

    return {
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
    };
  }

  /**
   * border-width 를 제외한 공간을 rect 로 리턴한다.
   *
   */
  get contentBox() {
    const x = 0;
    const y = 0;
    const width = this.screenWidth;
    const height = this.screenHeight;

    // eslint-disable-next-line no-constant-condition
    if (true /*this.json['box-sizing'] === 'border-box'*/) {
      // 현재는 border-box 로 고정이기 때문에 항상 border Width 를 같이 계산해준다.
      const borderWidth = this.borderWidth;
      return {
        x: x + borderWidth.borderLeftWidth,
        y: y + borderWidth.borderTopWidth,
        width:
          width - borderWidth.borderLeftWidth - borderWidth.borderRightWidth,
        height:
          height - borderWidth.borderTopWidth - borderWidth.borderBottomWidth,
      };
    }

    return {
      x,
      y,
      width,
      height,
    };
  }

  getGradientLineLength(width, height, angle) {
    return (
      Math.abs(width * Math.sin(degreeToRadian(angle))) +
      Math.abs(height * Math.cos(degreeToRadian(angle)))
    );
  }

  /**
   * 선택된 backround image 의 matrix 를 생성함.
   *
   * backRect : { x, y, width, height}
   * backVerties : backRect 의 world 좌표
   *
   * @param {number} index
   * @returns
   */
  createBackgroundImageMatrix(index) {
    const contentBox = this.contentBox;
    const backgroundImage = this.getBackgroundImage(index);

    const { image } = backgroundImage;

    const backRect = backgroundImage.getOffset(contentBox);

    const backVerties = vertiesMap(
      rectToVerties(backRect.x, backRect.y, backRect.width, backRect.height),
      this.absoluteMatrix
    );
    const result = {
      backRect,
      backVerties,
      absoluteMatrix: this.absoluteMatrix,
      backgroundImage,
    };

    switch (image.type) {
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        // eslint-disable-next-line no-case-declarations
        let [rx, ry] = image.radialPosition;

        if (rx == "center") rx = Length.percent(50);
        if (ry == "center") ry = Length.percent(50);

        // eslint-disable-next-line no-case-declarations
        const newRx = rx.toPx(backRect.width);
        // eslint-disable-next-line no-case-declarations
        const newRy = ry.toPx(backRect.height);

        // eslint-disable-next-line no-case-declarations
        const centerVerties = vertiesMap(
          [
            [newRx.value + backRect.x, newRy.value + backRect.y, 0],
            [newRx.value + backRect.x, newRy.value + backRect.y - 1, 0],
          ],
          this.absoluteMatrix
        );

        result.radialCenterPosition = centerVerties[0];
        result.radialCenterStick = centerVerties[1];
        result.radialCenterPoint = [newRx.value, newRy.value, 0];

        if (
          image.type === GradientType.RADIAL ||
          image.type === GradientType.REPEATING_RADIAL
        ) {
          const { startPoint, endPoint, shapePoint } =
            image.getStartEndPoint(result);

          const [newStartPoint, newEndPoint, newShapePoint] = vertiesMap(
            [startPoint, endPoint, shapePoint],
            this.absoluteMatrix
          );

          result.radialCenterPosition = newStartPoint;
          result.startPoint = newStartPoint;
          result.endPoint = newEndPoint;
          result.shapePoint = newShapePoint;

          result.colorsteps = image.colorsteps.map((it) => {
            const offset = it.toLength();
            return {
              id: it.id,
              cut: it.cut,
              color: it.color,
              timing: it.timing,
              timingCount: it.timingCount,
              pos: vec3.lerp(
                [],
                result.startPoint,
                result.endPoint,
                offset.value / 100
              ),
            };
          });
        } else if (
          image.type === GradientType.CONIC ||
          image.type === GradientType.REPEATING_CONIC
        ) {
          const { startPoint, endPoint, shapePoint } =
            image.getStartEndPoint(result);

          const [newStartPoint, newEndPoint, newShapePoint] = vertiesMap(
            [startPoint, endPoint, shapePoint],
            this.absoluteMatrix
          );

          result.radialCenterPosition = newStartPoint;
          result.startPoint = newStartPoint;
          result.endPoint = newEndPoint;
          result.shapePoint = newShapePoint;

          [result.startPoint, result.endPoint, result.shapePoint] = vertiesMap(
            [result.startPoint, result.endPoint, result.shapePoint],
            calculateRotationOriginMat4(
              image.angle,
              result.radialCenterPosition
            )
          );

          const targetPoint = result.shapePoint;

          result.colorsteps = image.colorsteps.map((it) => {
            const angle = it.percent * 3.6;

            const [newPos] = vertiesMap(
              [targetPoint],
              calculateRotationOriginMat4(angle, result.radialCenterPosition)
            );

            return {
              id: it.id,
              cut: it.cut,
              color: it.color,
              timing: it.timing,
              timingCount: it.timingCount,
              pos: newPos,
            };
          });
        }

        break;
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
        // gradient length 구하기
        result.gradientLineLength = this.getGradientLineLength(
          backRect.width,
          backRect.height,
          image.angle
        );
        result.centerPosition = vec3.lerp(
          [],
          backVerties[0],
          backVerties[2],
          0.5
        );

        // eslint-disable-next-line no-case-declarations
        const startPoint = vec3.add([], result.centerPosition, [
          0,
          result.gradientLineLength / 2,
          0,
        ]);
        // eslint-disable-next-line no-case-declarations
        const endPoint = vec3.subtract([], result.centerPosition, [
          0,
          result.gradientLineLength / 2,
          0,
        ]);

        // eslint-disable-next-line no-case-declarations
        const areaStartPoint = vec3.clone(startPoint);
        // eslint-disable-next-line no-case-declarations
        const areaEndPoint = vec3.clone(endPoint);

        // eslint-disable-next-line no-case-declarations
        const [newStartPoint, newEndPoint, newAreaStartPoint, newAreaEndPoint] =
          vertiesMap(
            [startPoint, endPoint, areaStartPoint, areaEndPoint],
            calculateRotationOriginMat4(image.angle, result.centerPosition)
          );

        result.endPoint = newEndPoint;
        result.startPoint = newStartPoint;
        result.areaStartPoint = newAreaStartPoint;
        result.areaEndPoint = newAreaEndPoint;

        result.colorsteps = image.colorsteps.map((it) => {
          const offset = it.toLength();
          return {
            id: it.id,
            cut: it.cut,
            color: it.color,
            timing: it.timing,
            timingCount: it.timingCount,
            pos: vec3.lerp(
              [],
              result.startPoint,
              result.endPoint,
              offset.value / 100
            ),
          };
        });

        break;
    }

    return result;
  }
}
