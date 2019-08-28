import { Length, Position } from "../unit/Length";
import { keyMap, combineKeyArray, keyEach, CSS_TO_STRING } from "../../util/functions/func";
import { Property } from "../items/Property";
import { StaticGradient } from "../image-resource/StaticGradient";
import { URLImageResource } from "../image-resource/URLImageResource";
import { LinearGradient } from "../image-resource/LinearGradient";
import { RepeatingLinearGradient } from "../image-resource/RepeatingLinearGradient";
import { RadialGradient } from "../image-resource/RadialGradient";
import { RepeatingRadialGradient } from "../image-resource/RepeatingRadialGradient";
import { ConicGradient } from "../image-resource/ConicGradient";
import { RepeatingConicGradient } from "../image-resource/RepeatingConicGradient";
import { Gradient } from "../image-resource/Gradient";
import { convertMatches, reverseMatches } from "../../util/functions/parser";


const RepeatList = ["repeat", "no-repeat", "repeat-x", "repeat-y"];
const reg = /((linear\-gradient|repeating\-linear\-gradient|radial\-gradient|repeating\-radial\-gradient|conic\-gradient|repeating\-conic\-gradient|url)\(([^\)]*)\))/gi;

export class BackgroundImage extends Property {
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
        break;
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
      image: new StaticGradient()
    });
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      checked: json.checked,
      blendMode: json.blendMode,
      size: json.size,
      repeat: json.repeat,
      width: json.width + '',
      height: json.height + '',
      x: json.x + '',
      y: json.y + '',
      image: json.image.clone()
    }
  }

  convert(json) {
    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);

    if (json.width) json.width = Length.parse(json.width);
    if (json.height) json.height = Length.parse(json.height);

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

  toBackgroundImageCSS(isExport = false) {
    if (!this.json.image) return {};
    return {
      "background-image": this.json.image.toString(isExport)
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

  toCSS(isExport = false) {
    var results = {
      ...this.toBackgroundImageCSS(isExport),
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

    results.str.match(reg).forEach((value, index) => {

      value = reverseMatches(value, results.matches);
      if (value.includes("repeating-linear-gradient")) {
        // 반복을 먼저 파싱하고
        image = RepeatingLinearGradient.parse(value);
      } else if (value.includes("linear-gradient")) {
        // 그 다음에 파싱 하자.
        image = LinearGradient.parse(value);
      } else if (value.includes("repeating-radial-gradient")) {
        image = RepeatingRadialGradient.parse(value);
      } else if (value.includes("radial")) {
        image = RadialGradient.parse(value);
      } else if (value.includes("repeating-conic-gradient")) {
        image = RepeatingConicGradient.parse(value);
      } else if (value.includes("conic")) {
        image = ConicGradient.parse(value);
      } else if (value.includes("url")) {
        image = URLImageResource.parse(value);
      }
    });

    return image
  }

  static parseStyle(style) {
    var backgroundImages = [];


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


  static toPropertyCSS(list, isExport = false) {
    var results = {};
    list.forEach(item => {
        keyEach(item.toCSS(isExport), (key, value) => {
            if (!results[key]) results[key] = [];
            results[key].push(value);
        });
    });

    return combineKeyArray(results);
  }  

  static join (list) {
    return CSS_TO_STRING(BackgroundImage.toPropertyCSS(list.map(it => BackgroundImage.parse(it))))
  }
}
