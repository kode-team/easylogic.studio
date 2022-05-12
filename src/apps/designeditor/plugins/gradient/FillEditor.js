import {
  LOAD,
  CLICK,
  POINTERSTART,
  BIND,
  CHANGE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  KEYUP,
  isUndefined,
  createComponent,
} from "sapa";

import "./FillEditor.scss";

import { Gradient } from "elf/editor/property-parser/image-resource/Gradient";
import { SVGStaticGradient } from "elf/editor/property-parser/image-resource/SVGStaticGradient";
import { SVGFill } from "elf/editor/property-parser/SVGFill";
import { END, MOVE } from "elf/editor/types/event";
import { GradientType } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class FillEditor extends EditorElement {
  initState() {
    const image =
      SVGFill.parseImage(this.props.value || "transparent") ||
      SVGStaticGradient.create();

    const id = image.colorsteps[this.props.index]?.id;
    this.$context.selection.selectColorStep(id);

    if (id) {
      this.currentStep = image.colorsteps.find((it) =>
        this.$context.selection.isSelectedColorStep(it.id)
      );
    }

    return {
      cachedRect: null,
      index: +(this.props.index || 0),
      value: this.props.value,
      image,
    };
  }

  setValue(value) {
    this.setState(
      {
        cachedRect: null,
        image: SVGFill.parseImage(value),
      },
      false
    );

    this.refresh();
  }

  template() {
    return /*html*/ `
        <div class='elf--fill-editor'>
            <div class='gradient-steps' data-editor='gradient'>
                <div class="hue-container" ref="$back"></div>            
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList" ></div>
                </div>
            </div>               
            <div class='sub-editor' ref='$subEditor'> 
                <div data-editor='patternUnits'>
                  ${createComponent("SelectEditor", {
                    label: "Pattern",
                    ref: "$patternUnits",
                    options: ["userSpaceOnUse"],
                    key: "patternUnits",
                    onchange: "changeKeyValue",
                  })}
                </div>                  
                                                                                                                                
            </div>            
        </div>
      `;
  }

  getImageFieldValue(image, field) {
    var value = image[field];

    if (isUndefined(value)) {
      switch (field) {
        case "cx":
        case "cy":
        case "r":
        case "fx":
        case "fy":
          return "50%";
        case "x1":
        case "y1":
        case "y2":
        case "fr":
        case "imageX":
        case "imageY":
          return "0%";
        case "x2":
        case "patternWidth":
        case "patternHeight":
        case "imageWidth":
        case "imageHeight":
          return "100%";
      }
    }

    return value;
  }

  [CHANGE("$file")](e) {
    var project = this.$context.selection.currentProject;
    if (project) {
      [...e.target.files].forEach((item) => {
        this.$commands.emit("updateImageAssetItem", item, (local) => {
          this.trigger("setImageUrl", local);
        });
      });
    }
  }

  refreshFieldValue() {
    this.children.$cx.setValue(this.state.image.cx);
    this.children.$cy.setValue(this.state.image.cy);
    this.children.$r.setValue(this.state.image.r);

    this.children.$fx.setValue(this.state.image.fx);
    this.children.$fy.setValue(this.state.image.fy);
    this.children.$fr.setValue(this.state.image.fr);

    this.children.$patternUnits.setValue(this.state.image.patternUnits);
    this.children.$patternWidth.setValue(this.state.image.patternWidth);
    this.children.$patternHeight.setValue(this.state.image.patternHeight);
    this.children.$imageX.setValue(this.state.image.imageX);
    this.children.$imageY.setValue(this.state.image.imageY);
    this.children.$imageWidth.setValue(this.state.image.imageWidth);
    this.children.$imagenHeight.setValue(this.state.image.imageHeight);
  }

  getFieldValue(field) {
    return Length.parse(this.getImageFieldValue(this.state.image, field));
  }

  getRectRate(rect, x, y) {
    var { width, height, x: rx, y: ry } = rect;

    if (rx > x) {
      x = rx;
    } else if (rx + width < x) {
      x = rx + width;
    }

    if (ry > y) {
      y = ry;
    } else if (ry + height < y) {
      y = ry + height;
    }

    var left = Length.makePercent(x - rx, width);
    var top = Length.makePercent(y - ry, height);

    return { left, top };
  }

  [SUBSCRIBE_SELF("changeTabType")](type) {
    const oldType = this.state.image?.type;
    const colorsteps = this.state.image?.colorsteps || [];

    if (colorsteps.length === 1) {
      colorsteps.push(colorsteps[0]);
    }

    if (oldType === GradientType.STATIC) {
      if (colorsteps.length === 0) {
        colorsteps.push(colorsteps[0], colorsteps[0]);
      } else if (colorsteps.length === 1) {
        colorsteps.push(colorsteps[0]);
      }
    }

    var url = type === "image-resource" ? this.state.image.url : this.state.url;

    this.state.image = SVGFill.changeImageType({
      type,
      url,
      colorsteps,
      spreadMethod: this.state.image.spreadMethod,
    });
    this.refresh();
    this.updateData();
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value) {
    this.state.image.reset({
      [key]: value,
    });

    this.updateData();
  }

  [SUBSCRIBE("changeColorStepOffset")](key, value) {
    if (this.currentStep) {
      this.currentStep.percent = value.value;
      this.state.image.sortColorStep();
      this.refresh();
      this.updateData();
    }
  }

  [CLICK("$back")](e) {
    var rect = this.refs.$stepList.rect();

    var minX = rect.x;
    var maxX = rect.right;

    var x = e.xy.x;

    if (x < minX) x = minX;
    else if (x > maxX) x = maxX;
    var percent = ((x - minX) / rect.width) * 100;

    this.state.image.insertColorStep(percent);
    this.state.image.sortColorStep();

    this.refresh();
    this.updateData();
  }

  [BIND("$el")]() {
    var type = this.state.image.type;
    if (type === "url") {
      type = "image-resource";
    }

    return {
      "data-selected-editor": type,
    };
  }

  [BIND("$stepList")]() {
    return {
      style: {
        "background-image": this.getLinearGradient(),
      },
    };
  }

  [LOAD("$stepList")]() {
    var colorsteps = this.state.image.colorsteps || [];
    return colorsteps.map((it) => {
      var selected = this.$context.selection.isSelectedColorStep(it.id)
        ? "selected"
        : "";
      return /*html*/ `
      <div class='step ${selected}' data-id='${it.id}' data-cut='${
        it.cut
      }' tabindex="-1" style='left: ${it.toLength()};'>
        <div class='color-view' style="background-color: ${it.color}">
          <span>${Math.floor(it.percent * 10) / 10}</span>
        </div>
        <div class='arrow'></div>
      </div>`;
    });
  }

  removeStep(id) {
    this.state.image.removeColorStep(id);

    this.refresh();
    this.updateData();
  }

  selectStep(id) {
    this.state.id = id;

    this.$context.selection.selectColorStep(id);

    if (this.state.image.colorsteps) {
      this.currentStep = this.state.image.colorsteps.find((it) =>
        this.$context.selection.isSelectedColorStep(it.id)
      );
      this.parent.trigger("selectColorStep", this.currentStep.color);
    }

    this.refresh();
  }

  [KEYUP("$el .step")](e) {
    const id = e.$dt.data("id");
    switch (e.code) {
      case "Delete":
      case "Backspace":
        this.removeStep(id);
        break;
      case "BracketRight":
        this.sortToRight(id);
        break;
      case "BracketLeft":
        this.sortToLeft(id);
        break;
      case "Equal":
        this.appendColorStep(id);
        break;
      case "Minus":
        this.prependColorStep(id);
        break;
    }
  }

  sortToRight(id) {
    this.state.image.sortToRight();

    this.refresh();
    this.updateData();

    this.doFocus(id);
  }

  sortToLeft(id) {
    this.state.image.sortToLeft();

    this.refresh();
    this.updateData();

    this.doFocus(id);
  }

  appendColorStep(id) {
    const currentIndex = this.state.image.colorsteps.findIndex(
      (it) => it.id === id
    );
    const nextIndex = currentIndex + 1;

    const currentColorStep = this.state.image.colorsteps[currentIndex];
    const nextColorStep = this.state.image.colorsteps[nextIndex];

    if (!nextColorStep) {
      if (currentColorStep.percent !== 100) {
        this.state.image.insertColorStep(
          currentColorStep.percent + (100 - currentColorStep.percent) / 2
        );
      }
    } else {
      this.state.image.insertColorStep(
        currentColorStep.percent +
          (nextColorStep.percent - currentColorStep.percent) / 2
      );
    }

    this.refresh();
    this.updateData();

    this.doFocus(id);
  }

  doFocus(id) {
    this.nextTick(() => {
      this.refs.$stepList.$(".step[data-id='" + id + "']").focus();
    }, 100);
  }

  prependColorStep(id) {
    const currentIndex = this.state.image.colorsteps.findIndex(
      (it) => it.id === id
    );
    const prevIndex = currentIndex - 1;

    const currentColorStep = this.state.image.colorsteps[currentIndex];
    const prevColorStep = this.state.image.colorsteps[prevIndex];

    if (!prevColorStep) {
      if (currentColorStep.percent !== 0) {
        this.state.image.insertColorStep(currentColorStep.percent);
      }
    } else {
      this.state.image.insertColorStep(
        prevColorStep.percent +
          (currentColorStep.percent - prevColorStep.percent) / 2
      );
    }

    this.refresh();
    this.updateData();

    this.doFocus(id);
  }

  [POINTERSTART("$stepList .step") + MOVE() + END()](e) {
    var id = e.$dt.attr("data-id");

    if (e.altKey) {
      this.removeStep(id);
      return false;
    } else {
      e.$dt.focus();
      this.isSelectedColorStep =
        this.$context.selection.isSelectedColorStep(id);

      this.selectStep(id);

      this.startXY = e.xy;

      this.cachedStepListRect = this.refs.$stepList.rect();
    }
  }

  getStepListRect() {
    return this.cachedStepListRect;
  }

  move(dx) {
    var rect = this.getStepListRect();

    var minX = rect.x;
    var maxX = rect.right;

    var x = this.startXY.x + dx;

    if (x < minX) x = minX;
    else if (x > maxX) x = maxX;
    var percent = ((x - minX) / rect.width) * 100;

    if (this.$config.get("bodyEvent").shiftKey) {
      percent = Math.floor(percent);
    }

    this.currentStep.percent = percent;

    this.state.image.sortColorStep();
    this.refresh();

    this.updateData();
  }

  end(dx, dy) {
    if (dx === 0 && dy === 0) {
      if (this.isSelectedColorStep) {
        if (this.currentStep) {
          this.currentStep.cut = !this.currentStep.cut;

          this.refresh();
          this.updateData();
        }
      }
    }

    this.doFocus(this.state.id);
  }

  getLinearGradient() {
    var { image } = this.state;

    return `linear-gradient(to right, ${Gradient.toCSSColorString(
      image.colorsteps
    )})`;
  }

  [SUBSCRIBE_SELF("setColorStepColor")](color) {
    if (this.state.image.type === "static-gradient") {
      this.state.image.setColor(color);
      this.refresh();
      this.updateData();
    } else {
      if (this.currentStep) {
        this.currentStep.color = color;
        this.refresh();
        this.updateData();
      }
    }
  }

  [SUBSCRIBE("setImageUrl")](url, datauri) {
    if (this.state.image) {
      this.state.url = url;
      this.state.image.reset({ url, datauri });
      this.refresh();
      this.updateData();
    }
  }

  updateData(data = {}) {
    this.setState(data, false);
    this.parent.trigger(this.props.onchange, this.state.image.toString());
  }
}
