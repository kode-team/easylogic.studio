import { BackgroundImage } from "./BackgroundImage";
import { BorderImage } from "./BorderImage";
// import { BoxShadow } from "./BoxShadow";
import { FilterClass } from "./Filter";
import { PatternClass } from "./Pattern";

export default {
  ...PatternClass,
  ...FilterClass,
  BackgroundImage,
  BorderImage,
  // BoxShadow,
};
