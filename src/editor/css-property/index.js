import { BackdropFilterClass } from "./BackdropFilter";
import { FilterClass } from "./Filter";
import { BackgroundImage } from "./BackgroundImage";
import { BoxShadow } from "./BoxShadow";
import { BorderImage } from "./BorderImage";

export default {
  ...BackdropFilterClass,
  ...FilterClass,
  BackgroundImage,
  BorderImage,
  BoxShadow
};
