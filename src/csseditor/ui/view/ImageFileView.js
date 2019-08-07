import UIElement, { EVENT } from "../../../util/UIElement";
import { CHANGE } from "../../../util/Event";

export default class ImageFileView extends UIElement {

    template() {
        return `
        <div class='add-image-button' style='pointer-events:none'>
            <input type='file' accept='image/*' multiple="true" ref='$file' class='embed-file-input'/>
        </div>
        `
    }

    [CHANGE('$file')] (e) {
        this.refs.$file.files.forEach(item => {
          this.emit('update.image', item, this.state.rect);
        })
    }

    [EVENT('addImage')] (rect) {
        this.state.rect = rect; 
        this.refs.$file.click();
    }

}
