import BaseProperty from "./BaseProperty";
import { CLICK, INPUT, CHANGE, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length, Position } from "../../../../../editor/unit/Length";
import icon from "../../../icon/icon";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_SELECTION, CHANGE_ARTBOARD, CHANGE_EDITOR } from "../../../../types/event";
import RangeEditor from "../property-editor/RangeEditor";

const typeList = [
  { key: "top", title: "Top" },
  { key: "bottom", title: "Bottom" },
  { key: "left", title: "Left" },
  { key: "right", title: "Right" }
];

const keyList = typeList.map(it => it.key);


const names = {
  image: "Image",
  "static-gradient": "Static",
  "linear-gradient": "Linear",
  "repeating-linear-gradient": `${icon.repeat} Linear`,
  "radial-gradient": "Radial",
  "repeating-radial-gradient": `${icon.repeat} Radial`,
  "conic-gradient": "Conic",
  "repeating-conic-gradient": `${icon.repeat} Conic`
};

const types = {
  image: "image",
  "static-gradient": "gradient",
  "linear-gradient": "gradient",
  "repeating-linear-gradient": "gradient",
  "radial-gradient": "gradient",
  "repeating-radial-gradient": "gradient",
  "conic-gradient": "gradient",
  "repeating-conic-gradient": "gradient"
};



export default class BorderImageProperty extends BaseProperty {
  components() {
    return {
      RangeEditor
    }
  }
  getTitle() {
    return "Border Image";
  }

  [EVENT(CHANGE_SELECTION, CHANGE_ARTBOARD, CHANGE_EDITOR)] () {
    this.refresh()
  }

  getTools() {
    var current = editor.selection.current || {} 

    var appliedBorderImage = current.appliedBorderImage || false 

    return `
      <label><input type='checkbox' ${appliedBorderImage ? 'checked' : ''} ref='$apply' /> Apply</label>
    `
  }

  [CLICK('$apply')] () {
    var current = editor.selection.current;
    if (!current) return;

    var applyBorderImage = this.refs.$apply.checked()

    current.reset({applyBorderImage});

    this.emit("refreshCanvas");

  }


  getColorStepList(image) {
    switch (image.type) {
      case "static-gradient":
      case "linear-gradient":
      case "repeating-linear-gradient":
      case "radial-gradient":
      case "repeating-radial-gradient":
      case "conic-gradient":
      case "repeating-conic-gradient":
        return this.getColorStepString(image.colorsteps);
    }

    return EMPTY_STRING;
  }

  getColorStepString(colorsteps) {
    return colorsteps
      .map(step => {
        return `<div class='step' data-colorstep-id="${
          step.id
        }" data-selected='${step.selected}' style='background-color:${step.color};'></div>`;
      })
      .join(EMPTY_STRING);
  }

  [LOAD('$borderImageView')] () {
    var current  = editor.selection.current || {borderImage: { image: {}}} ;
    var borderImage = current.borderImage;
    // var backgroundType = types[image.type];
    var backgroundTypeName = borderImage.type ?  names[borderImage.type] : '';

    const imageCSS = `background-image: ${borderImage.image.toString()}; background-size: cover;`;    
    return ` 
      <div class='preview' ref="$preview">
        <div class='mini-view'>
          <div class='color-view'  style="${imageCSS}" ref="$miniView"></div>
        </div>
      </div> 
      <div class='fill-info'>
        <div class='gradient-info'>
          <div class='fill-title' ref="$fillTitle">${backgroundTypeName}</div>
          <div class='colorsteps' ref="$colorsteps">
            ${this.getColorStepList(borderImage.image)}
          </div>
        </div>
      </div>
    `
  }

  [EVENT('changeBorderImage')] (key, value) {

    if (key === 'border-image-slice') {
      keyList.forEach(type => {
        this.children[`$${type}Slice`].setValue(value)
      });
    }

    this.setBorderImageProperty()
  }

  getBody() {

    var current  = editor.selection.current || {borderImage: { image: {}}} ;
    var borderImage = current.borderImage;

    return html`
      <div class="property-item border-image-item" ref='$borderImageView'></div>    
      <div class="property-item border-slice-item">
        <div class="slice-selector" data-selected-value="all" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="slice-value">
          <RangeEditor ref='$allSlice' key='border-image-slice' onchange='changeBorderImage' />
        </div>
      </div>
      <div
        class="property-item border-slice-item full has-list"
        ref="$partitialSetting"
        style="display: none;"
      >
        <div class="slice-setting-box" ref="$sliceSettingBox">
          ${typeList.map(it => {
            return `
              <div>
                <label class='title'>${it.title}</label>
              </div>
              <div>
                <RangeEditor ref='$${it.key}Slice' label='Slice' key='border-image-slice-${it.key}' onchange='changeBorderImage' /> 
              </div>  
              <div>
                <RangeEditor ref='$${it.key}Width' label='Width' key='border-image-width-${it.key}' onchange='changeBorderImage' /> 
              </div>                
            `;
          })}
        </div>
      </div>
    `;
  }


