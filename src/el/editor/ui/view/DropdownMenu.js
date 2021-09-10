import { CLICK } from 'el/sapa/Event';
import { EditorElement } from '../common/EditorElement';

import './DropdownMenu.scss';
import { isFunction } from 'el/sapa/functions/func';
import { variable } from 'el/sapa/functions/registElement';
import icon from 'el/editor/icon/icon';

export class DropdownMenu extends EditorElement {
    template() {
      const { content } = this.props;

      return /*html*/`
        <div class="dropdown-menu">
          ${content}
          <ul>
              <li data-command="toggle.fullscreen">${this.$i18n('menu.item.fullscreen.title')}</li>
              <li data-command="showShortcutWindow">${this.$i18n('menu.item.shortcuts.title')}</li>
              <li class="divider"></li>
              <li data-command="showExportView">${this.$i18n('menu.item.export.title')}</li>
              <li data-command="downloadJSON">${this.$i18n('menu.item.download.title')}</li>
              <li data-command="saveJSON" data-next-tick=${variable(() => {
                this.emit('notify',  'alert', 'Save', 'Save the content on localStorage', 2000);    
              }, this)}>${this.$i18n('menu.item.save.title')}</li>
              <li class="divider"></li>              
              <li>
                  <div>EasyLogic Studio <span>${icon.arrowRight}</span></div>
                  <ul>
                      <li><a href="https://github.com/easylogic/editor" target="_blank">Github</a></li>
                      <li>
                          <a href="https://www.easylogic.studio" target="_blank">${this.$i18n('menu.item.learn.title')}</a>
                      </li>
                  </ul>
              </li>
          </ul>
      </div>
      `
    }

    [CLICK('$el li[data-command]')] (e) {
      const command = e.$dt.data('command');
      const nextTick = e.$dt.data('next-tick');

      this.emit(command);

      if (nextTick && isFunction(nextTick)) {
        this.nextTick(nextTick)
      }
    }
}