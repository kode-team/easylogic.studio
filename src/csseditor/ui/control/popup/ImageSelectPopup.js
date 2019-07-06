import { EVENT } from "../../../../util/UIElement";
import BasePopup from "./BasePopup";
import { LOAD, CLICK } from "../../../../util/Event";
import { Length } from "../../../../editor/unit/Length";

const imageList = [
  'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1562252544-dd4613f28dc3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
  'https://via.placeholder.com/30',
  'https://via.placeholder.com/40',
  'https://via.placeholder.com/50',
  'https://via.placeholder.com/100',  
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/200'  
]

export default class ImageSelectPopup extends BasePopup {

  getTitle() {
    return 'Select a image'
  }

  getClassName() {
    return 'compact'
  }

  initState() {

    return {
      value: ''
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    this.state.context.trigger(this.state.changeEvent, this.state.value, {
      width: this.state.width,
      height: this.state.height,
      naturalWidth: this.state.naturalWidth,
      naturalHeight: this.state.naturalHeight      
    });
  }


  getBody() {
    return `
      <div class="image-select-popup">
        <div class='box' ref='$imageBox'>
          
        </div>
      </div>
    `;
  }

  [LOAD('$imageBox')] () {
    return imageList.map( (src, index) => {
      return `<div class='image-item'  data-index="${index}" ><img src= '${src}' /></div>`
    })
  }

  [CLICK('$imageBox .image-item')] (e) {
    var index = +e.$delegateTarget.attr('data-index');

    var $img = e.$delegateTarget.$('img');

    this.updateData({
      value: imageList[index],
      naturalWidth: Length.px($img.naturalWidth),
      naturalHeight: Length.px($img.naturalHeight), 
      width: Length.px($img.naturalWidth),
      height: Length.px($img.naturalHeight)
    });
  }

  [EVENT("showImageSelectPopup")](data, params) {
    this.setState({
      context: data.context,
      changeEvent: data.changeEvent,
      value: data.value,
      params
    }, false);

    this.show(500);
  }

  [EVENT("hideImageSelectPopup")]() {
    this.hide();
  }


}
