import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { DEBOUNCE, LOAD } from "../../../util/Event";
import Dom from "../../../util/Dom";
import { CSS_TO_STRING } from "../../../util/functions/func";

export default class StyleView extends UIElement {

  template() {
    return `
    <div class='style-view' style='position: absolute;display:inline-block;left:-1000px;'>
      <div ref='$svgArea'>
        <svg width="0" height="0" ref='$svg'></svg>   
      </div>
    </div>
    `;
  }

  initialize() {
    super.initialize()

    this.refs.$head = Dom.create(document.head)
  }

  makeStyle (item) {
    const {
      rootVariable, 
      css, 
      selectorString, 
      keyframeString 
    } = item.generateView(`[data-id='${item.id}']`)
    return `<style type='text/css' data-id='${item.id}'>
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }

      /* element */
      [data-id='${item.id}'] { 
        ${CSS_TO_STRING(css)}; 
      }  

      ${selectorString}

      /* keyframe */
      ${keyframeString}
    </style>
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    }).join('')
  }

  refreshStyleHead () {
    var $temp = Dom.create('div')
    var project = editor.selection.currentProject || { layers : [] }

    this.refs.$head.$$(`style`).forEach($style => $style.remove())

    project.artboards.forEach(item => {
      $temp.html(this.makeStyle(item)).children().forEach($item => {
        this.refs.$head.append($item);
      })
    })
  }

  refreshStyleHeadOne (item) {
    var $temp = Dom.create('div')    
    this.refs.$head.$$(`style[data-id="${item.id}"]`).forEach($style => $style.remove())
    $temp.html(this.makeStyle(item)).children().forEach($item => {
      this.refs.$head.append($item);
    })    
  }


  makeSvg (item) {
    const SVGString = item.toSVGString()
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : ''}
    ` + item.layers.map(it => {
      return this.makeSvg(it);
    })
  }

  [LOAD('$svgArea')] () {

    var project = editor.projects[0] || { layers : [] }

    return project.layers.map(item => {
      return this.makeSvg(item)
    })
  }   

  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

  [EVENT('refreshStyleView')] (current) {
    if (current) {
      this.refreshStyleHeadOne(current);
    } else {
      this.refresh()
    }
  }

  [EVENT('refreshSelectionStyleView')] () {

    editor.selection.each(item => {
      this.refreshStyleHeadOne(item);
    })
  }  

  refresh() {
    this.load();
    this.refreshStyleHead();
  }
}
