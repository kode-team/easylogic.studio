import TimelineRender from "./TimelineRender";

export default class ProjectRender extends TimelineRender {

  toCloneObject (item, renderer) {
    return {
      ...super.toCloneObject(item, renderer),
      ...item.attrs('name', 'description', 'rootVariable')
    }
  }
}