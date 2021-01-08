import ItemRender from "./ItemRender";

export default class MovableRender extends ItemRender {
  
  toCloneObject (item, renderer) {
    return {
      ...super.toCloneObject(item, renderer),
      ...item.attrs(
        'x', 'y', 'width', 'height'
      )
    }
  }

}