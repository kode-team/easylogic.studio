
import { CLICK, DRAGSTART, LOAD, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";


export default class CustomComponentItems extends EditorElement {
  template() {

    return /*html*/`
      <div class='custom-component-items'>
        <div class='custom-component-items-tools'>
          <div class='title'><label>Component Assets</label></div>
          <div class='tools'>
            <button type="button" ref='$addCustomComponent' data-tooltip="Add Custom Component" data-direction="bottom right">${icon.add}</button>
          </div>
        </div>
        <div class='custom-component-list' ref='$list'></div>
      </div>
    `;
  }

  async [LOAD('$list')] () {
    const data = await this.$storageManager.getCustomComponentList()
    return data.map(it => {
      return /*html*/`
        <div class='custom-component-preview' draggable="true" data-preview-id="${it.id}">
          <div class='thumbnail'><img src='${it.preview}' /></div>
          <div class='tools'>
            <div class='title'>${it.component.name || it.component.itemType}</div>
            <div class='buttons'>
              <button type="button" class='remove-custom-component-preview' data-preview-id="${it.id}">${icon.remove}</button>
            </div>
          </div>
        </div>
      `
    })
  }

  async [CLICK('$list .remove-custom-component-preview')] (e) {

    if (confirm(this.$i18n('app.confirm.message.custom-component.items.removeCustomComponent'))) {

      const id = e.$dt.data('preview-id');

      await this.$storageManager.removeCustomComponent(id);
      this.refresh();
    }

  }

  [DRAGSTART('$list .custom-component-preview')] (e) {
    const id = e.$dt.data('preview-id');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/custom-component", id);
  }

  async [SUBSCRIBE('afterSaveCustomComponent')] (datauri) {
    await this.$storageManager.saveCustomComponent(datauri);
    this.refresh();
  }

  [CLICK('$addCustomComponent')] (e) {
    this.emit('savePNG', 'afterSaveCustomComponent')
  }
}