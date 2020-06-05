import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, BIND, DEBOUNCE, INPUT, CHANGEINPUT } from "../../../util/Event";
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
      $video: {el: {}},
      status: 'play',
      volume: 1
    }
  }

  getBody() {
    return /*html*/`<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  get video () {
    return this.state.$video.el;
  }

  get volumeStatus () {
    if (this.state.volume === 0) return 'muted'
    if (this.state.volume > 0.5) return 'up'

    return 'down'
  }

  play () {
    if (this.video) this.video.play();
  }

  pause () {
    if (this.video) this.video.pause();
  }  

  [LOAD("$body")]() { 
    var current = this.$selection.current || {playTime: "0:1:1"};
    var duration = current.playTime.split(":").pop()
    return /*html*/`
        <div ref='$tools' class='play-control' data-selected-value="${this.state.status}">
          <button type="button" data-value="play" >${icon.play} Play</button>
          <button type="button" data-value="pause">${icon.pause} Pause</button>      
          <div>
            <NumberRangeEditor ref='$currentTime' min="0" max="${duration}" value="0" step="0.001" onchange="changeCurrentTime" />
          </div>
        </div>    

        <div class='property-item animation-property-item has-label'>        
          <div class='group'>
            <span class='add-timeline-property' data-property='volume'></span>
            Volume
          </div>
          <div ref='$volume_control' class='volume-control' data-selected-value='${this.volumeStatus}'>
            <span data-value='muted'>${icon.volume_off}</span>
            <span data-value='down'>${icon.volume_down}</span>
            <span data-value='up'>${icon.volume_up}</span>
            <input type="range" ref='$volume' min="0" max="1" step="0.001" value="${this.state.volume}" />
          </div>          
        </div>
        <div class='property-item animation-property-item full'>
          <div class='group'>
            <span class='add-timeline-property' data-property='playTime'></span>
            Play Time
          </div>
          <MediaProgressEditor ref='$progress'  key='play' value="${current.playTime}" onchange="changeSelect" />
        </div>
      `;
  }

  [EVENT('changeCurrentTime')] (key, value) {
    this.setState({ currentTime: value}, false)
    this.video.currentTime = this.state.currentTime;
    this.$selection.reset({
      currentTime: this.state.currentTime
    });
    
  }

  [CHANGEINPUT('$volume')] (e) {
    this.setState({ volume: Number(this.refs.$volume.value)}, false)
    this.video.volume = this.state.volume;
    this.bindData('$volume_control')
    this.$selection.reset({
      volume: this.state.volume
    });
  }

  [BIND('$volume_control')] () {
    return {
      'data-selected-value': this.volumeStatus
    }
  }

  [BIND('$tools')] () {
    return {
      'data-selected-value': this.state.status
    }
  }

  [CLICK('$tools button')] (e) {
    var playType = e.$dt.attr('data-value');

    var target = 'play';
    switch(playType) {
    case 'play': 
      this.setState({ status: 'pause' }, false)
      this.play();
      break; 
    case 'pause': 
      this.setState({ status: 'play' }, false)
      this.pause();
      break; 
    }

    this.bindData('$tools')
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

  [EVENT('updateVideoEvent')] (e) {
    if (this.video.paused) {
      this.setState({ 
        status: 'play',
        currentTime: this.video.currentTime
      }, false)
      this.bindData('$tools');
      this.children.$currentTime.setValue(this.video.currentTime)
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    const current = this.$selection.current;
    this.refreshShow(['video'])

    if (current && current.is('video')) {
      this.emit('refElement', current.id, ($el) => {
        const $video = $el.$('video');

        this.state.$video = $video; 

        this.setState({
          volume: current.volume
        }, false)

        this.video.ontimeupdate = (e) => {
          this.trigger('updateVideoEvent', e);
        }

        this.video.onprogress = (e) => {
          this.trigger('updateVideoEvent', e);
        }
        
        this.load('$body');
      })
  
    }

  }
}
