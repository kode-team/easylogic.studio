import BaseAssetRender from './BaseAssetRender';

export default class MovableRender extends BaseAssetRender {
  
  async toCloneObject (item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        'x', 'y', 'right','bottom', 'width', 'height', 'transform', 'transform-origin',
      )
    }
  }

}