
import { Length, Position } from "el/editor/unit/Length";
import { PropertyItem } from "el/editor/items/PropertyItem";
import { StaticGradient } from "./image-resource/StaticGradient";
import { URLImageResource } from "./image-resource/URLImageResource";
import { LinearGradient } from "./image-resource/LinearGradient";
import { RepeatingLinearGradient } from "./image-resource/RepeatingLinearGradient";
import { RadialGradient } from "./image-resource/RadialGradient";
import { RepeatingRadialGradient } from "./image-resource/RepeatingRadialGradient";
import { ConicGradient } from "./image-resource/ConicGradient";
import { RepeatingConicGradient } from "./image-resource/RepeatingConicGradient";
import { Gradient } from "./image-resource/Gradient";
import { combineKeyArray, isString, keyEach, keyMap } from "el/sapa/functions/func";
import { CSS_TO_STRING } from "el/utils/func";
import { GradientType, VisibilityType } from 'el/editor/types/model';
import { parseGroupValue, parseOneValue } from "el/utils/css-function-parser";

const RepeatList = ["repeat", "no-repeat", "repeat-x", "repeat-y", 'round', 'space'];
const reg = /((static\-gradient|linear\-gradient|repeating\-linear\-gradient|radial\-gradient|repeating\-radial\-gradient|conic\-gradient|repeating\-conic\-gradient|url)\(([^\)]*)\))/gi;

export class BackgroundImage extends PropertyItem {
  addImageResource(imageResource) {
    this.clear("image-resource");
    return this.addItem("image-resource", imageResource);
  }

  addGradient(gradient) {
    return this.addImageResource(gradient);
  }

  setImageUrl(data) {
    if (!data.images) return;
    if (!data.images.length) return;
    this.reset({
      type: "image",
      image: BackgroundImage.createImage(data.images[0])
    });
  }

  static createImage(url) {
    return new URLImageResource({ url });
  }

  setGradient(data) {
    this.reset({
      type: data.type,
      image: BackgroundImage.createGradient(data, this.json.image)
    });
  }

  static createGradient(data, gradient) {
    const colorsteps = data.colorsteps || gradient.colorsteps;

    // linear, conic 은 angle 도 같이 설정한다.
    const angle = data.angle || gradient.angle;

    // radial 은  radialType 도 같이 설정한다.
    const radialType = data.radialType || gradient.radialType;
    const radialPosition = data.radialPosition || gradient.radialPosition;

    let json = gradient.toJSON();
    delete json.itemType;
    delete json.type;

    switch (data.type) {
      case "static-gradient":
        return new StaticGradient({ ...json, colorsteps });
      case "linear-gradient":
        return new LinearGradient({ ...json, colorsteps, angle });
      case "repeating-linear-gradient":
        return new RepeatingLinearGradient({ ...json, colorsteps, angle });
      case "radial-gradient":
        return new RadialGradient({
          ...json,
          colorsteps,
          radialType,
          radialPosition
        });
      case "repeating-radial-gradient":
        return new RepeatingRadialGradient({
          ...json,
          colorsteps,
          radialType,
          radialPosition
        });
      case "conic-gradient":
        return new ConicGradient({
          ...json,
          colorsteps,
          angle,
          radialPosition
        });
      case "repeating-conic-gradient":
        return new RepeatingConicGradient({
          ...json,
          colorsteps,
          angle,
          radialPosition
        });
    }

    return new Gradient();
  }

