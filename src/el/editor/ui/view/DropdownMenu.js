import { CLICK } from 'el/sapa/Event';
import { EditorElement } from '../common/EditorElement';

import './DropdownMenu.scss';
import { isFunction } from 'el/sapa/functions/func';
import { initializeGroupVariables, variable } from 'el/sapa/functions/registElement';
import icon, { iconUse } from 'el/editor/icon/icon';
import { LOAD } from 'el/sapa/Event';
import { DOMDIFF } from 'el/sapa/Event';
import { SUBSCRIBE_SELF } from 'el/sapa/Event';

export class DropdownMenu extends EditorElement {

    initState() {
      return {
        direction: this.props.direction || "left",
        opened: this.props.opened || false,
        items: [
          { title: 'menu.item.fullscreen.title', command: 'toggle.fullscreen', shortcut: "ALT+/" },
          { title: 'menu.item.shortcuts.title', command: 'showShortcutWindow' },
          '-',
          { title: 'menu.item.export.title', command: 'showExportView' },
          { title: 'menu.item.export.title', command: 'showEmbedEditorWindow' },
          { title: 'menu.item.download.title', command: 'downloadJSON' },
          { title: 'menu.item.save.title', command: 'saveJSON', nextTick: () => {
            this.emit('notify',  'alert', 'Save', 'Save the content on localStorage', 2000);    
          } },
          '-',
          { title: 'EasyLogic Studio', items: [
            { type: 'link', title: 'Github', href: 'https://github.com/easylogic/editor' },
            { type: 'link', title: 'Learn', href: 'https://www.easylogic.studio' }
          ]}
        ]
      }
    }

    makeMenuItem(it) {
      if (it === '-' || it.type === 'divider') {
        return `<li class="divider"></li>`
      }

      if (it.type === 'link') {
        return /*html*/`
          <li><a href="${it.href}" target="${it.target || "_blank"}">${this.$i18n(it.title)}</a></li>
        `
      }

      if (Array.isArray(it.items)) {
        return /*html*/`
          <li>
              <span class="icon">${it.icon ? it.icon : ''}</span>
              <label>${this.$i18n(it.title)}</label> 
              <span>${iconUse("arrowRight")}</span>
              <ul>
                  ${it.items.map(child => this.makeMenuItem(child)).join('')}
              </ul>
          </li>
        `
      }

      return /*html*/`
        <li data-command="${it.command}" 
          ${it.disabled && 'disabled'} 
          ${it.shortcut && 'shortcut'}
          ${it.nextTick && `data-next-tick=${variable(it.nextTick, this.groupId)}`} 
          ${it.args && `data-args=${variable(it.args, this.groupId)}`} 
        >
            <span class="icon">${it.icon || ''}</span>
            <label>${this.$i18n(it.title)}</label>
            <kbd class="shortcut">${it.shortcut || ''}</kbd>
        </li>
      `
    }

    template() {
      const { content } = this.props;
      const { direction, opened, items } = this.state;

      const openedClass = opened ? 'opened' : '';

      return /*html*/`
        <div class="dropdown-menu ${openedClass}" data-direction="${direction}">
          ${content}
          <ul ref="$list"></ul>
          <div class="dropdown-menu-arrow">
              <svg>
                <path d="M0,6 L3.5,0 L7,6 "></path>
              </svg>
          </div>
      </div>
      `
    }

    get groupId() {
      return this.id + '$list';
    }

    [LOAD('$list') + DOMDIFF] () {
      initializeGroupVariables(this.groupId);      
      return this.state.items.map(it => this.makeMenuItem(it));
    }

    [CLICK('$el li[data-command]')] (e) {
      const command = e.$dt.data('command');
      const args = e.$dt.data('args') || [];
      const nextTick = e.$dt.data('next-tick');

      // command 를 실행하고 
      if (command) {
        this.emit(command, ...args);
      }

      // nextTick 은 액션처럼 실행하고 
      if (nextTick && isFunction(nextTick)) {
        this.nextTick(nextTick)
      }
    }

    [SUBSCRIBE_SELF("updateMenuItems")] (items) {
      this.setState({ items });
    }
}