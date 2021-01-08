import ItemRender from "./ItemRender";

export default class AssetRender extends ItemRender {

  toCloneObject (item, renderer) {
    return {
      ...super.toCloneObject(item, renderer),
      ...item.attrs(
        'colors',
        'gradients',
        'svgfilters',
        'svgimages',
        'images',
        'keyframes',      
      )
    }
  }
}