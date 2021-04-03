import { Component } from "el/editor/items/Component";
import icon from "el/editor/icon/icon";
import { LINE_CHART_TYPE } from "./constants";

export class LineChartLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: LINE_CHART_TYPE,
      name: "New Chart",
      chartType: 'LineChart',
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
    return "Line Chart";
  }

}
