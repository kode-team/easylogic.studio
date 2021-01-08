import DomRender from "./DomRender";

export default class ArtBoardRender extends DomRender {

  toCloneObject (item, renderer) {
    return {
      ...super.toCloneObject(item, renderer),
      ...item.attrs('name'),
    }
  }
}