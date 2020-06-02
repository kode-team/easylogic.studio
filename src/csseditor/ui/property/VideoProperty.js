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
        <ImageSelectEditor ref='$1'  key='src' value="${src}" onchange="changeSelect" />
        <div>
          <button type="button" ref='$play'>Play</button>
        </div>
        <div class='property-item animation-property-item'>
          <div class='group'>
            <span class='add-timeline-property' data-property='currentTime'></span>
          </div>
          <NumberRangeEditor 
            ref='$currentTime' 
            key='currentTime' 
            label='Current Time'
            min="0"
            max="${this.state.$video.el.duration}"
            step="${16/1000}"
            onchange="changeValue" />
        </div>
        <div class='property-item animation-property-item'>
          <div class='group'>
            <span class='add-timeline-property' data-property='playbackRate'></span>
          </div>
          <NumberRangeEditor 
            ref='$playbackRate' 
            key='playbackRate' 
            label='Playback Rate'
            min="0"
            max="1"
            step="0.001"
            onchange="changeValue" />
        </div>        
        <div class='video-info'>
          ${this.makeVideoInfo()}
        </div>
      `;
  }

  [CLICK('$play')] () {
    if (this.state.$video) {
      this.state.$video.el.play();
    }
  }

  [EVENT('changeValue') + DEBOUNCE(100)] (key, value) {
    if (!this.state.$video) return;

    this.emit('setAttribute', { [key]: value }, null, true);
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

    if (current && current.is('video')) {
      this.emit('refElement', current.id, ($el) => {
        const $video = $el.$('video');

        this.state.$video = $video; 

        this.load('$body');
      })
  
    }

  }
}
