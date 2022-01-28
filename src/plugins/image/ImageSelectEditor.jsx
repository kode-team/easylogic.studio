import { LOAD, CLICK, CHANGE, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import "./ImageSelectEditor.scss";

export default class ImageSelectEditor extends EditorElement {
  initState() {
    return {
      key: this.props.key,
      value: this.props.value,
    };
  }

  template() {
    return <div class="elf--image-select-editor" ref="$body"></div>;
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value });
  }

  [LOAD("$body")]() {
    const project = this.$selection.currentProject;

    if (!project) return;

    const imageUrl =
      project.getImageValueById(this.state.value) || this.state.value;

    return (
      <>
        <div class="preview-container">
          {imageUrl ? <img src={imageUrl} /> : null}
          <input type="file" ref="$file" accept="image/*" />
        </div>
        <div class="select-container">
          <button type="button" ref="$select">{this.$i18n('image.select.editor.button')}</button>
        </div>
      </>
    );
  }

  [CHANGE("$file")](e) {
    var files = [...e.target.files];

    if (files.length) {
      this.emit("updateImageAssetItem", files[0], (imageId) => {
        this.trigger("changeImageSelectEditor", imageId);
      });
    }
  }

  [CLICK("$select")]() {
    this.emit("showImageSelectPopup", {
      context: this,
      changeEvent: "changeImageSelectEditor",
      value: this.state.value,
    });
  }

  [SUBSCRIBE("changeImageSelectEditor")](value) {
    this.updateData({ value });
    this.refresh();
  }

  updateData(data) {
    this.setState(data, false);

    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.state.value,
      this.props.params
    );
  }
}
