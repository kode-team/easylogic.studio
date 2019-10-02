
import CanvasView from "../ui/view/CanvasView";
import ToolMenu from "../ui/view/ToolMenu";

import UIElement, { EVENT } from "../../util/UIElement";
import { CLICK, DRAGOVER, DROP, PREVENT, ANIMATIONEND, TRANSITIONEND } from "../../util/Event";
import Inspector from "../ui/control/Inspector";


import popup from "../ui/popup";  
import StyleView from "../ui/view/StyleView";
import ObjectList from "../ui/control/ObjectList";
import LogoView from "../ui/view/LogoView";
import ExternalToolMenu from "../ui/view/ExternalToolMenu";
import icon from "../ui/icon/icon";
import CommandView from "../ui/view/CommandView";
import { editor } from "../../editor/editor";
import Dom from "../../util/Dom";
import Resource from "../../editor/util/Resource";
import windowList from "../ui/window-list";
import ImageFileView from "../ui/view/ImageFileView";
import TimelineProperty from "../ui/control/TimelineProperty";
import StatusBar from "../ui/view/StatusBar";

// import Lottie from "../../editor/parse/Lottie";


// var JSZip = require('jszip')

export default class CSSEditor extends UIElement {
  
  initialize () {
    super.initialize()
    Dom.create(document.body).attr('data-theme', editor.theme);
  }

  template() {
    return this.templateForEditor();
  }

  templateForEditor() {
    return /*html*/`
      <div class="layout-main">
        <div class="layout-header">
            <LogoView />
            <ToolMenu />
            <ExternalToolMenu />
        </div>
        <div class="layout-middle" ref='$middle'>
          <div class="layout-body">
            <CanvasView />        
          </div>                           
          <div class='layout-left'>
            <ObjectList />
          </div>
          <div class="layout-right">
            <Inspector />
          </div>

          <div class='layout-tools'>
            <button ref='$toggleRight'>${icon.dahaze}</button>
          </div>
          <div class='layout-footer'>
            <TimelineProperty />
          </div>          
        </div>
        
        <div class='status-bar'>
          <StatusBar />
        </div>

        <FillPopup />
        <ColorPickerPopup  />
        <BoxShadowPropertyPopup />
        <BackgroundImagePositionPopup />
        <TextShadowPropertyPopup />
        <AnimationPropertyPopup />
        <TransitionPropertyPopup />
        <KeyframePopup />
        <ClipPathPopup />
        <SVGPropertyPopup />
        <SelectorPopup />
        <ImageSelectPopup />
        <GradientPickerPopup />
        <SVGFilterPopup />
        <StyleView />    
        <CommandView />    
        <ExportWindow />
        <ImageFileView />
      </div>
    `;
  }

  components() {
    return {
      ...windowList,
      ...popup,
      ObjectList,
      CommandView,
      Inspector,
      ToolMenu,
      CanvasView,
      StyleView,
      LogoView,
      ExternalToolMenu,
      ImageFileView,
      StatusBar,
      TimelineProperty
    };
  }

  [EVENT('changeTheme')] () {
    Dom.create(document.body).attr('data-theme', editor.theme);
  }

  [CLICK('$toggleRight')] () {
    this.trigger('toggleRightPanel');
  }

  [EVENT('toggleRightPanel')] () {
    // editor.openRightPanel = !editor.openRightPanel
    // this.refs.$middle.toggleClass('open-right', editor.openRightPanel);
  }

  [EVENT('toggleFooter')] (isShow) {
    this.$el.toggleClass('show-footer', isShow);
  }

  [TRANSITIONEND('$el .layout-footer')] (e) {
    this.emit('toggleFooterEnd');
  }

  [EVENT('refreshAll')] () {
    // this.refs.$middle.toggleClass('open-right', editor.openRightPanel);

    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [EVENT('refreshAllSelectProject')] () {      
    this.emit('refreshArtBoardList')    
    this.trigger('refreshAllSelectArtBoard')
  }

  [EVENT('refreshAllSelectArtBoard')] () {      
    this.emit('refreshLayerTreeView')    
    this.emit('refreshAllCanvas');
    this.emit('refreshStyleView');
  }  

  [EVENT('refreshElement')] (current) {
    this.emit('refreshCanvas', current)
    this.emit('refreshStyleView', current)
  }

  [DRAGOVER('$middle') + PREVENT] (e) {}

  [DROP('$middle') + PREVENT] (e) {

    var items = Resource.getAllDropItems(e);

    this.emit('drop.items', items);

  }


  // [DRAGOVER() + PREVENT] (e) {}

  // [DROP() + PREVENT] (e) {
  //   const files = [...e.dataTransfer.files]

  //   if (files.length) {
  //     JSZip.loadAsync(files[0]).then(zip => {
  //       console.log(zip);
  //       var len = Object.keys(zip.files).length
  //       var sketchData = {}

  //       const loadSketch = () => {
  //         if (Object.keys(sketchData).length === len) {
  //           this.emit('loadSketchData', sketchData);
  //         }
  //       }


  //       Object.keys(zip.files).forEach(relativePath => {
  //         var zipEntry = zip.files[relativePath]

  //         if (relativePath.includes('.json')) {
  //             zipEntry.async('string').then((content) => {
  //               var page = JSON.parse(content)
  //               sketchData[relativePath] = page; 

  //               loadSketch()
  //             },
  //             function error (e) {
  //               console.log(e)
  //             })
  //         } else if (relativePath.includes('.png')) {
  //           zipEntry.async('base64').then((content) => {
  //             var image = 'data:image/png;base64,' + content; 
  //             relativePath = relativePath.replace('.png', '')
  //             sketchData[relativePath] = image; 

  //             loadSketch()              
  //           },
  //           function error (e) {
  //             console.log(e)
  //           })
  //         }
  //       })

        
  //     })
  //   }


  // }
}
