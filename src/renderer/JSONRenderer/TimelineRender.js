import AssetRender from "./AssetRender";

export default class TimelineRender extends AssetRender {

  toCloneObject (item, renderer) {
    return {
      ...super.toCloneObject(item, renderer),
      ...item.attrs(
        'timeline',      
      )
    }
  }
}