
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { BIND } from "el/sapa/Event";

export default class SingleInspector extends EditorElement {

  afterRender() {
    this.$el.toggle(this.$config.get('editor.design.mode') === 'item');
  }

  [BIND('$el')] () {
    return {
      style: {
        display: this.$config.get('editor.design.mode') === 'item' ? 'block' : 'none'
      }
    }
  }

  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
              <object refClass="AlignmentProperty" />
              <object refClass="BooleanProperty" />              

              <!-- Default Property --> 
              <object refClass="PositionProperty" />
              <object refClass="AppearanceProperty" />                                   

              ${this.$injectManager.generate('inspector.tab.style')}                             
              <div class='empty'></div>
        </div>
      </div>
    `;
  }
}