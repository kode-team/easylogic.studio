import { EVENT } from "../../../util/UIElement";
import { CLICK, LOAD, DEBOUNCE } from "../../../util/Event";

import { Length } from "../../../editor/unit/Length";
import GradientEditor from "../property-editor/GradientEditor";
import { Gradient } from "../../../editor/image-resource/Gradient";
import { ColorStep } from "../../../editor/image-resource/ColorStep";
import { BackgroundImage } from "../../../editor/css-property/BackgroundImage";
import BasePopup from "./BasePopup";
import EmbedColorPicker from "../property-editor/EmbedColorPicker";


const tabs = [
  { type: "static-gradient", title: "Static Gradient" },
  { type: "linear-gradient", title: "Linear Gradient" },
  { type: "repeating-linear-gradient", title: "Repeating Linear Gradient" },
  { type: "radial-gradient", title: "Radial Gradient" },
  { type: "repeating-radial-gradient", title: "Repeating Radial Gradient" },
  { type: "conic-gradient", title: "Conic Gradient" },
  { type: "repeating-conic-gradient", title: "Repeating Conic Gradient" }
];


export default class GradientPickerPopup extends BasePopup {

  getTitle() {
    return 'Gradient Picker'
  }

  components() {
    return {
      EmbedColorPicker,
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
      hideBackgroundProperty: true,
      image: {},
    }
  }

  initialize() {
    super.initialize();

    this.selectedTab = "static-gradient";
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit("changeBackgroundProperty", opt);
  }

  getBody() {
    return `
      <div class="gradient-picker">

        <div class='box'>
          <div class='gradient-preview'>
            <div class='gradient-view' ref='$gradientView'></div>
          </div>
          <div class="picker-tab">
            <div class="picker-tab-list" ref="$tab" data-value="static-gradient" data-is-image-hidden="false">
              ${tabs.map(it => {
                return `
                  <span 
                      class='picker-tab-item ${it.selected ? "selected" : ''}' 
                      data-selected-value='${it.type}'
                      title='${it.title}'
                  >
                      <div class='icon'>${it.icon || ''}</div>
                  </span>`;
              }).join('')}
            </div>
          </div>
          <div ref='$gradientEditor'>
          </div>

        </div>
        <div class='box'>
          <EmbedColorPicker ref='$color' onchange='changeColor' />          
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

    this.state.image.reset(data);

    this.updateGradientPreview();
    this.updateData();
  }


  [CLICK("$tab .picker-tab-item")](e) {
    const type = e.$delegateTarget.attr("data-selected-value");

    //TODO: picker 타입이 바뀌면 내부 속성도 같이 바뀌어야 한다.
    this.selectTabContent(type, {
      type,
      selectTab: true
    });
  }

  selectTabContent(type) {
    this.selectedTab = type;    
    this.refs.$tab.attr("data-value", type);



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

   
    var color = this.getCurrentColor();
    this.trigger("selectColorStep", color);


    this.updateGradientPreview();    

  }

  [EVENT('changeColor')] (color) {

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

  [EVENT("showGradientPickerPopup")](data, params) {
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    data.image = BackgroundImage.parseImage(data.gradient)
    data.params = params;
    this.setState(data);

    this.show(432);

    this.selectTabContent(this.state.image.type, this.state);
  }

  [EVENT("hideGradientPickerPopup")]() {
    this.hide();
  }

  [EVENT("selectColorStep")](color) {
    this.children.$color.setValue(color);
  }

  [EVENT("changeColorStep")](data = {}) {

    this.state.image.reset({
      ...data
    })

    this.updateGradientPreview();
    this.updateData();
  }

  updateGradientPreview () {
    this.refs.$gradientView.css('background-image', this.state.image.toString())
  }

  updateData() {
    this.emit(this.state.changeEvent, this.state.image.toString(), this.state.params);
  }

}
