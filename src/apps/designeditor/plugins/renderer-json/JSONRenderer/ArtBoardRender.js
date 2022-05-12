import DomRender from "./DomRender";

export default class ArtBoardRender extends DomRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("name"),
    };
  }
}
