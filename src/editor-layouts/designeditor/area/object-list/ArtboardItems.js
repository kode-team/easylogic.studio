
import { CLICK, DRAGSTART, LOAD, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ArtboardItems.scss';

export default class ArtboardItems extends EditorElement {
  template() {

    return /*html*/`
      <div class='elf--artboard-items'>
        <div class='artboard-items-tools'>
          <div class='title'><label>Artboard Assets</label></div>
          <div class='tools'>
            <button type="button" ref='$addArtboard'>${icon.add}</button>
          </div>
        </div>
        <div class='elf--artboard-list' ref='$list'></div>
      </div>
    `;
  }

  async [LOAD('$list')] () {
    const data = await this.$storageManager.getArtboardList()
    return data.map(it => {
      return /*html*/`
        <div class='artboard-preview' draggable="true" data-preview-id="${it.id}">
          <div class='thumbnail'><img src='${it.preview}' /></div>
          <div class='tools'>
            <div class='title'>${it.artboard.name}</div>
            <div class='buttons'>
              <button type="button" class='remove-artboard-preview' data-preview-id="${it.id}">${icon.remove}</button>
            </div>
          </div>
        </div>
      `
    })
  }

  async [CLICK('$list .remove-artboard-preview')] (e) {

    if (confirm(this.$i18n('app.confirm.message.artboard.items.removeArtboard'))) {

      const id = e.$dt.data('preview-id');

      await this.$storageManager.removeArtboard(id);
      this.refresh();
    }

  }

  [DRAGSTART('$list .artboard-preview')] (e) {
    const id = e.$dt.data('preview-id');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/artboard", id);
  }

  async [SUBSCRIBE('afterSaveArtboard')] (datauri) {
    await this.$storageManager.saveArtboard(datauri);
    this.refresh();
  }

  [CLICK('$addArtboard')] (e) {
    this.emit('savePNG', 'afterSaveArtboard')
  }
}