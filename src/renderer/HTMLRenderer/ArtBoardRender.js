import DomRender from "./DomRender";

export default class ArtBoardRender extends DomRender {

  /**
   * Artboard 템플릿 설정 
   * 
   * @param {Item} item 
   * @param {Renderer} renderer
   * @override
   */
  render (item, renderer) {
    var {elementType, id, name, itemType} = item;
  
    const tagName = elementType || 'div'
  
    return /*html*/`    
      <${tagName} class="element-item artboard" data-id="${id}">
        <div class='artboard-title'>${name}</div>
        ${this.toDefString(item)}
        ${item.layers.map(it => {
          return renderer.render(it, renderer)
        }).join('\n\t')}
      </${tagName}>
    `
  }
}