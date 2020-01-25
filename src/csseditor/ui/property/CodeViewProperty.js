import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { CSS_TO_STRING, TAG_TO_STRING } from "../../../util/functions/func";

const i18n = editor.initI18n('code.view.property');

export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return i18n('title');
  }

  [EVENT(
    'refreshSelectionStyleView', 
    'refreshStyleView',
    'refreshSelection',
    'refreshSVGArea'
  ) + DEBOUNCE(100) ]() {
    this.refreshShowIsNot();
  }

  getBody() {
    return `
      <div class="property-item code-view-item" ref='$body'></div>
    `;
  }

  filterKeyName (str, prefixPadding = '') {
    return str.split(';').filter(it => it.trim()).map(it => {
      it = it.trim();
      var [key, value] = it.split(':')

      return `${prefixPadding}<strong>${key}</strong>:${value};\n` 
    }).join('').trim()
  }

  modifyNewLine (str) {
    return str.replace(/;/gi, ";\n").trim()
  }

  [LOAD('$body')] () {

    var currentProject = editor.selection.currentProject;
    var keyframeCode = currentProject ? currentProject.toKeyframeString() : ''
    var rootVariable = currentProject ? CSS_TO_STRING(currentProject.toRootVariableCSS()) : ''
    var svgCode = currentProject ? currentProject.toSVGString() : '';

    rootVariable = this.filterKeyName(rootVariable.trim());
    keyframeCode = this.modifyNewLine(keyframeCode.trim());
    svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') 

    var current = editor.selection.current;
    var cssCode = current ? TAG_TO_STRING(current.toExport()) : ''
    var nestedCssCode = current ?  current.toNestedCSS().map(it => {
      var cssText = it.cssText ? it.cssText : CSS_TO_STRING(it.css)
      return `${it.selector} { 
${this.filterKeyName(TAG_TO_STRING(cssText), '&nbsp;&nbsp;')}
}`
    }) : []
    var svgPropertyCode = current ? TAG_TO_STRING(current.toExportSVGCode()) : '' 
    var selectorCode = current ? current.selectors : [];

    cssCode = this.filterKeyName(cssCode.trim())
    // svgPropertyCode = this.filterKeyName(svgPropertyCode.trim())


    return /*html*/`
      <div class=''>
       
        ${cssCode ? 
          /*html*/`<div>
          <pre title='CSS'>${cssCode}</pre>
          </div>` : ''
        }
        
        ${nestedCssCode.map(it => {
          return /*html*/`<div>
          <pre title='CSS'>${it}</pre>
          </div>`
        }).join('')}

        ${svgPropertyCode ? 
          /*html*/`<div>
          <pre title='SVG'>${svgPropertyCode}</pre>
          </div>` : ''
        }        

        ${selectorCode.length ? 
          /*html*/`<div>
            ${selectorCode.map(selector => {
              return `<pre title='${selector.selector}'>${selector.toPropertyString()}</pre>`
            }).join('')}
            
          </div>` : ''
        }

        ${keyframeCode ?         
          /*html*/`<div>
          <pre title='${i18n('keyframe')}'>${keyframeCode}</pre>
        </div>` : ''}
        ${rootVariable ? 
          /*html*/`<div>
          <label>:root</label>
          <pre>${rootVariable}</pre>
          </div>` : ''
        }
        ${svgCode ? 
          /*html*/`<div>
            <pre title='SVG'>${svgCode}</pre>
          </div>` : ''
        }

      </div>
    `

  }
}
