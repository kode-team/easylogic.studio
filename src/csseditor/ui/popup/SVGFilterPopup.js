import { EVENT } from "../../../util/UIElement";
import { INPUT, LOAD, BIND } from "../../../util/Event";
import SVGFilterEditor from "../property-editor/SVGFilterEditor";
import BasePopup from "./BasePopup";
import { SVGFilter } from "../../../editor/css-property/SVGFilter";

export default class SVGFilterPopup extends BasePopup {

  getTitle() {
    return 'SVG Filter';
  }

  components() {
    return {
      SVGFilterEditor
    }
  }

  initState() {
    return {
      changeEvent: 'changeSVGFilterPopup',
      id: '',
      filters: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit(this.state.changeEvent, this.state);
  }

  getBody() {
    return `
    <div class='svg-property-editor-popup' ref='$popup'>
      <div class='box preview'>
          <div class='preview-box' style='filter: url(#svgfilter-popup-sample);'></div>
          <svg width="0" height="0">
            <filter id='svgfilter-popup-sample' ref='$sampleFilter'></filter>
          </svg>
      </div>    
      <div class="box">
        <div class='editor' ref='$editor'></div>
      </div>

    </div>`;
  }

  [BIND('$sampleFilter')] () {
    return {
      innerHTML : this.state.filters.join('\n')
    }
  }

  [LOAD('$editor')] () {

    return `
      <SVGFilterEditor ref='$filter' title='Filter Type' key="filter" onchange='changeFilterEditor'>
        <property name="value" type="json">${JSON.stringify(this.state.filters)}</property>
      </SVGFilterEditor>
    `

  }

  [EVENT('changeFilterEditor')] (key, filters) {
    this.updateData({
      filters
    })

    this.bindData('$sampleFilter');
  }

  refresh() {
    this.load();
  }

  [EVENT("showSVGFilterPopup")](data) {

    data.filters = data.filters.map( it => {
      return SVGFilter.parse(it);
    })

    this.setState(data);
    // this.refresh()

    this.show(250);
  }

  [EVENT("hideSVGFilterPopup")]() {
    this.$el.hide();
  }
}
