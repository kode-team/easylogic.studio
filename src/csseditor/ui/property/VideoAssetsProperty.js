import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, INPUT, DEBOUNCE, VDOM, DRAGSTART, CHANGE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import revokeObjectUrl from "../../../editor/util/revokeObjectUrl";


export default class VideoAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('video.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid'
    }
  }

  getClassName() {
    return 'video-assets-property'
  }

  afterRender() {
    this.show();
  }

  getBody() {
    return /*html*/`
      <div class='property-item video-assets'>
        <div class='video-list' ref='$videoList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [LOAD("$videoList") + VDOM]() {
    var current = this.$selection.currentProject || { videos: [] }

    var videos = current.videos;   

    var results = videos.map( (video, index) => {

      return /*html*/`
        <div class='video-item' data-index="${index}">
          <div class='preview' draggable="true">
            <img src="${video.local}" />
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    return /*html*/`
      <div class='loaded-list'>
        ${results.join('')}
        <div class='add-video-item'>
          <input type='file' accept='video/*' ref='$file' />
          <button type="button">${icon.add}</button>
        </div>        
      </div>

    `
  }

  executeVideo (callback, isRefresh = true, isEmit = true ) {
    var project = this.$selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshVideoAssets');
    } else {
      alert('Please select a project.')
    }
  }

  [DRAGSTART('$videoList .preview img')] (e) { 
    var index = +e.$dt.closest('video-item').attr('data-index');

    var project = this.$selection.currentProject;

    if(project) {
      var videoInfo  =  project.videos[index];

      e.dataTransfer.setData('video/info',  videoInfo.local);
    }

  }
  
  [CHANGE('$videoList .add-video-item input[type=file]')] (e) {
    this.executeVideo(project => {
      [...e.target.files].forEach(item => {
        this.emit('updateVideoAssetItem', item);
      })
    })

    
  }

  [CLICK('$videoList .remove')] (e) {
    var $item = e.$dt.closest('video-item');
    var index = +$item.attr('data-index');

    this.executeVideo(project => {
      project.removeVideo(index);
      revokeObjectUrl($item.$('.preview img').attr('src'))
    })
  }


  [CLICK('$videoList .copy')] (e) {
    var $item = e.$dt.closest('video-item');
    var index = +$item.attr('data-index');

    this.executeVideo(project => {
      project.copyVideo(index);
    })
  }  

  [EVENT('addVideoAsset')] () {
    this.refresh();
  }

}
