import { CLICK, BIND, SUBSCRIBE } from "sapa";

import "./GradientSingleEditor.scss";

import { BackgroundImage } from "elf/editor/property-parser/BackgroundImage";
import { GradientType, RadialGradientType } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class GradientSingleEditor extends EditorElement {
  initState() {
    return {
      index: this.props.index,
      image: this.props.image,
      color: "rgba(0, 0, 0, 1)",
    };
  }

  updateData(opt = {}) {
    this.setState(opt, false);
    this.modifyValue(opt);
  }

  modifyValue(value) {
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      value,
      this.state.index
    );
  }

  setValue(obj) {
    this.setState({
      ...obj,
    });
  }

  [BIND("$miniView")]() {
    const project = this.$context.selection.currentProject;
    let image;

    if (this.state.image.type === GradientType.URL) {
      const imageUrl = project.getImageValueById(this.state.image.url);

      image = this.state.image.toString(imageUrl);
    } else {
      image = this.state.image.toCSSString();
    }

    return {
      style: {
        "background-image": image,
      },
    };
  }

  template() {
    return /*html*/ `
            <div class='elf--gradient-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `;
  }

  [CLICK("$preview")]() {
    this.viewGradientPopup();
  }

  viewGradientPopup() {
    this.emit(
      "showGradientPickerPopup",
      {
        instance: this,
        changeEvent: "changeGradientSingle",
        index: this.state.index,
        gradient: this.state.image,
      },
      null,
      this.$el.rect()
    );
  }

  [SUBSCRIBE("changeGradientSingle")](image) {
    // 새 background-image 를 생성하고
    image = BackgroundImage.parseImage(image);

    // 기존 background-image 에서 필요한 정보만 다시 가지고 온다.
    const currentImage = this.$context.selection.current.getBackgroundImage(
      this.state.index
    )?.image;

    switch (currentImage.type) {
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        image.reset({
          radialPosition: currentImage.radialPosition || ["50%", "50%"],
          radialType: currentImage.radialType || RadialGradientType.CIRCLE,
        });

        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        image.reset({
          angle: currentImage.angle || 0,
          radialPosition: currentImage.radialPosition || ["50%", "50%"],
        });
        break;
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
      case GradientType.STATIC:
        image.reset({
          angle: currentImage.angle || 0,
        });
        break;
    }

    this.updateData({ image });

    this.refresh();
  }
}
