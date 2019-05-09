import UIElement, { EVENT } from "../../../util/UIElement";
import ColorPicker from "../../../colorpicker/index";
import icon from "../icon/icon";
import { CLICK, CHANGE } from "../../../util/Event";
import { EMPTY_STRING } from "../../../util/css/types";
import { html } from "../../../util/functions/func";
import { Length, Position } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";

const tabs = [
  { type: "static-gradient", title: "Static Gradient" },
  { type: "linear-gradient", title: "Linear Gradient" },
  { type: "repeating-linear-gradient", title: "Repeating Linear Gradient" },
  { type: "radial-gradient", title: "Radial Gradient" },
  { type: "repeating-radial-gradient", title: "Repeating Radial Gradient" },
  { type: "conic-gradient", title: "Conic Gradient" },
  { type: "repeating-conic-gradient", title: "Repeating Conic Gradient" },
  { type: "image", title: "Image", icon: icon.image }
];

export default class FillPicker extends UIElement {
  afterRender() {
    // this.$el.hide();

    var defaultColor = "rgba(0, 0, 0, 0)";

    this.colorPicker = ColorPicker.create({
      type: "sketch",
      position: "inline",
      container: this.refs.$color.el,
      color: defaultColor,
      onChange: c => {
        this.changeColor(c);
      }
    });

    setTimeout(() => {
      this.colorPicker.dispatch("initColor", defaultColor);
    }, 100);
  }

  initialize() {
    super.initialize();

    this.selectedTab = "image";
  }

  template() {
    return html`
      <div class="fill-picker">
        <div class="picker-tab">
          <div class="picker-tab-list" ref="$tab" data-value="static-gradient">
            ${tabs.map(it => {
              return `
                <span 
                    class='picker-tab-item ${
                      it.selected ? "selected" : EMPTY_STRING
                    }' 
                    data-selected-value='${it.type}'
                    title='${it.title}'
                >
                    <div class='icon'>${it.icon || EMPTY_STRING}</div>
                </span>`;
            })}
          </div>
        </div>
        <div class="picker-tab-container" ref="$tabContainer">
          <div
            class="picker-tab-content"
            data-content-type="color"
            ref="$color"
          ></div>
          <div
            class="picker-tab-content"
            data-content-type="image"
            ref="$image"
          >
            <div class="image-preview">
              <figure>
                <img src="" ref="$imagePreview" />
                <div class="select-text">Select a image</div>
              </figure>
              <input type="file" ref="$imageFile" accept="image/*" />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CHANGE("$imageFile")](e) {
    var files = this.refs.$imageFile.files;

    //화면 표시 하기
    // files.length 따라 Preview 에 표시 하기
    // URL.createObjectUrl 로 임시 url 생성 (임시 URL 은 어디서 관리하나)
    // emit('changeFillPicker', { images: [........] })

    var images = files.map(file => {
      return editor.createUrl(file);
    });

    if (images) {
      this.refs.$imagePreview.attr("src", images[0]);
      this.emit("changeFillPicker", { type: "image", images });
    }
  }

  [CLICK("$tab .picker-tab-item")](e) {
    const type = e.$delegateTarget.attr("data-selected-value");

    //TODO: picker 타입이 바뀌면 내부 속성도 같이 바뀌어야 한다.
    this.selectTabContent(type, {
      type,
      selectTab: true
    });
  }

  selectTabContent(type, data = {}) {
    this.selectedTab = type;
    this.refs.$tab.attr("data-value", type);
    this.refs.$tabContainer.attr(
      "data-value",
      type === "image" ? "image" : "color"
    );
    switch (type) {
      case "image": // image
        if (data.url) {
          this.refs.$imagePreview.attr("src", data.url);
        }
        this.emit("hideGradientEditor");
        break;
      default:
        // gradient
        let sample = {
          refresh: data.refresh || false,
          type: data.type || "static-gradient",
          selectColorStepId: data.selectColorStepId,
          angle: data.angle || 0,
          radialType: data.radialType,
          radialPosition: data.radialPosition
        };
        if (data.colorsteps) {
          sample.colorsteps = data.colorsteps;
        }

        this.emit("showGradientEditor", sample, data.selectTab);

        break;
    }
  }

  changeColor(color) {
    this.emit("changeColorPicker", color);
  }

  [EVENT("showFillPicker")](data) {
    this.$el
      .css({
        top: Length.px(330),
        right: Length.px(10)
      })
      .show();

    this.selectTabContent(data.type, data);
    // this.emit('hidePropertyPopup')
    this.emit("hidePicker");
  }

  [EVENT("hideFillPicker", "hidePicker", "hidePropertyPopup")]() {
    this.$el.hide();

    this.emit("hideGradientEditor");
  }

  [EVENT("selectColorStep")](color) {
    this.colorPicker.initColorWithoutChangeEvent(color);
  }

  [EVENT("changeColorStep")](data = {}) {
    this.emit("changeFillPicker", {
      type: this.selectedTab,
      ...data
    });
  }
}
