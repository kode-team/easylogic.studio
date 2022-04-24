import { FilterClass } from "./Filter";
import { BackgroundImage } from "./BackgroundImage";
import { BoxShadow } from "./BoxShadow";
import { BorderImage } from "./BorderImage";
import { PatternClass } from "./Pattern";

export default {
  ...PatternClass,
  ...FilterClass,
  BackgroundImage,
  BorderImage,
  BoxShadow,
};
