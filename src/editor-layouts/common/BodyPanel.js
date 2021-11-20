import { BIND, CONFIG, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import HorizontalRuler from "./body-panel/HorizontalRuler";
import VerticalRuler from "./body-panel/VerticalRuler";
import CanvasView from "./body-panel/CanvasView";

import './BodyPanel.scss';
import PageSubEditor from './body-panel/PageSubEditor';

export default class BodyPanel extends EditorElement {

  components() {
    return {
      CanvasView,
      VerticalRuler,
      HorizontalRuler,
      PageSubEditor
    }
  }

  template() {
    return /*html*/`
      <div class="elf--body-panel">
        <div class="submenu-area">
          <object refClass="PageSubEditor" />
        </div>
        <div class='editing-area'>
          <object refClass='HorizontalRuler' />
          <object refClass='VerticalRuler' />
          <object refClass='CanvasView' />        
        </div>
      </div>
    `;
  }

  [BIND('$el')] () { 
    return {
        class: `elf--body-panel ${this.$config.get('show.ruler') ? 'ruler' : ''}`
    }
  }  

  [CONFIG('show.ruler')] () {
    this.refresh();
  }

  [SUBSCRIBE('bodypanel.toggle.fullscreen')] () {
    this.refs.$el.toggleFullscreen();
  }
}