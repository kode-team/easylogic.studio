import { Component } from "el/editor/items/Component";
import icon from "el/editor/icon/icon";
import { AREA_CHART_TYPE } from "./constants";

export class AreaChartLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: AREA_CHART_TYPE,
      name: "New Chart",
      chartType: 'AreaChart',
      chartOption: {},
      chartData: {},
      ...obj
    }); 
  }

  toCloneObject() {

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'chartType',
        'chartData',
        'chartOption',
      ),
    }
  }

  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Area Chart";
  }

}
