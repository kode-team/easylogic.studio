import { FilterClass } from "./Filter";
import { BackgroundImage } from "./BackgroundImage";
import { BoxShadow } from "./BoxShadow";
import { BorderImage } from "./BorderImage";
import { SVGFilterClass } from "./SVGFilter";

export default {
  ...FilterClass,
  ...SVGFilterClass,
  BackgroundImage,
  BorderImage,
  BoxShadow
};
