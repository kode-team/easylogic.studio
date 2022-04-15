
import { DEBOUNCE, CLICK, SUBSCRIBE } from "el/sapa/Event";

import icon, { iconUse } from "el/editor/icon/icon";
import {BaseProperty} from "el/editor/ui/property/BaseProperty";
import './ExportProperty.scss';

export default class ExportProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('export.property.title');
  }

  isFirstShow() {
    return true;
  }

  getClassName() {
    return 'elf--export-property'
  }


  getBody() {
    return /*html*/`
        <div class='export-item svg'>
          <label>SVG</label>
          <button ref='$svg'>${iconUse("archive")} ${this.$i18n('export.property.download')}</button>
        </div>
        <div class='export-item png'>
          <label>PNG</label>
          <button ref='$png'>${iconUse("archive")} ${this.$i18n('export.property.download')}</button>
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