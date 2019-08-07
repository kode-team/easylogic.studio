import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";
import { CHANGE } from "../../../util/Event";
 
export default class AddImage extends MenuItem {

  template () {
    return `
    <div class='add-image-button' style='pointer-events:none'>
        <input type='file' accept='image/*' multiple="true" ref='$file' class='embed-file-input'/>
        <button  style='pointer-events:none' 
            type="button" class='menu-item' data-no-title="${this.isHideTitle()}" ${this.isHideTitle() ? `title="${this.getTitle()}"` : '' } checked="${this.getChecked() ? 'checked' : ''}">
          <div class="icon ${this.getIcon()}">${this.getIconString()}</div>
          <div class="title">${this.getTitle()}</div>
        </button>
    </div>
    `
  }

  getIconString() {
    return icon.outline_image;
  }
  getTitle() {
    return "4. Image";
  }

  isHideTitle() {
    return true; 
  }

  [CHANGE('$file')] (e) {
    this.refs.$file.files.forEach(item => {
      this.emit('update.image', item);
    })
  }

  [EVENT('addImage')] () {
    this.refs.$file.click();
  }
}
