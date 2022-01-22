import icon from "el/editor/icon/icon";
import { LayerModel } from "el/editor/model/LayerModel";

export class SampleLayer extends LayerModel {

  getIcon () {
    return icon.web;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'sample',
      name: 'New Sample Layer',      
      sampleText: 'Sample Text 1',
      sampleNumber: 1,
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'sampleText',
        'sampleNumber'
      ),
    }
  }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case 'sample':
        return true;
    }

    return super.editable(editablePropertyName);
  }

  getDefaultTitle() {
    return "Sample Layer";
  } 


}