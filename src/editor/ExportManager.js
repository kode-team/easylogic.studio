import { CSS_TO_STRING } from "../util/functions/func";
import { editor } from "./editor";
import { Length } from "./unit/Length";
import AnimationExport from "./export/animation-export/AnimationExport";
import { replaceLocalUrltoRealUrl } from "./util/Resource";

export default {

  makeProjectStyle (item) {

    const keyframeString = item.toKeyframeString();
    const rootVariable = item.toRootVariableCSS()
    
    return `
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }
      /* keyframe */
      ${keyframeString}
    `
  },

  makeStyle (item,appendCSS = '') {

    if (item.is('project')) {
      return this.makeProjectStyle(item);
    }

    const cssString = item.generateView(`[data-id='${item.id}']`, appendCSS)
    return `
    ${cssString}
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    }).join('')
  },

  makeSvg (project) {
    const SVGString = project.toSVGString ? project.toSVGString() : ''
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : ''}
    `
  },

  generate () {
    var project = editor.selection.currentProject;
    var artboard = editor.selection.currentArtboard;

    var css = `
${this.makeStyle(project)}
${this.makeStyle(artboard, `
  left: 0px;
  top: 0px;
`)}`
    var html = `
${artboard.html}
${this.makeSvg(project)}
    `

    var js = AnimationExport.generate(artboard, 'anipa')

    html = replaceLocalUrltoRealUrl(html);
    css = replaceLocalUrltoRealUrl(css);
    js = replaceLocalUrltoRealUrl(js);

  
    return { html, css, js }
  },

  generateSVG (rootItem, depth = 0) {
    var {width, height}= rootItem;

    if (depth === 0) {

      return /*html*/`
      <svg width="${width.value}" height="${height.value}" viewBox="0 0 ${width.value} ${height.value}">
        ${rootItem.layers.map(it => this.generateSVG(it, depth + 1)).join('')}
      </svg>
`
    } else if (depth > 0) {
      if (rootItem.is('svg-path')) {
        var screenX = rootItem.screenX.value;
        var screenY = rootItem.screenY.value;
        var screenWidth = rootItem.screenWidth.value;
        var screenHeight = rootItem.screenHeight.value;
        var d = rootItem.d; 

        return /*html*/`
  <g transfom="translate(${screenX},${screenY})">
    <svg x="0" y="0" width="${screenWidth}" height="${screenHeight}">
        <path d="${d}" />
    </svg>
  </g>
` 
    } else if (rootItem.is('svg-polygon')) {
      var screenX = rootItem.screenX.value;
      var screenY = rootItem.screenY.value;
      var screenWidth = rootItem.screenWidth.value;
      var screenHeight = rootItem.screenHeight.value;
      var points = rootItem.points; 

      return /*html*/`
    <g transfom="translate(${screenX},${screenY})">
    <svg x="0" y="0" width="${screenWidth}" height="${screenHeight}">
      <polygon points="${points}" />
    </svg>
    </g>
    ` 
      } else if (rootItem.enableHasChildren() && rootItem.layers.length) {
        return /*html*/`
      ${rootItem.layers.map(it => this.generateSVG(it, depth + 1)).join('')}
`
      }
    }

  }

}