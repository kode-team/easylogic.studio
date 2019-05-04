import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK } from "../../../../util/Event";
import { Length } from "../../../../editor/unit/Length";

export default class PredefinedRadialGradientPosition extends UIElement {
  template() {
    return ` 
            <div class="predefined-angluar-group radial-position">
                <button type="button" data-value="top"></button>                          
                <button type="button" data-value="left"></button>                                                  
                <button type="button" data-value="bottom"></button>                            
                <button type="button" data-value="right"></button>                                        
            </div>
        `;
  }
  [CLICK("$el button")](e) {
    const radialPosition = Length.string(e.$delegateTarget.attr("data-value"));

    this.emit("changeGradientPosition", {
      radialPosition
    });
  }

  [EVENT("showGradientPosition")]() {
    this.$el.show();
  }

  [EVENT("hideGradientPosition")]() {
    this.$el.hide();
  }
}
