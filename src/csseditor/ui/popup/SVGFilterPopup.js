import { EVENT } from "../../../util/UIElement";
import { LOAD } from "../../../util/Event";
import SVGFilterEditor from "../property-editor/SVGFilterEditor";
import BasePopup from "./BasePopup";
import { SVGFilter } from "../../../editor/svg-property/SVGFilter";
import { isNotUndefined } from "../../../util/functions/func";

export default class SVGFilterPopup extends BasePopup {

  getTitle() {
    return this.$i18n('svgfilter.popup.title');
  }

  components() {
    return {
      SVGFilterEditor
    }
  }

  getClassName() {
    return 'transparent'
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
