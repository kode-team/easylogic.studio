import BaseAssetRender from './BaseAssetRender';

export default class GroupRender extends BaseAssetRender {
  
  async toCloneObject (item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        'layout', 
        'constraints-horizontal',
        'constraints-vertical',
        'resizingMode',        
        // flex layout 
        'flex-direction',
        'flex-wrap',
        'flex-flow',
        'justify-content',  
        'align-items',
        'align-content',
        'order',
        'flex-basis',
        'flex-grow',
        'flex-shrink',
        'gap',
        // grid layout
        'grid-template-rows',
        'grid-template-columns',
        'grid-template-areas',
        'grid-auto-rows',
        'grid-auto-columns',
        'grid-auto-flow',
        // animation
        'animation',
        'transition',
        // box model
        'padding-top',
        'padding-right',
        'padding-left',
        'padding-bottom',
      )
    }
  }

}