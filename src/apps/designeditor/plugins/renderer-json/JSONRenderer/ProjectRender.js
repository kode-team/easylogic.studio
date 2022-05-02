import TimelineRender from "./TimelineRender";

export default class ProjectRender extends TimelineRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("name", "description", "rootVariable"),
    };
  }
}
