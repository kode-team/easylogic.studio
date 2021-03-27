import BaseProperty from "./BaseProperty";
import { DEBOUNCE, CLICK } from "@sapa/Event";
import { EVENT } from "@sapa/UIElement";
import icon from "@icon/icon";
import { registElement } from "@sapa/registerElement";

export default class ExportProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('export.property.title');
  }

  [EVENT('refreshSelection', 'refreshContent') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('project');

  }  

  getClassName() {
    return 'export-property'
  }


  getBody() {
    return /*html*/`
        <div class='export-item svg'>
          <label>SVG</label>
          <button ref='$svg'>${icon.archive} ${this.$i18n('export.property.download')}</button>
        </div>
        <div class='export-item png'>
          <label>PNG</label>
          <button ref='$png'>${icon.archive} ${this.$i18n('export.property.download')}</button>
        </div> 
      `;
  }  

  [CLICK('$svg')] () {
    this.emit('downloadSVG');
  }

  [CLICK('$png')] () {
    this.emit('downloadPNG');
  }  
}

registElement({ ExportProperty })