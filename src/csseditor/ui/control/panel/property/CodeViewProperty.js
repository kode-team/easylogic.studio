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

  refresh() {
    this.load();
  }

  getBody() {
    return html`
      <div class="property-item code-view-item" ref='$body'>
        ${this.loadTemplate('$body')}
      </div>
    `;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current;

    var cssCode = current ? current.toExport().replace(/;/gi, ";" + NEW_LINE) + ";" : EMPTY_STRING
    var keyframeCode = current ? current.toKeyframeString() : EMPTY_STRING
    return `
      <div class=''>
        <div>
          <label>Keyframe</label>
          <pre>${keyframeCode}</pre>
        </div>              
        <div>
          <label>CSS</label>
          <pre>${cssCode}</pre>
        </div>
      </div>
    `

  }
}
