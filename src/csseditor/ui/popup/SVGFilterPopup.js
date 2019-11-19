import { EVENT } from "../../../util/UIElement";
import { INPUT, LOAD, BIND, CLICK } from "../../../util/Event";
import SVGFilterEditor from "../property-editor/SVGFilterEditor";
import BasePopup from "./BasePopup";
import { SVGFilter } from "../../../editor/svg-property/SVGFilter";
import { isNotUndefined } from "../../../util/functions/func";
import { editor } from "../../../editor/editor";

export default class SVGFilterPopup extends BasePopup {

  getTitle() {
    return editor.i18n('svgfilter.popup.title');
  }

  components() {
    return {
      SVGFilterEditor
    }
  }

  getClassName() {
    return 'transparent'
  }

  // getTools() {
  //   return `<button type="button" ref='$fullscreen'>${icon.fullscreen}</button>`
  // }

  [CLICK('$fullscreen')] () {
    // this.$el.toggleClass('landscape');
    // 이전 정보 저장 
    // 레이어 전ㄴ체 사이즈로 올림 
    // 내부 editor 사이트 때문에 안될려나. 
  }

  initState() {
    return {
      changeEvent: 'changeSVGFilterPopup',
      id: '',
      preview: true, 
      filters: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit(this.state.changeEvent, this.state);
  }

  getBody() {
    return /*html*/`
    <div class='svg-property-editor-popup' ref='$popup'>
      <div class="box">
        <div class='editor' ref='$editor'></div>
      </div>
    </div>`;
  }

  [LOAD('$editor')] () {

    return /*html*/`
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

    data.preview = isNotUndefined(data.preview) ? data.preview : true; 

    this.setState(data);

    this.show(500);
  }

  [EVENT("hideSVGFilterPopup")]() {
    this.$el.hide();
  }
}
