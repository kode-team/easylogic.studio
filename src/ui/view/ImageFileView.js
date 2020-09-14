import UIElement, { EVENT } from "@core/UIElement";
import { CHANGE } from "@core/Event";

export default class ImageFileView extends UIElement {

    template() {
        return /*html*/`
        <div class='add-image-button'>
            <input type='file' accept='image/*' multiple="true" ref='$file' class='embed-file-input'/>
            <input type='file' accept='video/*' multiple="true" ref='$video' class='embed-video-input'/>
        </div>
        `
    }

    [CHANGE('$file')] (e) {
        this.refs.$file.files.forEach(item => {
          this.emit('updateImage', item, this.state.rect);
        })
    }
    [CHANGE('$video')] (e) {
        this.refs.$video.files.forEach(item => {
          this.emit('updateVideo', item, this.state.rect);
        })
    }    

    [EVENT('openImage')] (rect) {
        this.state.rect = rect; 
        this.refs.$file.click();
    }

    [EVENT('openVideo')] (rect) {
        this.state.rect = rect; 
        this.refs.$video.click();
    }    

}
