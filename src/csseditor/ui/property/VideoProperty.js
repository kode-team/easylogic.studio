import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, BIND, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Length } from "../../../editor/unit/Length";

const video_dom_property = [
  // 'audioTracks',
  // 'autoplay',
  // 'buffered',
  // 'controller',
  // 'controls',
  // 'controlsList',
  // 'crossOrigin',
  // 'currentSrc',
  // 'currentTime',
  // 'defaultMuted',
  // 'defaultPlaybackRate',
  'duration',
  // 'ended',
  // 'error',
  // 'initialTime',
  // 'loop',
  // 'mediaGroup',
  // 'muted',
  // 'networkState',
  // 'onerror',
  // 'paused',
  // 'playbackRate',
  // 'readyState',
  // 'seekable',
  // 'sinkId',
  // 'src',
  // 'srcObject',
  // 'textTracks',
  // 'videoTracks',
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
      console.log(p, this.state.$video.el)
      return /*html*/`
        <div class='video-info-item'>
          <label>${p}</label><span>${this.state.$video.el[p]}</span>
        </div>
      `
    }).join('');
  }

  [LOAD("$body")]() { 
    var current = this.$selection.current || {};
    return /*html*/`
        <div class='property-item animation-property-item full'>
          <div class='group'>
            <span class='add-timeline-property' data-property='playTime'></span>
            Play Time
          </div>
          <MediaProgressEditor ref='$progress'  key='play' value="${current.playTime}" onchange="changeSelect" />
        </div>
        <div>
          <button type="button" ref='$play'>Play</button>
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


  [EVENT('changeSelect')] (key, value) {
    this.emit('setAttribute', {
      [key]: value,
    });
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    const current = this.$selection.current;
    this.refreshShow(['video'])


    console.log(current);

    if (current && current.is('video')) {
      this.emit('refElement', current.id, ($el) => {
        const $video = $el.$('video');

        this.state.$video = $video; 
        let [start, end ] = current.playTime.split(":")

        current.reset({
          playTime: `${start}:${end}:${$video.el.duration}`
        })

        this.load('$body');
      })
  
    }

  }
}
