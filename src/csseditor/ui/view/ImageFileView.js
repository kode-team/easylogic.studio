import UIElement, { EVENT } from "../../../util/UIElement";
import { CHANGE } from "../../../util/Event";

export default class ImageFileView extends UIElement {

    template() {
        return /*html*/`
        <div class='add-image-button'>
            <input type='file' accept='image/*' multiple="true" ref='$file' class='embed-file-input'/>
        </div>
        `
    }

    [CHANGE('$file')] (e) {
        this.refs.$file.files.forEach(item => {
          this.emit('updateImage', item, this.state.rect);
        })
    }

    [EVENT('openImage')] (rect) {
        this.state.rect = rect; 
        this.refs.$file.click();
    }

}
