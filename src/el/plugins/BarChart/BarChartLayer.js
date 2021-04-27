import { Component } from "el/editor/items/Component";
import icon from "el/editor/icon/icon";
import { BAR_CHART_TYPE } from "./constants";

export class BarChartLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: BAR_CHART_TYPE,
      name: "New Chart",
      chartType: 'BarChart',
      chartOption: {},
      chartData: {},
      'background-color': 'transparent',
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
    return "Bar Chart";
  }

}
