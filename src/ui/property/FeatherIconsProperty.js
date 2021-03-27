import BaseProperty from "./BaseProperty";
import { registElement } from "@sapa/registerElement";
import { CLICK, DOMDIFF, LOAD } from "@sapa/Event";
import { Length } from "@unit/Length";
import { EVENT } from "@sapa/UIElement";
import Color from "@sapa/Color";

export default class FeatherIconsProperty extends BaseProperty {

  initState() {
    return {
      isLoaded: false,
      feather: {}
    }
  }

  getClassName() {
    return 'feather-icons'
  }

  async afterRender() {
    this.show();

    if (this.state.isLoaded === false) {
      const feather = await import(/* webpackChunkName: "feather-icons" */ 'feather-icons')

      this.setState({
        isLoaded: true,
        feather
      });
    }

  }

  getTitle() {
    return 'Feather Icons';
  }

  getBody() {
    return /*html*/`
      <div class="icons-group" ref="$body"></div>
    `;
  }

  renderIcon (icon, key) {
    
    return /*html*/`
      <div class='icon-item' data-key="${key}"  title="${icon.name || key}">
        <div class="icon-svg">${icon.toSvg()}</div>
        <div class='title'>${icon.name || key}</div>
      </div>    
    `
  }

  [LOAD('$body') + DOMDIFF] () {

    if (this.state.isLoaded === false) {
      return;
    }

    const { icons } = this.state.feather;
    const keys = Object.keys(icons);

    if (this.state.search) {
      return keys
              .filter(key => {
                return icons[key].name.includes(this.state.search) ||  key.includes(this.state.search)
              })
              .map(key => this.renderIcon(icons[key], key))
    } else {
      return keys
              .map(key => this.renderIcon(icons[key], key))
    }


  }

  [CLICK('$body .icon-item')] (e) {
    var key = e.$dt.data('key');

    const center = this.$viewport.center;

    this.emit('newComponent', 'template', {
      x: Length.px(center[0] - 100),
      y: Length.px(center[1] - 100),
      width: Length.px(200),
      height: Length.px(200),
      'background-color': 'transparent',
      template: this.state.feather.icons[key].toSvg()
    });

  }

  [EVENT('search')] (value) {
    this.setState({
      search: value
    })
  }
}

registElement({ FeatherIconsProperty })