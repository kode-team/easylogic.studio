import { Length, Position } from "../unit/Length";
import { keyMap, isNumber } from "../../util/functions/func";
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


export class BorderImage extends Property {
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
    this.reset({ type: "image", image: this.createImage(data.images[0]) });
  }

  createImage(url) {
    return new URLImageResource({ url });
  }

  setGradient(data) {
    this.reset({
      type: data.type,
      image: this.createGradient(data, this.json.image)
    });
  }

  createGradient(data, gradient) {
    const colorsteps = data.colorsteps;

    // linear, conic 은 angle 도 같이 설정한다.
    const angle = data.angle;

    // radial 은  radialType 도 같이 설정한다.
    const radialType = data.radialType;
    const radialPosition = data.radialPosition;

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
      itemType: "border-image",
      checked: false,
      repeat: "stretch",
      slice: {},
      width: {},
      image: StaticGradient.create(),
    });
  }

  convert(json) {
    Object.keys(json.slice).forEach(key => {
      json.slice[key] = Length.parse(json.slice[key]); 
    }) 

    return json;
  }

  get image() {
    return this.json.image;
  }

  set image(image) {
    this.json.image = image;
  }

  toBorderImageOffsetCSS() {
    return Object.keys(this.json.offset).map(key => {
      return this.json.offset[key].toString()
    }).join(' ')
  }

  toBorderImageCSS(isExport = false) {
    if (!this.json.image) return {};

    var image = this.json.image.toString(isExport);

    return {
      "border-image-source": `${image}`
    };
  }

  toBorderImageRepeatCSS () {
    if (!this.json.repeat) return {}     
    return {
      'border-image-repeat': `${this.json.repeat}`
    }
  }

  toBorderImageWidthCSS () {

    if (!this.json.width) return {} 

    var filters = Object.keys(this.json.width).filter(key => {
      return this.json.width[key].value > 0 
    })

    if (filters.length === 0) return {} 

    var cssText = Object.keys(this.json.width).map(key => {
      return this.json.width[key].toString()
    }).join(' ')

    return {
      'border-image-width': `${cssText}`
    }
  }

  toBorderImageSliceCSS () {
    if (!this.json.slice) return {} 
    var cssText = Object.keys(this.json.slice).map(key => {
      var len = this.json.slice[key];
      return len.isPercent() ? len.toString() : len.value;
    }).join(' ')

    return {
      'border-image-slice': `${cssText}`
    }
  }

  toCSS(isExport = false) {
    var results = {
      ...this.toBorderImageCSS(isExport),
      ...this.toBorderImageRepeatCSS(),
      ...this.toBorderImageSliceCSS(),
      ...this.toBorderImageWidthCSS(),
    };

    return results;
  }

  toString() {
    return keyMap(this.toCSS(), (key, value) => {
      return `${key}: ${value}`;
    }).join(";");
  }

  static parse(obj) {
    return new BorderImage(obj);
  }

  static parseStyle(style) {
    var borderImage = null;
    var reg = /((linear\-gradient|repeating\-linear\-gradient|radial\-gradient|repeating\-radial\-gradient|conic\-gradient|repeating\-conic\-gradient|url)\(([^\)]*)\))/gi;

    if (style["border-image"]) {
      var results = convertMatches(style["border-image"]);

      results.str.match(reg).forEach((value, index) => {
        let image = null;
        value = reverseMatches(value, results.matches);

        const arr = style['border-image'].replace(value, '').split(' ').map(str => Length.parse(str))

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

        borderImage = new BorderImage({
          type: image.type,
          image
        });

        var numbers = arr.filter(it => isNumber(it.value));

        if (numbers.length === 1) {
          borderImage.reset({
            slice: {
              top: numbers[0].clone(),
              bottom: numbers[0].clone(),
              left: numbers[0].clone(),
              right: numbers[0].clone()
            }
          })
        } else if (numbers.length === 2) {
          borderImage.reset({
            slice: {
              top: numbers[0].clone(),
              bottom: numbers[0].clone(),
              left: numbers[1].clone(),
              right: numbers[1].clone()
            }
          })
        } else if (numbers.length === 3) {
          borderImage.reset({
            slice: {
              top: numbers[0].clone(),
              bottom: numbers[2].clone(),
              left: numbers[1].clone(),
              right: numbers[1].clone()
            }
          })
        } else if (numbers.length === 4) {
          borderImage.reset({
            slice: {
              top: numbers[0].clone(),
              bottom: numbers[2].clone(),
              left: numbers[3].clone(),
              right: numbers[1].clone()
            }
          })          
        }

      });
    }

    return borderImage;
  }
}