  // 기본 image 를 생성하지 않는다. 
  // 매번 StaticGradient 를 생성 했더니  변환에 너무 많은 비용이 들어간다. 
  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "background-image",
      checked: false,
      blendMode: "normal",
      size: "auto",
      repeat: "repeat",
      width: Length.percent(100),
      height: Length.percent(100),
      x: Length.percent(0),
      y: Length.percent(0),
    });
  }

  toCloneObject() {
    var json = this.json;
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'checked',
        'blendMode',
        'size',
        'repeat',
        'width',
        'height',
        'x',
        'y',
      ),
      image: json.image.clone()
    }
  }

  convert(json) {
    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);

    if (json.width) json.width = Length.parse(json.width);
    if (json.height) json.height = Length.parse(json.height);

    if (isString(json.image)) {
      json.image = BackgroundImage.parseImage(json.image);
    }

    return json;
  }

  get image() {
    return this.json.image;
  }

  set image(image) {
    this.json.image = image;
  }

  checkField(key, value) {
    if (key === "repeat") {
      return RepeatList.includes(value);
    }

    return super.checkField(key, value);
  }

  /**
   * 
   * newX, newY 를 기준으로 image position, size 을 복구한다. 
   * 
   * x.isPercent() ? Length.percent(newX / (maxWidth - newWidth) * 100) : Length.px(newX),
   * 
   * @param {number} newX 
   * @param {number} newY 
   * @param {number} contentBox 
   * @param {number} dx 변경된 넓이 크기 
   * @param {number} dy 변경된 높이 크기 
   * @param {object} options
   * @param {boolean} [options.shiftKey=false]    shiftKey 가 true 이면 width와 height 를 동일하게 width 로 맞춘다. 
   * @returns 
   */
  recoverOffset(newX, newY, contentBox, dx = 0, dy = 0, options = {}) {
    const { x, y, width, height } = this.json;

    const newWidth = Math.floor(width.toPx(contentBox.width).value + dx);
    const newHeight = options.shiftKey ? newWidth : Math.floor(height.toPx(contentBox.height).value + dy);

    // 시작점을 contentBox 로 맞춘다. 
    newX -= contentBox.x;
    newY -= contentBox.y;

    if (newWidth < 0) {
      newX += newWidth
    }

    if (newHeight < 0) {
      newY += newHeight
    }

    let nextX = Length.px(newX);
    let nextY = Length.px(newY);

    const dist = 2;

    if (x.isPercent()) {

      if (Math.abs(newX) < dist) {
        nextX = Length.percent(0)
      } else if (Math.abs((contentBox.width - newWidth) - newX) < dist) {
        nextX = Length.percent(100)
      } else if (Math.abs(((contentBox.width - newWidth) / 2) - newX) < dist) {
        nextX = Length.percent(50)
      } else {
        nextX = Length.makePercent(newX, (contentBox.width - newWidth));
      }
    }

    if (y.isPercent()) {

      if (Math.abs(newY) < dist) {
        nextY = Length.percent(0)
      } else if (Math.abs((contentBox.height - newHeight) - newY) < dist) {
        nextY = Length.percent(100)
      } else if (Math.abs(((contentBox.height - newHeight) / 2) - newY) < dist) {
        nextY = Length.percent(50)
      } else {
        nextY = Length.makePercent(newY, (contentBox.height - newHeight));
      }
    }

    // x, y 가 percent 일 때는 크기의 역순으로 해서 위치를 계산해준다. 
    return {
      x: nextX,
      y: nextY,
      width: Length.px(Math.abs(newWidth)).to(width.unit, contentBox.width),
      height: Length.px(Math.abs(newHeight)).to(height.unit, contentBox.height),
    }
  }

  /**
   * background image 의 위치와 크기를 구한다. 
   * 
   * @param {object} contentBox 
   * @returns 
   */
  getOffset(contentBox) {

    const { x, y, width, height } = this.json;

    const newWidth = width.toPx(contentBox.width);
    const newHeight = height.toPx(contentBox.height);

    const newX = x.toPx(contentBox.width);
    const newY = y.toPx(contentBox.height);

    // refer to https://developer.mozilla.org/en-US/docs/Web/CSS/background-position#regarding_percentages
    // x, y 가 percent 일 경우, 계산하는 방식이 달라진다. 
    return {
      x: contentBox.x + (x.isPercent() ? (contentBox.width - newWidth) * (x.value / 100) : newX),
      y: contentBox.y + (y.isPercent() ? (contentBox.height - newHeight) * (y.value / 100) : newY),
      width: newWidth.value,
      height: newHeight.value,
    }
  }

  toBackgroundImageCSS() {
    if (!this.json.image) return {};

    return {
      "background-image": this.json.image.toCSSString()
    };
  }

  toBackgroundImageProperty() {
    if (!this.json.image) return {};

    return {
      "background-image": this.json.image.toString()
    };
  }



  toBackgroundPositionCSS() {
    var json = this.json;

    return {
      "background-position": `${json.x} ${json.y}`
    };
  }

  toBackgroundSizeCSS() {
    var json = this.json;
    var backgroundSize = "auto";

    if (json.size == "contain" || json.size == "cover") {
      backgroundSize = json.size;
    } else if (json.width.isPercent() && json.width.isPercent()) {
      // 기본 사이즈가 아닌 것만 표시 (100% 100% 이 아닐 때 )
      if (+json.width !== 100 || +json.height !== 100) {
        backgroundSize = `${json.width} ${json.height}`;
      }
    } else {
      backgroundSize = `${json.width} ${json.height}`;
    }

    return {
      "background-size": backgroundSize
    };
  }

  toBackgroundRepeatCSS() {
    var json = this.json;
    return {
      "background-repeat": json.repeat
    };
  }

  toBackgroundBlendCSS() {
    var json = this.json;
    return {
      "background-blend-mode": json.blendMode
    };
  }

  toBackgroundVisibilityCSS() {
    var json = this.json;
    return {
      "background-visibility": json.visibility === VisibilityType.HIDDEN ? VisibilityType.HIDDEN : VisibilityType.VISIBLE
    };
  }

  toCSS() {

    const results = {
      ...this.toBackgroundImageCSS(),
      ...this.toBackgroundPositionCSS(),
      ...this.toBackgroundSizeCSS(),
      ...this.toBackgroundRepeatCSS(),
      ...this.toBackgroundBlendCSS(),
      ...this.toBackgroundVisibilityCSS()
    };

    return results;
  }

  toProperty() {

    const results = {
      ...this.toBackgroundImageProperty(),
      ...this.toBackgroundPositionCSS(),
      ...this.toBackgroundSizeCSS(),
      ...this.toBackgroundRepeatCSS(),
      ...this.toBackgroundBlendCSS(),
      ...this.toBackgroundVisibilityCSS()
    };

    return results;
  }

  toString() {
    return keyMap(this.toCSS(), (key, value) => {
      return `${key}: ${value}`;
    }).join(";");
  }

  toBackgroundCSS() {
    var obj = this.toCSS();

    return {
      // 'background-blend-mode': obj['background-blend-mode'],
      // 'background-size': obj['background-size'],
      // 'background-position': obj['background-position'],
      // 'background-repeat': obj['background-repeat'],
      'background': `${obj['background-image']} `
    }
  }

  static parse(obj) {
    return new BackgroundImage(obj);
  }

  static parseImage(str) {

    const result = parseOneValue(str);

    let image = null;

    if (!result || str === 'undefined') {
      return StaticGradient.create(str || 'transparent');
    }

    switch (result.func) {
      case GradientType.LINEAR:
        image = LinearGradient.parse(result.matchedString);
        break;
      case GradientType.REPEATING_LINEAR:
        image = RepeatingLinearGradient.parse(result.matchedString);
        break;
      case GradientType.RADIAL:
        image = RadialGradient.parse(result.matchedString);
        break;
      case GradientType.REPEATING_RADIAL:
        image = RepeatingRadialGradient.parse(result.matchedString);
        break;
      case GradientType.CONIC:
        image = ConicGradient.parse(result.matchedString);
        break;
      case GradientType.REPEATING_CONIC:
        image = RepeatingConicGradient.parse(result.matchedString);
        break;
      case GradientType.URL:
        image = URLImageResource.parse(result.matchedString);
        break;
      default:
        image = StaticGradient.parse(result.matchedString);
        break;
    }

    return image
  }

  static changeImageType(options) {
    switch (options.type) {
      case GradientType.STATIC:
        return new StaticGradient(options);
      case GradientType.LINEAR:
        return new LinearGradient(options);
      case GradientType.REPEATING_LINEAR:
        return new RepeatingLinearGradient(options);
      case GradientType.RADIAL:
        return new RadialGradient(options);
      case GradientType.REPEATING_RADIAL:
        return new RepeatingRadialGradient(options);
      case GradientType.CONIC:
        return new ConicGradient(options);
      case GradientType.REPEATING_CONIC:
        return new RepeatingConicGradient(options);
      case GradientType.URL:
        return new URLImageResource(options);
    }
  }

  static parseStyle(style) {
    var backgroundImages = [];
    if (style["background-image"]) {

      const result = parseGroupValue(style["background-image"], 'background-image')
      result.forEach((parsedValue, index) => {

        const item = parsedValue[0];
        let image;

        switch (item.func) {
          case GradientType.STATIC:
            image = StaticGradient.parse(item.matchedString);
            break;
          case GradientType.LINEAR:
            image = LinearGradient.parse(item.matchedString);
            break;
          case GradientType.REPEATING_LINEAR:
            image = RepeatingLinearGradient.parse(item.matchedString);
            break;
          case GradientType.RADIAL:
            image = RadialGradient.parse(item.matchedString);
            break;
          case GradientType.REPEATING_RADIAL:
            image = RepeatingRadialGradient.parse(item.matchedString);
            break;
          case GradientType.CONIC:
            image = ConicGradient.parse(item.matchedString);
            break;
          case GradientType.REPEATING_CONIC:
            image = RepeatingConicGradient.parse(item.matchedString);
            break;
          case GradientType.URL:
            image = URLImageResource.parse(item.matchedString);
            break;
        }

        backgroundImages[index] = new BackgroundImage({
          type: image.type,
          image
        });

      });
    }

    if (style["background-repeat"]) {
      style["background-repeat"].split(",").map(it => it.trim()).forEach((it, index) => {
        if (backgroundImages[index]) {
          backgroundImages[index].repeat = it;
        }
      });
    }

    if (style["background-blend-mode"]) {
      style["background-blend-mode"].split(",").map(it => it.trim()).forEach((it, index) => {
        if (backgroundImages[index]) {
          backgroundImages[index].blendMode = it;
        }
      });
    }

    if (style["background-size"]) {
      style["background-size"].split(",").map(it => it.trim()).forEach((it, index) => {
        if (backgroundImages[index]) {
          if (it == "cover" || it === "contain" || it === "auto") {
            backgroundImages[index].size = it;
          } else {
            backgroundImages[index].size = "auto";
            let [width, height] = it.split(' ');
            backgroundImages[index].width = Length.parse(width);
            backgroundImages[index].height = Length.parse(height);
          }
        }
      });
    }

    if (style["background-position"]) {
      style["background-position"].split(",").map(it => it.trim()).forEach((it, index) => {
        if (backgroundImages[index]) {
          let [x, y] = it.split(' ');
          backgroundImages[index].x = Length.parse(x);
          backgroundImages[index].y = Length.parse(y);
        }
      });
    }

    if (style["background-visibility"]) {
      style["background-visibility"].split(",").map(it => it.trim()).forEach((it, index) => {
        if (backgroundImages[index]) {
          backgroundImages[index].visibility = it === VisibilityType.HIDDEN ? VisibilityType.HIDDEN : VisibilityType.VISIBLE;
        }
      });
    }

    return backgroundImages;
  }


  static toCSS(list) {
    var results = {};
    list.forEach(item => {
      keyEach(item.toCSS(), (key, value) => {
        if (!results[key]) results[key] = [];
        results[key].push(value);
      });
    });

    return combineKeyArray(results);
  }

  static toProperty(list) {
    var results = {};
    list.forEach(item => {
      keyEach(item.toProperty(), (key, value) => {
        if (!results[key]) results[key] = [];
        results[key].push(value);
      });
    });

    return combineKeyArray(results);
  }  

  static join(list) {
    return CSS_TO_STRING(BackgroundImage.toProperty(list.map(it => BackgroundImage.parse(it))))
  }

  static joinCSS(list) {
    return BackgroundImage.toCSS(list.map(it => BackgroundImage.parse(it)))
  }
}
