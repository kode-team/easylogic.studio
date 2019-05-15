import { BackdropFilterClass } from "./BackdropFilter";
import { FilterClass } from "./Filter";
import { BackgroundImage } from "./BackgroundImage";
import { BoxShadow } from "./BoxShadow";

export default {
  ...BackdropFilterClass,
  ...FilterClass,
  BackgroundImage,
  BoxShadow
};
