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

  makeProjectStyle (item) {

    const keyframeString = item.toKeyframeString();
    const rootVariable = item.toRootVariableCSS()
    
    return `<style type='text/css' data-id='${item.id}'>
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }
      /* keyframe */
      ${keyframeString}
    </style>
    `
  }  

  makeStyle (item) {

    if (item.is('project')) {
      return this.makeProjectStyle(item);
    }

    const cssString = item.generateView(`[data-id='${item.id}']`)
    return `<style type='text/css' data-id='${item.id}'>${cssString}</style>
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    }).join('')
  }

  refreshStyleHead () {
    var project = editor.selection.currentProject || { layers : [] }

    this.refs.$head.$$(`style`).forEach($style => $style.remove())

    // project setting 
    this.changeStyleHead(project)

    // artboard setting 
    project.artboards.forEach(item => this.changeStyleHead(item))
  }

  changeStyleHead (item) {
    var $temp = Dom.create('div')        
    $temp.html(this.makeStyle(item)).children().forEach($item => {
      this.refs.$head.append($item);
    })
  }

  refreshStyleHeadOne (item) {
    this.refs.$head.$$(`style[data-id="${item.id}"]`).forEach($style => $style.remove())
    this.changeStyleHead(item)
  }


  makeSvg (project) {
    const SVGString = project.toSVGString ? project.toSVGString() : ''
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : ''}
    `
  }

  [LOAD('$svgArea')] () {

    var project = editor.selection.currentProject || {  }

    return this.makeSvg(project)
  }   

  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

  // timeline 에서 테스트 할 때 이걸 활용할 수 있다. 
  // 움직이기 원하는 객체가 타임라인 전체라 
  // 전체를 리프레쉬 하는걸로 한다. 
  // 애니메이션이 진행되는 동안 임의의 객체는 없는 것으로 하자. 
  [EVENT('refreshStyleView', 'moveTimeline')] (current) {   
    if (current) {
      this.load();
      this.refreshStyleHeadOne(current);
    } else {
      this.refresh()
    }
  }

  [EVENT('refreshSVGArea')] () {
    this.load('$svgArea');
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
