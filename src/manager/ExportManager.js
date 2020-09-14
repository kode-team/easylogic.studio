import { CSS_TO_STRING } from "@core/functions/func";
import AnimationExport from "../exporter/animation-export/AnimationExport";

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

  generate (editor) {
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

    var js = AnimationExport.generate(project, artboard, 'anipa')

    html = editor.replaceLocalUrltoRealUrl(html);
    css = editor.replaceLocalUrltoRealUrl(css);
    js = editor.replaceLocalUrltoRealUrl(js);

  
    return { html, css, js }
  },

  generateSVG (editor, rootItem) {
    return editor.replaceLocalUrltoRealUrl(rootItem.generateSVG(true));
  }

}