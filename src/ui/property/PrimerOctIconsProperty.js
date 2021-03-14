import BaseProperty from "./BaseProperty";
import { registElement } from "@core/registerElement";
import { CLICK, LOAD } from "@core/Event";
import { Length } from "@unit/Length";
import { EVENT } from "@core/UIElement";

export default class PrimerOctIconsProperty extends BaseProperty {

  initState() {
    return {
      isLoaded: false,
      octicons: {}
    }
  }

  getClassName() {
    return 'primer-oct-icons'
  }

  async afterRender() {
    this.show();

    if (this.state.isLoaded === false) {
      const octicons = await import(/* webpackChunkName: "primer-oct-icons" */ '@primer/octicons')

      this.setState({
        isLoaded: true,
        octicons: octicons.default
      });
    }

  }

  getTitle() {
    return 'Oct Icons';
  }

  getBody() {
    return /*html*/`
      <div class="icons-group" ref="$body"></div>
    `;
  }

  renderIcon (icon, key) {
    return /*html*/`
      <div class='icon-item' data-key="${key}"  title="${icon.name || key}">
        <div class="icon-svg">${icon.toSVG({ 'fill': 'currentColor'})}</div>
        <div class='title'>${icon.name || key}</div>
      </div>
    `
  }

  [LOAD('$body')] () {

    if (this.state.isLoaded === false) {
      return;
    }

    const icons = this.state.octicons;
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
      template: this.state.octicons[key].toSVG()
    });

  }


  [EVENT('search')] (value) {
    this.setState({
      search: value
    })
  }
}

registElement({ PrimerOctIconsProperty })