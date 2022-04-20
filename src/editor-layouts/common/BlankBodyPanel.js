import { SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import BlankCanvasView from "./body-panel/BlankCanvasView";

import './BlankBodyPanel.scss';
import PageSubEditor from './body-panel/PageSubEditor';
import { createComponent } from "el/sapa/functions/jsx";


export default class BlankBodyPanel extends EditorElement {

  components() {
    return {
      BlankCanvasView,
      PageSubEditor
    }
  }

  template() {
    return /*html*/`
      <div class="elf--body-panel">
        <div class="submenu-area">
          ${createComponent('PageSubEditor')}
        </div>
        <div class='editing-area'>
          <div class="canvas-layout">
            ${createComponent('BlankCanvasView')}
          </div>

        </div>
      </div>
    `;
  }


  [SUBSCRIBE('bodypanel.toggle.fullscreen')] () {
    this.refs.$el.toggleFullscreen();
  }
}