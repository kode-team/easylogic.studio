import MovableRender from "./MovableRender";

export default class DomRender extends MovableRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "position",
        "rootVariable",
        "variable",
        "filter",
        "backdropFilter",
        "backgroundColor",
        "backgroundImage",
        "textClip",
        "borderRadius",
        "border",
        "boxShadow",
        "textShadow",
        "clipPath",
        "color",
        "fontSize",
        "lineHeight",
        "textAlign",
        "textTransform",
        "textDecoration",
        "letterSpacing",
        "wordSpacing",
        "textIndent",
        "perspectiveOrigin",
        "transformStyle",
        "perspective",
        "mixBlendMode",
        "overflow",
        "opacity",
        "animation",
        "transition"
      ),
      selectors: item.selectors.map((selector) => selector.clone()),
      svg: item.svg.map((svg) => svg.clone()),
    };
  }
}
