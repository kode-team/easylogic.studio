import Dom from '@core/Dom';
import { CSS_TO_STRING, TAG_TO_STRING } from '@core/functions/func';
import { Item } from '@items/Item';
import ArtBoardRender from './ArtBoardRender';
import CircleRender from './CircleRender';
import CubeRender from './CubeRender';
import ImageRender from './ImageRender';
import ProjectRender from './ProjectRender';
import RectRender from './RectRender';
import SVGPathRender from './SVGPathRender';
import SVGTextPathRender from './SVGTextPathRender';
import SVGTextRender from './SVGTextRender';
import TextRender from './TextRender';
import VideoRender from './VideoRender';



function filterKeyName (str, prefixPadding = '') {
    return str.split(';').filter(it => it.trim()).map(it => {
      it = it.trim();
      var [key, value] = it.split(':')

      return `${prefixPadding}<strong>${key}</strong>:${value};\n` 
    }).join('').trim()
}

function modifyNewLine (str) {
    return str.replace(/;/gi, ";\n").trim()
}

const renderers = {
    'project': new ProjectRender(),
    'artboard': new ArtBoardRender(),
    'rect': new RectRender(),
    'circle': new CircleRender(),
    'image': new ImageRender(),
    'text': new TextRender(),
    'video': new VideoRender(),
    'svg-path': new SVGPathRender(),
    'svg-text': new SVGTextRender(),
    'svg-textpath': new SVGTextPathRender(),
    'cube': new CubeRender(),
}

export default {
    /**
     * 
     * @param {Item} item 
     */
    render (item, renderer) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.render(item, renderer || this);
        }
    },

    renderSVG (item, renderer) {

        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.renderSVG(item, renderer || this);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toCSS(item);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toNestedCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toNestedCSS(item);
        }
    },    

    /**
     * 
     * @param {Item} item 
     */
    toTransformCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toTransformCSS(item);
        }
    },    

    /**
     * 
     * 렌더링 될 style 태그를 리턴한다. 
     * 
     * @param {Item} item 
     */
    toStyle (item, renderer) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toStyle(item, renderer || this);
        }
    },

    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement
     */
    update (item, currentElement) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.update(item, currentElement);
        }
    }, 

    /**
     * 코드 뷰용 HTML 코드를 렌더링 한다. 
     * @param {Item} item 
     */
    codeview (item) {

        if (!item) {
            return '';
        }

        const currentProject = item.top;
        let keyframeCode = modifyNewLine(filterKeyName(currentProject ? currentProject.toKeyframeString() : ''))
        let rootVariable = currentProject ? CSS_TO_STRING(currentProject.toRootVariableCSS()) : ''
        let svgCode = this.renderSVG(currentProject);
        svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') 
    
        const current = item;
        const cssCode = filterKeyName(current ? TAG_TO_STRING( CSS_TO_STRING( this.toCSS(current) ) ) : '')
        const nestedCssCode = current ? this.toNestedCSS(current).map(it => {
            var cssText = it.cssText ? it.cssText : CSS_TO_STRING(it.css)
            return `${it.selector} { 
    ${filterKeyName(TAG_TO_STRING(cssText), '&nbsp;&nbsp;')}
    }`
        }) : []
        const selectorCode = current ? current.selectors : [];
    
    
        return /*html*/`
          <div class=''>
           
            ${cssCode && /*html*/`<div><pre title='CSS'>${cssCode}</pre></div>`}
            
            ${nestedCssCode.map(it => {
              return /*html*/`<div><pre title='CSS'>${it}</pre></div>`
            }).join('')}
    
            ${selectorCode.length ? 
              /*html*/`<div>
                ${selectorCode.map(selector => {
                  return `<pre title='${selector.selector}'>${selector.toPropertyString()}</pre>`
                }).join('')}
                
              </div>` : ''
            }
    
            ${keyframeCode && /*html*/`<div><pre title='${this.$i18n('code.view.property.keyframe')}'>${keyframeCode}</pre></div>`}

            ${rootVariable ? 
              /*html*/`<div>
              <label>:root</label>
              <pre>${rootVariable}</pre>
              </div>` : ''
            }
    
          </div>
        `
    
    }
}