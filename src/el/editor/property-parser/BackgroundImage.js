
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
import { convertMatches, reverseMatches } from "el/utils/parser";
import { combineKeyArray, isString, keyEach, keyMap } from "el/sapa/functions/func";
import { CSS_TO_STRING } from "el/utils/func";

const RepeatList = ["repeat", "no-repeat", "repeat-x", "repeat-y", 'round', 'space'];
const reg = /((linear\-gradient|repeating\-linear\-gradient|radial\-gradient|repeating\-radial\-gradient|conic\-gradient|repeating\-conic\-gradient|url)\(([^\)]*)\))/gi;

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
   * @param {number} maxWidth 
   * @param {number} maxHeight 
   * @param {number} dx 변경된 넓이 크기 
   * @param {number} dy 변경된 높이 크기 
   * @returns 
   */
  recoverOffset (newX, newY, maxWidth, maxHeight, dx = 0, dy = 0) {
    const { x, y, width, height } = this.json;

    const newWidth = Math.floor(width.toPx(maxWidth).value + dx);
    const newHeight = Math.floor(height.toPx(maxHeight).value + dy);    

    if (newWidth < 0) {
      newX += newWidth
    }

    if (newHeight < 0) {
      newY += newHeight
    }    

    // x, y 가 percent 일 때는 크기의 역순으로 해서 위치를 계산해준다. 
    return {
      x: x.isPercent() ? Length.percent(Math.floor(newX / (maxWidth - newWidth) * 100)) : Length.px(newX),
      y: y.isPercent() ? Length.percent(Math.floor(newY / (maxHeight - newHeight) * 100)) : Length.px(newY),
      width: Length.px(Math.abs(newWidth)).to(width.unit, maxWidth),
      height: Length.px(Math.abs(newHeight)).to(height.unit, maxHeight),
    }
  }

  /**
   * background image 의 위치와 크기를 구한다. 
   * 
   * @param {number} maxWidth 
   * @param {number} maxHeight 
   * @returns 
   */
  getOffset(containerWidth, containerHeight) {

    const { x, y, width, height } = this.json;

    const newWidth = width.toPx(containerWidth);
    const newHeight = height.toPx(containerHeight);

    const newX = x.toPx(containerWidth);
    const newY = y.toPx(containerHeight);

    // refer to https://developer.mozilla.org/en-US/docs/Web/CSS/background-position#regarding_percentages
    // x, y 가 percent 일 경우, 계산하는 방식이 달라진다. 
    return {
      x: x.isPercent() ? (containerWidth - newWidth) * (x.value / 100) : newX,
      y: y.isPercent() ? (containerHeight - newHeight) * (y.value / 100) : newY,
      width: newWidth.value,
      height: newHeight.value,
    }
  }

  toBackgroundImageCSS() {
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

  toCSS() {
    var results = {
      ...this.toBackgroundImageCSS(),
      ...this.toBackgroundPositionCSS(),
      ...this.toBackgroundSizeCSS(),
      ...this.toBackgroundRepeatCSS(),
      ...this.toBackgroundBlendCSS()
    };

    return results;
  }

  toString() {
    return keyMap(this.toCSS(), (key, value) => {
      return `${key}: ${value}`;
    }).join(";");
  }

  toBackgroundCSS () {
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

  static parseImage (str) {
    var results = convertMatches(str);
    let image = null;

    var matchResult = results.str.match(reg)

    if (!matchResult) return image; 

    matchResult.forEach((value, index) => {

      value = reverseMatches(value, results.matches);
      if (value.includes("repeating-linear-gradient")) {
        image = RepeatingLinearGradient.parse(value);
      } else if (value.includes("linear-gradient")) {
        image = LinearGradient.parse(value);
      } else if (value.includes("repeating-radial-gradient")) {
        image = RepeatingRadialGradient.parse(value);
      } else if (value.includes("radial-gradient")) {
        image = RadialGradient.parse(value);
      } else if (value.includes("repeating-conic-gradient")) {
        image = RepeatingConicGradient.parse(value);
      } else if (value.includes("conic-gradient")) {
        image = ConicGradient.parse(value);
      } else if (value.includes("url")) {
        image = URLImageResource.parse(value);
      }
    });

    return image
  }

  static changeImageType (options) {
    switch  (options.type) {
    case 'static-gradient':
      return new StaticGradient(options);
    case 'linear-gradient': 
      return new LinearGradient(options);
    case 'repeating-linear-gradient': 
      return new RepeatingLinearGradient(options);      
    case 'radial-gradient': 
      return new RadialGradient(options);
    case 'repeating-radial-gradient': 
      return new RepeatingRadialGradient(options);      
    case 'conic-gradient': 
      return new ConicGradient(options);
    case 'repeating-conic-gradient': 
      return new RepeatingConicGradient(options);      
    case 'image-resource':
    case 'url':
      return new URLImageResource(options);
    }
  }

  static parseStyle(style) {
    var backgroundImages = [];
    const key = JSON.stringify(style);

    if (style["background-image"]) {
      var results = convertMatches(style["background-image"]);

      results.str.match(reg).forEach((value, index) => {
        let image = null;
        value = reverseMatches(value, results.matches);
        if (value.includes("repeating-linear-gradient")) {
          image = RepeatingLinearGradient.parse(value);
        } else if (value.includes("linear-gradient")) {
          image = LinearGradient.parse(value);
        } else if (value.includes("repeating-radial-gradient")) {
          image = RepeatingRadialGradient.parse(value);
        } else if (value.includes("radial-gradient")) {
          image = RadialGradient.parse(value);
        } else if (value.includes("repeating-conic-gradient")) {
          image = RepeatingConicGradient.parse(value);
        } else if (value.includes("conic-gradient")) {
          image = ConicGradient.parse(value);
        } else if (value.includes("url")) {
          image = URLImageResource.parse(value);
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

    return backgroundImages;
  }


  static toPropertyCSS(list) {
    var results = {};
    list.forEach(item => {
        keyEach(item.toCSS(), (key, value) => {
            if (!results[key]) results[key] = [];
            results[key].push(value);
        });
    });

    return combineKeyArray(results);
  }  

  static join (list) {
    return CSS_TO_STRING(BackgroundImage.toPropertyCSS(list.map(it => BackgroundImage.parse(it))))
  }

  static joinCSS (list) {
    return BackgroundImage.toPropertyCSS(list.map(it => BackgroundImage.parse(it)))
  }  
}
