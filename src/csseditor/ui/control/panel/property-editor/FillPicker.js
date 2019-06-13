import UIElement, { EVENT } from "../../../../../util/UIElement";
import ColorPicker from "../../../../../colorpicker/index";
import icon from "../../../icon/icon";
import { CLICK, CHANGE, LOAD } from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { html } from "../../../../../util/functions/func";
import { Length, Position } from "../../../../../editor/unit/Length";
import { editor } from "../../../../../editor/editor";
import { CHANGE_SELECTION } from "../../../../types/event";
import GradientEditor from "./GradientEditor";
import { Gradient } from "../../../../../editor/image-resource/Gradient";
import { ColorStep } from "../../../../../editor/image-resource/ColorStep";
import { BackgroundImage } from "../../../../../editor/css-property/BackgroundImage";

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

  components() {
    return {
      GradientEditor
    }
  }

  initState() {

    // 1. tab 이 바뀌면 gradient editor 는 변하지 않는다. 
    // 2. tab 이 바뀌면 기타 에디터 툴들이 재 생성된다. gradient editor 만 안 바뀐다. 
    // 3. 데이타 넘기는 방식을 다 문자열로 할 것인가? 
    // 4. 아님 모두다 객체로 넘길 것인가? 
    // 5. gradient 에디터가 제일 어려운 듯 하다. 

    return {
      image: {},
    }
  }

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

    this.selectedTab = "static-gradient";
  }

  template() {
    return html`
      <div class="fill-picker">
        <div class="picker-tab">
          <div class="picker-tab-list" ref="$tab" data-value="static-gradient" data-is-image-hidden="false">
            ${tabs.map(it => {
              return `
                <span 
                    class='picker-tab-item ${it.selected ? "selected" : EMPTY_STRING}' 
                    data-selected-value='${it.type}'
                    title='${it.title}'
                >
                    <div class='icon'>${it.icon || EMPTY_STRING}</div>
                </span>`;
            })}
          </div>
        </div>
        <div ref='$gradientEditor'>
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

  getColorString() {
    var value = '' ;
    if (this.state.image instanceof Gradient) {
      value = this.state.image.getColorString()
    }

    return value; 
  }

  getCurrentColor() {
    return this.state.image.colorsteps[this.state.selectColorStepIndex || 0].color; 
  }

  [LOAD('$gradientEditor')] () {
    return `<GradientEditor 
              ref="$g" 
              value="${this.getColorString()}" 
              selectedIndex="${this.state.selectColorStepIndex}" 
              onchange='changeGradientEditor'
    />`
  }

  [EVENT('changeGradientEditor')] (data) {

    var colorsteps = data.colorsteps.map((it, index) => {
      return new ColorStep({
        color: it.color,
        percent: it.offset.value,
        cut: it.cut,
        index: (index + 1)  * 100 
      })
    })

    data = {
      ...data,
      type: this.selectedTab,
      colorsteps
    }

    this.state.image.reset({
      colorsteps
    });

    this.emit(this.state.changeEvent, data);
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
      this.emit(this.changeEvent, { type: "image", images });
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

    // 설정된 이미지를 재생성한다. type 에 맞게 
    // 데이타 전송은 다 문자열로 하는게 나을까? 객체로 하는게 나을 까 ? 
    // json 형태로만 주고 받는게 좋을 듯 하다. 
    // 자체 객체가 있으니 다루기가 너무 힘들어지고 있다. 
    // 파싱 용도로만 쓰자. 
    this.state.image = BackgroundImage.createGradient({ type }, this.state.image);

    // this.load()
    if (this.children.$g) {


      this.children.$g.setValue(
        this.getColorString(), 
        this.state.selectColorStepIndex, 
        this.selectedTab
      );
    }

    switch (type) {
      case "image": // image
        if (data.url) {
          this.refs.$imagePreview.attr("src", data.url);
        }
        this.emit("hideGradientEditor");
        break;
      default:
        var color = this.getCurrentColor();
        this.trigger("selectColorStep", color);

        break;
    }
  }

  changeColor(color) {

    if (this.selectedTab === 'static-gradient') {
      
      this.trigger('changeGradientEditor', {
        colorsteps: [
          { color, offset: Length.percent(0), cut: false }
        ]
      })
      
    } else {
      this.emit('setColorStepColor', color);
    }
  }

  [EVENT("showFillPicker")](data) {
    data.changeEvent = data.changeEvent || 'changeFillPicker'
    this.setState(data);

    this.$el
      .css({
        top: Length.px(290),
        left: Length.px(320),
        bottom: Length.auto
      })
      .show();

    this.selectTabContent(this.state.image.type, this.state);
    // this.emit("hidePicker");
  }

  [EVENT("hideFillPicker", "hidePicker", 'hidePropertyPopup', CHANGE_SELECTION)]() {
    this.$el.hide();
  }

  [EVENT("selectColorStep")](color) {
    this.colorPicker.initColorWithoutChangeEvent(color);
  }

  [EVENT("changeColorStep")](data = {}) {
    this.emit(this.state.changeEvent, {
      type: this.selectedTab,
      ...data
    });
  }

}
