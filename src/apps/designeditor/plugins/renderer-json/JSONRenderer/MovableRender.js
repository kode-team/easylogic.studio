import GroupRender from "./GroupRender";

export default class MovableRender extends GroupRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "x",
        "y",
        "right",
        "bottom",
        "width",
        "height",
        "angle",
        "transformOrigin"
      ),
    };
  }
}
