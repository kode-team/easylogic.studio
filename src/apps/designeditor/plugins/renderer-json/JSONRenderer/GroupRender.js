import BaseAssetRender from "./BaseAssetRender";

export default class GroupRender extends BaseAssetRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "layout",
        "constraintsHorizontal",
        "constraintsVertical",
        "resizingMode",
        // flex layout
        "flexDirection",
        "flexWrap",
        "flexFlow",
        "justifyContent",
        "alignItems",
        "alignContent",
        "order",
        "flexBasis",
        "flexGrow",
        "flexShrink",
        "gap",
        // grid layout
        "gridTemplateRows",
        "gridTemplateColumns",
        "gridTemplateAreas",
        "gridAutoRows",
        "gridAutoColumns",
        "gridAutoFlow",
        // grid layout item
        "gridColumnStart",
        "gridColumnEnd",
        "gridRowStart",
        "gridRowEnd",
        "gridColumnGap",
        "gridRowGap",
        // animation
        "animation",
        "transition",
        // box model
        "paddingTop",
        "paddingRight",
        "paddingLeft",
        "paddingBottom"
      ),
    };
  }
}
