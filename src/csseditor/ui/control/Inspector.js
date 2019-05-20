import UIElement from "../../../util/UIElement";
import { html } from "../../../util/functions/func";
import property from "./panel/property/index";
import { CLICK } from "../../../util/Event";
import icon from "../icon/icon";

export default class Inspector extends UIElement {
  template() {
    return html`
      <div class="feature-control">
        <div class="tab number-tab" data-selected-value="1" ref="$tab">
          <div class="tab-header" ref="$header">
            <div class="tab-item selected" data-value="1">
              <div class='icon'>${icon.paint}</div>
              <lable>Style</label>
            </div>
            <div class="tab-item" data-value="2">
              <div class='icon'>${icon.title}</div>
              <lable>Content</label>
            </div>
          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content" data-value="1">
              <SizeProperty />
              <BoxModelProperty />
              <BorderProperty />
              <BorderRadiusProperty />
              <BorderImageProperty />
              <OutlineProperty />              
              <BackgroundColorProperty />
              <FillProperty />
              <BoxShadowProperty />
              <FilterProperty />
            </div>
            <div class="tab-content" data-value="2">
              <ContentProperty />
              <FontColorProperty />
              <FontProperty />
              <TextShadowProperty />
              <TextProperty />
              <FontSpacingProperty />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  components() {
    return property;
  }

  refresh() {
    this.load();
  }

  [CLICK("$header .tab-item")](e) {
    this.refs.$tab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }
}
