import { CLICK, LOAD, SUBSCRIBE} from "el/sapa/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './CirclePatternPopup.scss';
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { STRING_TO_CSS } from "el/utils/func";

const patterns = [
  { type: "circle", name: "base", attrs: {
    "background-color": "#ececec"
  }},
  { type: "circle", name: "base", attrs: {
    "background-color": "black"
  }},
  { type: "circle", name: "base", attrs: {
    "background-color": "red"
  }},
  { type: "circle", name: "base", attrs: {
    "background-image": `
      background-image: linear-gradient(to right, #ececec, black 100%);
    `
  }},  
  { type: "circle", name: "base", attrs: {
    "background-image": `
      background-image: linear-gradient(to right, #ececec, black 100%);
    `,
    "border": `
      border:10px solid black;
    `
  }},  
]


export default class CirclePatternPopup extends BasePopup {

  getTitle() {
    return 'Circle Pattern'
  }

  initState() {
    return {
      changeEvent: '', 
      instance: {}, 
      data: {
        timingFunction: 'linear',
        duration: '0s',
        delay: '0s',
        name: 'all'
      } 
    };
  }

  // afterRender() {
  //   setTimeout(() => {
  //     this.emit("getLayoutElement", ({$leftPanel}) => {
  //       this.showByRect($leftPanel.rect());
  //     })

  //   }, 100);

  // }

  getBody() {
    return /*html*/`<div class='elf--circle-pattern-popup' ref='$popup'></div>`;
  }

  [LOAD('$popup')] () {
    return patterns.map((it, index) => {
      const svg = this.$editor.svg.render(this.$model.createModel({
        itemType: "circle",
        width: 100,
        height: 100,
        ...it.attrs
      }, false))
      return `
        <div class="pattern-item" data-index="${index}">
          <div class="preview">${svg}</div>
        </div>
      `;
    });
  }

  [SUBSCRIBE("showrCirclePatternPopup")]() {
    this.show(250)
  }

  [SUBSCRIBE("hiderCirclePatternPopup")]() {
    this.$el.hide();
  }

  [CLICK('$popup .pattern-item')] (e) {
    const index = +e.$dt.data('index');
    const pattern = patterns[index];

    e.$dt.onlyOneClass("selected");

    this.emit("addLayerView", "circle", pattern.attrs);
  }
}