  [CHANGE("$sliceSettingBox select")](e) {
    this.setBorderImageProperty();
  }

  [CLICK('$borderImageView .preview')] () {
    this.viewFillPicker(this.refs.$preview, '');
  }

  [CLICK("$borderImageView .colorsteps .step")](e) {

    this.refs.$colorsteps.$(`[data-selected="true"]`).removeAttr('data-selected')
    var selectColorStepId = e.$delegateTarget.attr("data-colorstep-id");
    e.$delegateTarget.attr('data-selected', true);
    var $preview = e.$delegateTarget.closest("border-image-item").$(".preview");
    this.viewFillPicker($preview, selectColorStepId);
  }


  getFillData(borderImage) {
    let data = {
      type: borderImage.type
    };

    switch (data.type) {
      case "image":
        data.url = borderImage.image ? borderImage.image.url : "";
        break;
      default:
        if (borderImage.image) {
          const image = borderImage.image;

          data.type = image.type;
          data.colorsteps = [...image.colorsteps];
          data.angle = image.angle;
          data.radialType = image.radialType || "ellipse";
          data.radialPosition = image.radialPosition || Position.CENTER;
        } else {
          data.colorsteps = [];
          data.angle = 0;
          data.radialType = "ellipse";
          data.radialPosition = Position.CENTER;
        }

        break;
    }

    return data;
  }


  viewFillPicker($preview, selectColorStepId) {

    var current = editor.selection.current;

    if (!current) return;

    this.emit("showFillPicker", {
      changeEvent: 'changeBorderImageFillPicker',
      ...this.getFillData(current.borderImage),
      selectColorStepId,
      refresh: true
    });
  }

  viewChangeImage(data) {
    var current = editor.selection.current;
    if (!current) return; 

    var borderImage = current.borderImage;

    if (!borderImage) return;
    var $el = this.getRef("$miniView");
    if ($el && borderImage.image) {
      $el.css({
        'background-image': borderImage.image.toString(),
        "background-size": "cover"
      });
    }

    var $el = this.getRef("$fillTitle");
    if ($el) {
      $el.html(names["image"]);
    }

    var $el = this.getRef("$colorsteps", this.selectedIndex);
    if ($el) {
      $el.empty();
    }
  }

  setImage(data) {

    var current = editor.selection.current;
    if (!current) return; 

    current.borderImage.setImageUrl(data);

    this.viewChangeImage(data);

    this.emit("refreshCanvas");
  }

  viewChangeGradient(data) {
    var current = editor.selection.current;
    if (!current) return; 

    var borderImage = current.borderImage;

    if (!borderImage) return;
    var $el = this.getRef("$miniView");
    if ($el) {
      $el.css({
        'background-image': borderImage.image.toString(),
        "background-size": "cover"
      });      
    }

    var $el = this.getRef("$fillTitle");
    if ($el) {
      $el.html(names[data.type]);
    }

    var $el = this.getRef("$colorsteps", this.selectedIndex);
    if ($el) {
      $el.html(this.getColorStepString(data.colorsteps));
    }
  }


  setGradient(data) {

    var current = editor.selection.current;
    if (!current) return; 
    // console.log(this.currentBackgroundImage, data);

    current.borderImage.setGradient(data);   

    this.viewChangeGradient(data);

    this.emit("refreshCanvas");

  }

  [EVENT("changeBorderImageFillPicker")](data) {
    switch (data.type) {
      case "image":
        this.setImage(data);
        break;
      default:
        this.setGradient(data);
        break;
    }
  }

  setBorderImageProperty() {
    var current = editor.selection.current;
    if (!current) return;
    var borderImage = current.borderImage;

    var type = this.refs.$selector.attr("data-selected-value");

    if (type === "all") {
      var len = this.children.$allSlice.getValue()
      borderImage.reset({
        slice: {
          top: len.clone(),
          right: len.clone(),
          bottom: len.clone(),
          left: len.clone()
        }
      })

    } else {
      keyList.forEach(type => {
        borderImage.slice[type] = this.children[`$${type}Slice`].getValue()
        borderImage.width[type] = this.children[`$${type}Width`].getValue()
      });
    }

    this.emit("refreshCanvas");
  }

  [CLICK("$selector button")](e) {
    var type = e.$delegateTarget.attr("data-value");
    this.refs.$selector.attr("data-selected-value", type);

    if (type === "all") {
      this.refs.$partitialSetting.hide();
    } else {
      this.refs.$partitialSetting.show("grid");
    }

    this.setBorderImageProperty();
  }

}
