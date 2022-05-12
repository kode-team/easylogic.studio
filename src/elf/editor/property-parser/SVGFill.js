import { SVGImageResource } from "./image-resource/SVGImageResource";
import { SVGLinearGradient } from "./image-resource/SVGLinearGradient";
import { SVGRadialGradient } from "./image-resource/SVGRadialGradient";
import { SVGStaticGradient } from "./image-resource/SVGStaticGradient";

import { PropertyItem } from "elf/editor/items/PropertyItem";
import { GradientType } from "elf/editor/types/model";
import { parseOneValue } from "elf/utils/css-function-parser";

export class SVGFill extends PropertyItem {
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
      image: SVGFill.createImage(data.images[0]),
    });
  }

  static createImage(url) {
    // eslint-disable-next-line no-undef
    return new SVGLImageResource({ url });
  }

  setGradient(data) {
    this.reset({
      type: data.type,
      image: SVGFill.createGradient(data, this.json.image),
    });
  }

  static createGradient(data, gradient) {
    const colorsteps = data.colorsteps || gradient.colorsteps;

    let json = gradient.toJSON();
    delete json.itemType;
    delete json.type;

    switch (data.type) {
      case GradientType.LINEAR:
        return new SVGLinearGradient({ ...json, colorsteps });
      case GradientType.RADIAL:
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

  static parseImage(str = "") {
    const result = parseOneValue(str);

    let image = null;

    if (!result) {
      return SVGStaticGradient.create(str || "transparent");
    }

    switch (result.func) {
      case GradientType.LINEAR:
        image = SVGLinearGradient.parse(result.matchedString);
        break;
      case GradientType.RADIAL:
        image = SVGRadialGradient.parse(result.matchedString);
        break;
      case GradientType.URL:
        image = SVGImageResource.parse(result.matchedString);
        break;
      default:
        image = SVGStaticGradient.create(result.matchedString);
        break;
    }

    return image;
  }

  static changeImageType(options) {
    switch (options.type) {
      case GradientType.LINEAR:
        return new SVGLinearGradient(options);
      case GradientType.RADIAL:
        return new SVGRadialGradient(options);
      case "image-resource":
      case GradientType.URL:
        return new SVGImageResource(options);
      default:
        return new SVGStaticGradient(options);
    }
  }
}
