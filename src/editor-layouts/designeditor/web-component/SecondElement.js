import { SUBSCRIBE_SELF } from 'el/sapa/Event';
import UIElement from 'el/sapa/UIElement';

export default class SecondElement extends UIElement {
    template() {
      return "<div>Second Element</div>"
    }
  
    afterRender() {
      this.trigger("yellow");
    }
  
    [SUBSCRIBE_SELF("yellow")] () {
      console.log('called [yellow] message')
    }
}