import { Layer } from "../Layer";
import Dom from "../../../util/Dom";
import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../manager/ComponentManager";
import { round } from "../../../util/functions/math";

export class VideoLayer extends Layer {

  static getIcon () {
    return icon.video;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'video',
      name: "New Video",
      elementType: 'video',

      /** source property */
      src: '',
      srcType: 'video/mp4',

      /** video property */
      controls: false,
      preload: "auto",  // none, metadata
      poster: "",
      autoplay: false,
      buffered: false, 
      crossorigin: 'anonymous',   // or "use-credentials"
      loop: false,
      muted: false, 
      played: false,
      currentTime: 0,
      playbackRate: 1.0,
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }
 

  getDefaultTitle() {
    return "Video";
  }

  getIcon() {
    return icon.video;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      src: this.json.src + ''
    }
  }

  resize() {
    this.reset({
      width: this.json.naturalWidth.clone(),
      height: this.json.naturalHeight.clone()
    })

  }


  updateFunction (currentElement, isChangeFragment = true, isLast = false, context = null) {
    var {src, currentTime} = this.json;     

    if (isChangeFragment) {
      //TODO: video 속성들 재설정 할 수 있게 기능 추가 해야함 
      // 여기는 속성만 존재해야함. 

      // 드래그 할 때 이쪽으로 들어옴. 
      // 전체 사이즈가 바뀌기 때문에 내부에 영역을 바꿔야 하는 애들은 이걸 활용을 해야함. 
      // 비디오 태그는 이 상태가 필요 없으니 그냥 아무것도 안 하면 됨. 

      console.log({currentElement, isChangeFragment})      
    }

    // 다만 여기는 해야함. filter 같은게 적용될 수도 있으니.. 구조를 맞춰야 할 듯 
    super.updateFunction(currentElement, isChangeFragment, isLast, context);

  }      


  toNestedCSS() {

    return [
      { selector: 'video', cssText: `
          width: 100%;
          height: 100%;
          pointer-events: none;
        `.trim()
      },
    ]
  }

  get html () {
    var {
      id, 
      itemType, 
      src, 
      controls,
      muted,
      poster,
      loop,
      crossorigin,
      autoplay
    } = this.json;

    return /*html*/`
      <div class='element-item ${itemType}' data-id="${id}">
        ${this.toDefString}
        <video ${OBJECT_TO_PROPERTY({ 
          controls,
          src,
          muted,
          poster,
          loop,
          crossorigin,
          autoplay
        })}>
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>`
  } 

  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }

  toSVG (x, y, isRoot = false) {
    var {width, height, src, srcType} = this.json;
    var css = this.toCSS();

    if (isRoot) {

      delete css.left;
      delete css.top;      
      if (css.position === 'absolute') {
        delete css.position; 
      }

      return this.wrapperRootSVG(x, y, width, height, /*html*/`
        <video controls width="250" style="${CSS_TO_STRING(css)}" >
          <source src="${src}"
                  type="${srcType}">
          Sorry, your browser doesn't support embedded videos.
        </video>      
      `)

    } else {
      return /*html*/ `
        ${this.toDefString}      
        <video src="${src}" controls width="250" style="${CSS_TO_STRING(css)}" >
          Sorry, your browser doesn't support embedded videos.
        </video>      
      `
    }

  }     

}
 
ComponentManager.registerComponent('video', VideoLayer);