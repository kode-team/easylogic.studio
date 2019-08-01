import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, CLICK, INPUT, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { uuidShort } from "../../../util/functions/math";


export default class SVGPathAssetsProperty extends BaseProperty {

  getTitle() {
    return "SVG Path";
  }

  getClassName() {
    return 'svgpath-assets-property'
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getBody() {
    return `
      <div class='property-item svgpath-assets'>
        <div class='svgpath-list' ref='$svgpathList' data-view-mode='grid'></div>
      </div>
    `;
  }


  [LOAD("$svgpathList")]() {
    var current = editor.selection.currentProject || { svgpathsList: [] }

    var svgpathsList = current.svgpathsList;

    var results = svgpathsList.map( (svgpath, index) => {

      var objectInfo = svgpath.info.objectInfo;

      return `
        <div class='svgpath-item' data-index="${index}" data-d='${objectInfo.d}'>
          <div class='preview' data-index="${index}">
            <svg width="0" height="0">
              <path d="${objectInfo.d}" ref='$path' />
            </svg>
          </div>
          <div class='title'>
            <div>
              <input type='text' class='id' data-key='id' value='${objectInfo.id}' placeholder="id" />
            </div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    results.push(`
      <div class='add-svgpath-item'><butto type="button">${icon.add}</button></div>
    `)

    return results
  }

 
  executeSVGPath (callback, isRefresh = true, isEmit = true ) {
    var project = editor.selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshSVGPathAssets');
    }
  } 
  
  [CLICK('$svgpathList .add-svgpath-item')] () {

    this.executeSVGPath(project => {
      project.createSVGPath({
        id: uuidShort(),
        filters: []
      })
    })
  }

  [CLICK('$svgpathList .remove')] (e) {
    var $item = e.$delegateTarget.closest('svgpath-item');
    var index = +$item.attr('data-index');

    this.executeSVGPath(project => {
      project.removeSVGPath(index);
    })    

  }


  [CLICK('$svgpathList .copy')] (e) {
    var $item = e.$delegateTarget.closest('svgpath-item');
    var index = +$item.attr('data-index');

    this.executeSVGPath(project => {
      project.copySVGPath(index);
    })    
  }  

  [INPUT('$svgpathList input')] (e) {
    var $item = e.$delegateTarget.closest('svgpath-item');
    var index = +$item.attr('data-index');
    var obj = e.$delegateTarget.attrKeyValue('data-key');

    this.executeSVGPath(project => {
      project.setSVGPathValue(index, obj);      

      this.emit('refreshSVGArea');      
    }, false)        
    
  }

  [CLICK("$svgpathList .preview")](e) {
    var $item = e.$delegateTarget.closest('svgpath-item');    
    var index = +$item.attr('data-index')

    this.state.$item = $item; 
    this.state.$el = e.$delegateTarget.$('.svgpath-view');

    var currentProject = editor.selection.currentProject || { svgpathList: [] } 

    var svgpath = currentProject.svgpathList[index];

    this.emit("showSVGPathPopup", {
        changeEvent: 'changeSVGPathAssets',
        id: this.id,
        index,
        svgpath: svgpath.info.objectInfo 
    });
  }


  [EVENT('changeSVGPathAssets')] (params) {
    if (params.id === this.id) {
      this.executeSVGPath(project => {
        project.setSVGPathValue(params.index, {
          filters: params.filters
        });

        // preview 업데이트 해주세요. 
        this.state.$item.$('filter').html(params.filters.join('\n'))

        this.emit('refreshSVGArea');

      }, false)              

    }
  }
}
