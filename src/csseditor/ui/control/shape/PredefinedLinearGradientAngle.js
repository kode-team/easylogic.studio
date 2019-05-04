import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, SELF } from "../../../../util/Event";

const DEFINED_ANGLES = {
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315
};

export default class PredefinedLinearGradientAngle extends UIElement {
  template() {
    return `
            <div class="predefined-angluar-group">
                <button type="button" data-value="to right"></button>                          
                <button type="button" data-value="to left"></button>                                                  
                <button type="button" data-value="to top"></button>                            
                <button type="button" data-value="to bottom"></button>                                        
                <button type="button" data-value="to top right"></button>                                
                <button type="button" data-value="to bottom right"></button>                                    
                <button type="button" data-value="to bottom left"></button>
                <button type="button" data-value="to top left"></button>
            </div>
        `;
  }

  [CLICK("$el button") + SELF](e) {
    this.emit(
      "changeGradientAngle",
      DEFINED_ANGLES[e.$delegateTarget.attr("data-value")]
    );
  }

  [EVENT("showGradientAngle")]() {
    this.$el.show();
  }

  [EVENT("hideGradientAngle")]() {
    this.$el.hide();
  }
}
