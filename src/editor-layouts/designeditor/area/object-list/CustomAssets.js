
import { CLICK, DRAGSTART, LOAD, SUBSCRIBE } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './CustomAssets.scss';

export default class CustomAssets extends EditorElement {
  template() {

    return /*html*/`
      <div class='elf--custom-assets'>
        <div class='custom-assets-tools'>
          <div class='title'><label>Custom Assets</label></div>
          <div class='tools'>
            <button type="button" ref='$addCustomAsset'>${iconUse('add')}</button>
          </div>
        </div>
        <div class='elf--asset-list' ref='$list'></div>
      </div>
    `;
  }

  async [LOAD('$list')] () {
    const data = await this.$storageManager.getCustomAssetList()
    return data.map(it => {
      return /*html*/`
        <div class='asset-preview' draggable="true" data-preview-id="${it.id}">
          <div class='thumbnail'><img src='${it.preview}' /></div>
          <div class='tools'>
            <div class='title'>${it.component.name}</div>
            <div class='buttons'>
              <button type="button" class='remove-asset-preview' title="remove asset" data-preview-id="${it.id}">${iconUse('remove')}</button>
            </div>
          </div>
        </div>
      `
    })
  }

  async [CLICK('$list .remove-asset-preview')] (e) {

    if (confirm(this.$i18n('app.confirm.message.artboard.items.removeCustomAsset'))) {

      const id = e.$dt.data('preview-id');

      await this.$storageManager.removeCustomAsset(id);
      this.refresh();
    }

  }

  [DRAGSTART('$list .asset-preview')] (e) {
    const id = e.$dt.data('preview-id');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/asset", id);
  }

  [CLICK('$addCustomAsset')] (e) {
    this.emit('savePNG', async (datauri) => {
      await this.$storageManager.saveCustomAsset(datauri);
      this.refresh();
    })
  }
}