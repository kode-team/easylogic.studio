import BaseProperty from "./BaseProperty";
import { registElement } from "el/base/registElement";
import { CLICK, DOMDIFF, LOAD, SUBSCRIBE } from "el/base/Event";
import { Length } from "el/editor/unit/Length";

import feather from 'feather-icons';

export default class FeatherIconsProperty extends BaseProperty {

  getClassName() {
    return 'feather-icons'
  }

  async afterRender() {
    this.show();
  }

  getTitle() {
    return 'Feather Icons';
  }

  getBody() {
    return /*html*/`
      <div class="icons-group" ref="$body"></div>
    `;
  }

  renderIcon(icon, key) {

    return /*html*/`
      <div class='icon-item' data-key="${key}"  title="${icon.name || key}">
        <div class="icon-svg">${icon.toSvg()}</div>
        <div class='title'>${icon.name || key}</div>
      </div>    
    `
  }

  [LOAD('$body') + DOMDIFF]() {

    const { icons } = feather;
    const keys = Object.keys(icons);

    if (this.state.search) {
      return keys
        .filter(key => {
          return icons[key].name.includes(this.state.search) || key.includes(this.state.search)
        })
        .map(key => this.renderIcon(icons[key], key))
    } else {
      return keys
        .map(key => this.renderIcon(icons[key], key))
    }


  }

  [CLICK('$body .icon-item')](e) {
    var key = e.$dt.data('key');

    const center = this.$viewport.center;
    this.emit('newComponent', 'template', {
      x: Length.px(center[0] - 100),
      y: Length.px(center[1] - 100),
      width: Length.px(200),
      height: Length.px(200),
      'background-color': 'transparent',
      template: feather.icons[key].toSvg()
    });

  }

  [SUBSCRIBE('search')](value) {
    this.setState({
      search: value
    })
  }
}

registElement({ FeatherIconsProperty })