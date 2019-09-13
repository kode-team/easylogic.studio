import { CSS_TO_STRING } from "../util/functions/func";
import { editor } from "./editor";
import { Length } from "./unit/Length";
import AnimationExport from "./export/animation-export/AnimationExport";

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

    // artboard.reset({
    //   x: Length.px(0),
    //   y: Length.px(0)
    // })

    var css = `
      ${this.makeStyle(project)}
      ${this.makeStyle(artboard, `
        left: 0px;
        top: 0px;
      `)}
    `
    var html = `
      ${artboard.html}
      ${this.makeSvg(project)}
    `

    var js = AnimationExport.generate(artboard, 'anipa')

    html = this.replaceLocalUrltoRealUrl(html);
    css = this.replaceLocalUrltoRealUrl(css);
    js = this.replaceLocalUrltoRealUrl(js);

  
    return { html, css, js }
  },

  replaceLocalUrltoRealUrl (str) {

    var project = editor.selection.currentProject;
    var images = {} 

    project.images.forEach(a => {

      if (str.indexOf(a.local) > -1) { 
        images[a.local]  = a.original
      }

    })

    Object.keys(images).forEach(local => {
      str = str.replace(new RegExp(local, 'g'), images[local])
    })
    
    return str; 
  }
}