import BaseProperty from "./BaseProperty";
import { INPUT, BIND, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";

import { EVENT } from "../../../../../util/UIElement";

import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import { EMPTY_STRING, NEW_LINE } from "../../../../../util/css/types";
import { CSS_TO_STRING } from "../../../../../util/css/make";

export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return "CodeView";
  }

  [EVENT(
    CHANGE_EDITOR, 
    CHANGE_ARTBOARD, 
    CHANGE_SELECTION,
    'refreshCanvas'
  )]() {
    this.refresh();
  }

  getBody() {
    return html`
      <div class="property-item code-view-item" ref='$body'></div>
    `;
  }

  filterKeyName (str) {
    return str.split(';').filter(it => it.trim()).map(it => {
      it = it.trim();
      var [key, value] = it.split(':')

      return `<strong>${key}</strong>:${value};${NEW_LINE}` 
    }).join(EMPTY_STRING)
  }

  modifyNewLine (str) {
    return str.replace(/;/gi, ";" + NEW_LINE)
  }

  [LOAD('$body')] () {
    var current = editor.selection.current;

    var cssCode = current ? current.toExport().replace(/;/gi, ";" + NEW_LINE) : EMPTY_STRING
    var keyframeCode = current ? current.toKeyframeString() : EMPTY_STRING
    var rootVariable = current ? CSS_TO_STRING(current.toRootVariableCSS()) : EMPTY_STRING

    cssCode = this.filterKeyName(cssCode)
    rootVariable = this.filterKeyName(rootVariable);
    keyframeCode = this.modifyNewLine(keyframeCode);

    return `
      <div class=''>
        ${keyframeCode ?         
          `<div>
          <label>Keyframe</label>
          <pre>${keyframeCode}</pre>
        </div>` : EMPTY_STRING}
        ${rootVariable ? 
          `<div>
          <label>:root</label>
          <pre>${rootVariable}</pre>
          </div>` : EMPTY_STRING
        }

        ${cssCode ? 
          `<div>
          <label>CSS</label>
          <pre>${cssCode}</pre>
          </div>` : EMPTY_STRING
        }

      </div>
    `

  }
}
