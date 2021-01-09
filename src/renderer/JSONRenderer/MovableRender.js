import ItemRender from "./ItemRender";

export default class MovableRender extends ItemRender {
  
  async toCloneObject (item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        'x', 'y', 'width', 'height'
      )
    }
  }

}