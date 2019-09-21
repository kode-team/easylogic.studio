import { AssetItem } from "./AssetItem";
import { clone } from "../../util/functions/func";

export class Project extends AssetItem {
  getDefaultTitle() {
    return "New Project";
  }

  get isAbsolute  (){
    return false;
  }  


  toRootVariableCSS () {
    var obj = {}
    this.json.rootVariable.split(';').filter(it => it.trim()).forEach(it => {
      var [key, value] = it.split(':')

      obj[`--${key}`] = value; 
    })

    return obj;
  }  

  /**
   * `@keyframes` 문자열만 따로 생성 
   */
  toKeyframeString (isAnimate = false) {
    return this.json.keyframes
              .map(keyframe => keyframe.toString(isAnimate))
              .join('\n\n')
  }


  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      name: 'new Project',
      description: '',
      keyframes: [],      
      rootVariable: '',            
      ...obj
    });
  }

  toCloneObject() {
    var { name, description, keyframes, rootVariable } = this.json;
    return {
      ...super.toCloneObject(),
      name,
      description, 
      keyframes: clone(keyframes),
      rootVariable
    }
  }

  get artboards () {
    return this.json.layers || [];
  }

  get html () {
    return this.artboards.map(it => it.html).join('\n\n');
  }
}
