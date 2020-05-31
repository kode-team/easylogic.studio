import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, BIND, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Length } from "../../../editor/unit/Length";

const video_dom_property = [
  'audioTracks',
  'autoplay',
  'buffered',
  'controller',
  'controls',
  'controlsList',
  'crossOrigin',
  'currentSrc',
  'currentTime',
  'defaultMuted',
  'defaultPlaybackRate',
  'duration',
  'ended',
  'error',
  'initialTime',
  'loop',
  'mediaGroup',
  'muted',
  'networkState',
  'onerror',
  'paused',
  'playbackRate',
  'readyState',
  'seekable',
  'sinkId',
  'src',
  'srcObject',
  'textTracks',
  'videoTracks',
  'volume'
]

export default class VideoProperty extends BaseProperty {

  getClassName() {
    return 'item video-property'
  }

  getTitle() {
    return this.$i18n('video.property.title')
  }

  initState() {
    return {
      $video: {el: {}}
    }
  }

  getBody() {
    return /*html*/`<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  [CLICK('$resize')] () {
    var current = this.$selection.current;

    if (current) {

      current.reset({
        width: current.naturalWidth.clone(),
        height: current.naturalHeight.clone()
      })

      this.emit('resetSelection');
    }

  }

  makeVideoInfo() {
    return video_dom_property.map(p => {
      return /*html*/`
        <div class='video-info-item'>
          <label>${p}</label><span>${this.state.$video.el[p]}</span>
        </div>
      `
    }).join('');
  }

  [LOAD("$body")]() { 
    var current = this.$selection.current || {};

    var src = current['src'] || ''
    return /*html*/`
      <div>
        <ImageSelectEditor ref='$1'  key='src' value="${src}" onchange="changeSelect" />
        <div class='video-info'>
          ${this.makeVideoInfo()}
        </div>
      </div>
      `;
  }

  [EVENT('changeSelect')] (key, value, info) {
    var current = this.$selection.current;

    if (current) {
      current.reset({
        src: value,
        ...info
      })

      this.emit('setAttribute', {
        src: value,
        ...info
      }, current.id);      
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    const current = this.$selection.current;
    this.refreshShow(['video'])

    if (current.itemType === 'video') {
      this.emit('refElement', current.id, ($el) => {
        const $video = $el.$('video');

        this.state.$video = $video; 

        console.log(this.state.$video);

        this.load('$body');
      })
  
    }

  }
}
