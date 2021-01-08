import UIElement from "@core/UIElement";
import ColorPickerUI from "@colorpicker/";

export default class EmbedColorPicker extends UIElement {


  show () {

    if (this.colorPicker) {
      return;
    }

    var defaultColor = "rgba(0, 0, 0, 1)";

    this.colorPicker = ColorPickerUI.create({
      $editor: this.$editor,
      type: 'sketch',
      position: "inline",
      container: this.refs.$color.el,
      color: this.props.value || defaultColor,
      onChange: c => {
        this.changeColor(c);
      },
      onLastUpdate: c => {
        this.changeEndColor(c);
      }

    });
  }

  initState() {
    return {
      color: 'rgba(0, 0, 0, 1)'
    }
  }

  template() {
    return /*html*/`
      <div ref="$color"></div>
    `;
  }

  changeColor(color) {
    this.parent.trigger(this.props.onchange, color);
  }

  changeEndColor(color) {
    this.parent.trigger(this.props.onchangeend, color);
  }  

  setValue (color) {
    this.show();
    this.colorPicker.initColorWithoutChangeEvent(color);
  }

  refresh() {
    this.colorPicker.initColorWithoutChangeEvent(this.state.color);
  }

}
