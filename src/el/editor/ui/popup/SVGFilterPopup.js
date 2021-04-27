
import { LOAD, SUBSCRIBE } from "el/base/Event";
import "../property-editor/SVGFilterEditor";
import BasePopup from "./BasePopup";
import { SVGFilter } from "el/editor/property-parser/SVGFilter";
import { isNotUndefined } from "el/base/functions/func";
import { registElement } from "el/base/registElement";

export default class SVGFilterPopup extends BasePopup {

  getTitle() {
    return this.$i18n('svgfilter.popup.title');
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
      <object refClass="SVGFilterEditor" ref='$filter' title='Filter Type' key="filter" onchange='changeFilterEditor'>
        <property name="value" valueType="json">${JSON.stringify(this.state.filters)}</property>
      </div>
    `

  }

  [SUBSCRIBE('changeFilterEditor')] (key, filters) {
    this.updateData({
      filters
    })
  }

  refresh() {
    this.load();
  }

  [SUBSCRIBE("showSVGFilterPopup")](data) {

    data.filters = data.filters.map( it => {
      return SVGFilter.parse(it);
    })

    data.preview = isNotUndefined(data.preview) ? data.preview : true; 

    this.setState(data);

    this.show(500);
  }

  [SUBSCRIBE("hideSVGFilterPopup")]() {
    this.$el.hide();
  }
}

registElement({ SVGFilterPopup })