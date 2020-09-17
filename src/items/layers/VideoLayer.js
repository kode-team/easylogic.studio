import { Layer } from "../Layer";
import Dom from "@core/Dom";
import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "@core/functions/func";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";
import { round } from "@core/functions/math";

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

      //
      playTime: '0:1:1',      // 0 is first,  1 is last
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

  updateFunction (currentElement) {
    var {currentTime, playbackRate, volume } = this.json;     

    // select 하는 부분을 완전히 뺄 수 있을까? 
    const $video = currentElement.$('video')
    if ($video) {
      $video.setProps({
        currentTime,
        playbackRate,
        volume
      })
    }

    super.updateFunction(currentElement);
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