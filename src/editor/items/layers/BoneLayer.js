import { Layer } from "../Layer";
import { clone } from "../../../util/functions/func";

export class BoneLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'bone',
      name: "New Bone",
      startPoint: [],
      endPoint: [],
      isRoot: false, 
      ...obj
    });
  }

  getDefaultTitle() {
    return "Bone";
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      startPoint:  clone(this.json.startPoint),
      endPoint: clone(this.json.endPoint),
      isRoot:  this.json.isRoot
    }
  }
}
 