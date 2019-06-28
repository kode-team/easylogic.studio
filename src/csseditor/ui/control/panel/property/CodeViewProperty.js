import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";

import { EVENT } from "../../../../../util/UIElement";

import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import { CSS_TO_STRING } from "../../../../../util/css/make";

export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return "CodeView";
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION,'refreshCanvas' ) + DEBOUNCE(10) ]() {
    this.refresh();
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return `
      <div class="property-item code-view-item" ref='$body'></div>
    `;
  }

  filterKeyName (str) {
    return str.split(';').filter(it => it.trim()).map(it => {
      it = it.trim();
      var [key, value] = it.split(':')

      return `<strong>${key}</strong>:${value};\n` 
    }).join('').trim()
  }

  modifyNewLine (str) {
    return str.replace(/;/gi, ";\n").trim()
  }

  [LOAD('$body')] () {
    var current = editor.selection.current;

    var cssCode = current ? current.toExport().replace(/;/gi, ";\n") : ''
    var keyframeCode = current ? current.toKeyframeString() : ''
    var rootVariable = current ? CSS_TO_STRING(current.toRootVariableCSS()) : ''
    var svgCode = current ? current.toSVGString() : '';
    var selectorCode = current ? current.selectors : [];

    cssCode = this.filterKeyName(cssCode.trim())
    rootVariable = this.filterKeyName(rootVariable.trim());
    keyframeCode = this.modifyNewLine(keyframeCode.trim());
    svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')

    return `
      <div class=''>
        ${keyframeCode ?         
          `<div>
          <pre title='Keyframe'>${keyframeCode}</pre>
        </div>` : ''}
        ${rootVariable ? 
          `<div>
          <label>:root</label>
          <pre>${rootVariable}</pre>
          </div>` : ''
        }

        ${cssCode ? 
          `<div>
          <pre title='CSS'>${cssCode}</pre>
          </div>` : ''
        }

        ${selectorCode.length ? 
          `<div>
            ${selectorCode.map(selector => {
              return `<pre title='${selector.selector}'>${selector.toPropertyString()}</pre>`
            })}
            
          </div>` : ''
        }

        ${svgCode ? 
          `<div>
          <pre title='SVG'>${svgCode}</pre>
          </div>` : ''
        }

      </div>
    `

  }
}
