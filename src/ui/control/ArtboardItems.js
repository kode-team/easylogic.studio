import UIElement, { EVENT } from "@core/UIElement";
import { CLICK, DRAGSTART, LOAD } from "@core/Event";
import icon from "@icon/icon";

export default class ArtboardItems extends UIElement {
  template() {

    return /*html*/`
      <div class='artboard-items'>
        <div class='artboard-items-tools'>
          <div class='title'><label>Artboard Assets</label></div>
          <div class='tools'>
            <button type="button" ref='$addArtboard'>${icon.add}</button>
          </div>
        </div>
        <div class='artboard-list' ref='$list'></div>
      </div>
    `;
  }

  [LOAD('$list')] () {
    return this.$storageManager.getArtboardList().map(it => {
      return /*html*/`
        <div class='artboard-preview' draggable="true" data-preview-artboard-id="${it.id}">
          <div class='thumbnail'><img src='${it.preview}' /></div>
          <div class='title'>${it.artboard.name}</div>
        </div>
      `
    })
  }

  [DRAGSTART('$list .artboard-preview')] (e) {
    const id = e.$dt.attr('data-preview-artboard-id');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/artboard", id);
  }

  [EVENT('afterSaveArtboard')] (datauri) {
    this.$storageManager.saveArtboard(datauri);

    this.load('$list');
  }

  [CLICK('$addArtboard')] (e) {
    this.emit('savePNG', 'afterSaveArtboard')
  }
}
