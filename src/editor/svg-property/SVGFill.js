import { Property } from "../items/Property"
import { convertMatches, reverseMatches } from "../../util/functions/parser";
import { SVGLinearGradient } from "../image-resource/SVGLinearGradient";
import { SVGRadialGradient } from "../image-resource/SVGRadialGradient";
import { SVGStaticGradient } from "../image-resource/SVGStaticGradient";
import { SVGImageResource } from "../image-resource/SVGImageResource";


const reg = /((linear\-gradient|radial\-gradient|url)\(([^\)]*)\))/gi;

export class SVGFill extends Property {
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
      image: SVGFill.createImage(data.images[0]) 
    });
  }

  static createImage(url) {
    return new SVGLImageResource({ url });
  }

  setGradient(data) {
    this.reset({
      type: data.type,
      image: SVGFill.createGradient(data, this.json.image)
    });
  }

  static createGradient(data, gradient) {
    const colorsteps = data.colorsteps || gradient.colorsteps;

    let json = gradient.toJSON();
    delete json.itemType;
    delete json.type;

    switch (data.type) {
      case "linear-gradient":
        return new SVGLinearGradient({ ...json, colorsteps });
      case "radial-gradient":
        return new SVGRadialGradient({ ...json, colorsteps });
      default:
        return new SVGStaticGradient({ ...json, colorsteps });
    }
  }

  get image() {
    return this.json.image;
  }

  set image(image) {
    this.json.image = image;
  }

  static parse(obj) {
    return new SVGFill(obj);
  }

  static parseImage (str) {
    var results = convertMatches(str);
    let image = null;

    var matchResult = results.str.match(reg)

    if (!matchResult) return SVGStaticGradient.create(str || 'transparent'); 

    matchResult.forEach((value, index) => {

      value = reverseMatches(value, results.matches);
      if (value.includes("linear")) {
        image = SVGLinearGradient.parse(value);
      } else if (value.includes("radial")) {
        image = SVGRadialGradient.parse(value);
      } else if (value.includes("url")) {
        image = SVGImageResource.parse(value);
      } else {
        image = SVGStaticGradient.parse(value);
      }
    });

    return image
  }

  static changeImageType (options) {

    switch  (options.type) {
    case 'linear-gradient': 
      return new SVGLinearGradient(options);     
    case 'radial-gradient': 
      return new SVGRadialGradient(options);
    case 'image-resource':
    case 'url':
      return new SVGImageResource(options);
    default: 
      return new SVGStaticGradient(options);
    }
  }
}
