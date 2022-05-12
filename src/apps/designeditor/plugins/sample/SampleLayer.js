import { LayerModel } from "elf/editor/model/LayerModel";

export class SampleLayer extends LayerModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "sample",
      name: "New Sample Layer",
      sampleText: "Sample Text 1",
      sampleNumber: 1,
      ...obj,
    });
  }

  get sampleText() {
    return this.get("sampleText");
  }

  set sampleText(value) {
    this.set("sampleText", value);
  }

  get sampleNumber() {
    return this.get("sampleNumber");
  }

  set sampleNumber(value) {
    this.set("sampleNumber", value);
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("sampleText", "sampleNumber"),
    };
  }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case "sample":
        return true;
    }

    return super.editable(editablePropertyName);
  }

  getDefaultTitle() {
    return "Sample Layer";
  }
}
