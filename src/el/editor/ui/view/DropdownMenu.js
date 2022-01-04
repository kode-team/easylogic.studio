import { CLICK, IF, POINTERSTART, SUBSCRIBE, LOAD, BIND, DOMDIFF, SUBSCRIBE_SELF } from 'el/sapa/Event';
import { EditorElement } from '../common/EditorElement';

import './DropdownMenu.scss';
import { isFunction, isNotUndefined } from 'el/sapa/functions/func';
import { initializeGroupVariables, variable } from 'el/sapa/functions/registElement';
import { iconUse } from 'el/editor/icon/icon';
import Dom from 'el/sapa/functions/Dom';
import { Length } from 'el/editor/unit/Length';


export class DropdownMenu extends EditorElement {


  initialize() {
    super.initialize();

    const events = this.props.events || [];
    if (events.length) {
      events.forEach(event => {
        this.on(event, () => this.refresh())
      });
    }

  }

  initState() {

    return {
      direction: this.props.direction || "left",
      opened: this.props.opened || false,
      items: this.props.items || [],
      selectedKey: this.props.selectedKey,
      dy: this.props.dy || 0
    }
  }

  makeMenuItem(it) {
    if (it === '-' || it.type === 'divider') {
      return `<li class="dropdown-divider"></li>`
    }

    if (it.type === 'link') {
      return /*html*/`
          <li><a href="${it.href}" target="${it.target || "_blank"}">${this.$i18n(it.title)}</a></li>
        `
    }

    if (Array.isArray(it.items)) {
      return /*html*/`
          <li>
              <span>${iconUse("arrowRight")}</span>
              <label>${this.$i18n(it.title)}</label> 
              <ul>
                  ${it.items.map(child => this.makeMenuItem(child)).join('')}
              </ul>
          </li>
        `
    }

    const checked = isFunction(it.checked) ? it.checked(this.$editor) : '';

    return /*html*/`
        <li data-command="${it.command}" data-has-children="${Boolean(it.items?.length)}"
          ${it.disabled && 'disabled'} 
          ${it.shortcut && 'shortcut'}
          ${checked && 'checked'}
          ${it.nextTick && `data-next-tick=${variable(it.nextTick, this.groupId)}`} 
          ${it.args && `data-args=${variable(it.args, this.groupId)}`} 
          ${it.key && `data-key=${it.key}`} 
        >
            <span class="icon">${checked ? iconUse('check') : (it.icon || '')}</span>
            <div class='menu-item-text'>
              <label>${this.$i18n(it.title)}</label>
              <kbd class="shortcut">${it.shortcut || ''}</kbd>
            </div>
        </li>
      `
  }

  template() {
    const { direction, opened, items } = this.state;

    const openedClass = opened ? 'opened' : '';
    return /*html*/`
        <div class="dropdown-menu ${openedClass}" data-direction="${direction}">
          <span class='icon' ref="$icon"></span>
          <span class='dropdown-arrow' ref="$arrow">${iconUse('keyboard_arrow_down')}</span>
          <ul class="dropdown-menu-item-list" ref="$list"></ul>
          <div class="dropdown-menu-arrow">
              <svg viewBox="0 0 12 6" width="12" height="6">
                <path d="M0,6 L6,0 L12,6 "></path>
              </svg>
          </div>
      </div>
      `
  }

  [LOAD('$icon')]() {
    return isFunction(this.props.icon) ? this.props.icon(this.state) : this.props.icon;
  }

  [BIND('$el')]() {
    const selected = isFunction(this.props.selected) ? this.props.selected(this.state, this.$editor) : false        
    return {
      'data-selected': selected,      
      style: {
        ...(this.props.style || {}),
        '--elf--dropdown-menu-width': this.props.width,
        '--elf--dropdown-menu-dy': isNotUndefined(this.props.dy) ? Length.px(this.props.dy) : 0
      }
    }
  }

  close() {
    this.setState({
      opened: false
    }, false)
    this.$el.removeClass('opened');
  }

  toggle() {
    this.setState({
      opened: !this.state.opened
    }, false)
    this.$el.toggleClass('opened', this.state.opened);

    if (this.state.opened) {
      this.emit('hideDropdownMenu');
    }
  }

  get groupId() {
    return this.id + '$list';
  }

  [LOAD('$list') + DOMDIFF]() {
    initializeGroupVariables(this.groupId);
    return this.state.items.map(it => this.makeMenuItem(it));
  }

  checkDropdownOpen(e) {
    const ul = Dom.create(e.target).closest('dropdown-menu-item-list');

    if (!ul) return true;

    return false;
  }

  [CLICK('$arrow') + IF('checkDropdownOpen')](e) {
    this.toggle();
  }

  [CLICK('$icon')](e) {

    if (this.state.selectedKey) {
      const menuItem = this.state.items.find(it => it.key === this.state.selectedKey);

      const command = menuItem.command;
      const args = menuItem.args;
      const nextTick = menuItem.nextTick;
      const key = menuItem.key;

      // command 를 실행하고 
      if (command) {
        this.emit(command, ...args);
      }

      // nextTick 은 액션처럼 실행하고 
      if (nextTick && isFunction(nextTick)) {
        this.nextTick(nextTick)
      }

      this.setState({
        selectedKey: key
      })

      // 닫고
      this.close();      

    }
  }

  [CLICK('$el [data-command]')](e) {
    const command = e.$dt.data('command');
    const args = e.$dt.data('args') || [];
    const nextTick = e.$dt.data('next-tick');
    const key = e.$dt.data('key');

    // command 를 실행하고 
    if (command) {
      this.emit(command, ...args);
    }

    // nextTick 은 액션처럼 실행하고 
    if (nextTick && isFunction(nextTick)) {
      this.nextTick(nextTick)
    }

    this.setState({
      selectedKey: key
    })

    // 닫고
    this.close();
  }

  [SUBSCRIBE_SELF("updateMenuItems")](items) {
    this.setState({ items });
  }

  [SUBSCRIBE('hideDropdownMenu')]() {
    this.close();
  }

  [POINTERSTART('document')](e) {
    const $target = Dom.create(e.target);

    const $dropdown = $target.closest('dropdown-menu');

    if (!$dropdown) {
      this.close();
    } else if ($dropdown.el !== this.$el.el) {
      this.close();
    }

  }
}