import { EVENT } from "../../../../util/UIElement";
import BasePopup from "./BasePopup";
import { LOAD, CLICK } from "../../../../util/Event";

const imageList = [
  'https://via.placeholder.com/10',
  'https://via.placeholder.com/20',
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

    this.state.context.trigger(this.state.changeEvent, this.state.value, this.state.params);
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

    this.updateData({
      value: imageList[index]
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
