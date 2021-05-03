import { BIND, SUBSCRIBE } from "el/base/Event";

import "el/editor/ui/view/CanvasView";
import "el/editor/ui/view/HorizontalRuler";
import "el/editor/ui/view/VerticalRuler";

import { registElement } from "el/base/registElement";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class BodyPanel extends EditorElement {

  template() {
    return /*html*/`
      <div class="body-panel" ref='$bodyPanel'>
        <object refClass='HorizontalRuler' />
        <object refClass='VerticalRuler' />
        <object refClass='CanvasView' />        
      </div>
    `;
  }

  [BIND('$el')] () { 
    return {
      class: {
       ruler:  this.$config.get('ruler.show')
      }
    }
  }  

  [SUBSCRIBE('config:ruler.show')] () {
    this.refresh();
  }

  [SUBSCRIBE('bodypanel.toggle.fullscreen')] () {
    this.refs.$el.toggleFullscreen();
  }
}

registElement({ BodyPanel })