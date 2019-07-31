import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, CLICK, INPUT, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { SVGFilter } from "../../../../../editor/css-property/SVGFilter";
import { uuidShort } from "../../../../../util/functions/math";


export default class SVGFilterAssetsProperty extends BaseProperty {

  getTitle() {
    return "SVG Filter";
  }

  initState() {
    return {
      mode: 'list'
    }
  }

  getClassName() {
    return 'svgfilter-assets-property'
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getTools() {
    return `
      <div class='svgfilter-list-tools' ref='$tool' data-view-mode='${this.state.mode}'>
        <button type='button' data-value='list'>${icon.list} List</button>
        <button type='button' data-value='grid'>${icon.grid} Grid</button>
      </div>
    `
  }

  getBody() {
    return `
      <div class='property-item svgfilter-assets'>
        <div class='svgfilter-list' ref='$svgfilterList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [CLICK('$tool button')] (e) {
    var mode = e.$delegateTarget.attr('data-value')

    this.setState({ mode }, false)

    this.refs.$tool.attr('data-view-mode', mode);
    this.refs.$svgfilterList.attr('data-view-mode', mode);
  }

  [LOAD("$svgfilterList")]() {
    var current = editor.selection.currentProject || { svgfilterList: [] }

    var svgfilters = current.svgfilterList;

    var results = svgfilters.map( (svgfilter, index) => {

      var objectInfo = svgfilter.info.objectInfo;

      var filters = objectInfo.filters.map(filter => {
        return SVGFilter.parse(filter);
      })

      return `
        <div class='svgfilter-item' data-index="${index}" data-svgfilter='${objectInfo.svgfilter}'>
          <div class='preview' data-index="${index}">
            <svg width="0" height="0">
              <filter id="svgfilter-${index}">
                ${filters.join('')} 
              </filter>
            </svg>
            <div class='svgfilter-view' style='filter: url(#svgfilter-${index});'></div>
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

    results.push(`<div class='add-svgfilter-item'><butto type="button">${icon.add}</button></div>`)

    return results
  }

 
  executeSVGFilter (callback, isRefresh = true, isEmit = true ) {
    var project = editor.selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshSVGFilterAssets');
    }
  } 
  
  [CLICK('$svgfilterList .add-svgfilter-item')] () {

    this.executeSVGFilter(project => {
      project.createSVGFilter({
        id: uuidShort(),
        filters: []
      })
    })
  }

  [CLICK('$svgfilterList .remove')] (e) {
    var $item = e.$delegateTarget.closest('svgfilter-item');
    var index = +$item.attr('data-index');

    this.executeSVGFilter(project => {
      project.removeSVGFilter(index);
    })    

  }


  [CLICK('$svgfilterList .copy')] (e) {
    var $item = e.$delegateTarget.closest('svgfilter-item');
    var index = +$item.attr('data-index');

    this.executeSVGFilter(project => {
      project.copySVGFilter(index);
    })    
  }  

  [INPUT('$svgfilterList input')] (e) {
    var $item = e.$delegateTarget.closest('svgfilter-item');
    var index = +$item.attr('data-index');
    var obj = e.$delegateTarget.attrKeyValue('data-key');

    this.executeSVGFilter(project => {
      project.setSVGFilterValue(index, obj);      

      this.emit('refreshSVGArea');      
    }, false)        
    
  }

  [CLICK("$svgfilterList .preview")](e) {
    var $item = e.$delegateTarget.closest('svgfilter-item');    
    var index = +$item.attr('data-index')

    this.state.$item = $item; 
    this.state.$el = e.$delegateTarget.$('.svgfilter-view');

    var currentProject = editor.selection.currentProject || { svgfilterList: [] } 

    var svgfilter = currentProject.svgfilterList[index];

    this.emit("showSVGFilterPopup", {
        changeEvent: 'changeSVGFilterAssets',
        id: this.id,
        index,
        filters: svgfilter.info.objectInfo.filters 
    });
  }


  [EVENT('changeSVGFilterAssets')] (params) {
    if (params.id === this.id) {
      this.executeSVGFilter(project => {
        project.setSVGFilterValue(params.index, {
          filters: params.filters
        });

        // preview 업데이트 해주세요. 
        this.state.$item.$('filter').html(params.filters.join('\n'))

        this.emit('refreshSVGArea');

      }, false)              

    }
  }
}
