import { Component } from "@items/Component";
import icon from "@icon/icon";

export class BarChartLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'bar-chart',
      name: "New Chart",
      chartEngine: 'tui-chart',
      chartType: 'BarChart',
      chartOption: {},
      chartData: {},
      ...obj
    }); 
  }

  getProps() {
    return [
      {
        key: `chartEngine`, 
        editor: 'SelectIconEditor', 
        editorOptions: {
          label: 'Chart Engine',
          options: 'tui-chart'
        }, 
        refresh: true, 
        defaultValue: this.json['chartEngine'] 
      },                  
      {
        key: `chartOption`, 
        editor: 'SelectIconEditor', 
        editorOptions: {
          label: 'Chart Engine',
          options: 'tui-chart'
        }, 
        refresh: true, 
        defaultValue: this.json['chartOption'] 
      },                  
      {
        key: `chartData`, 
        editor: 'SelectIconEditor', 
        editorOptions: {
          label: 'Chart Engine',
          options: 'tui-chart'
        }, 
        refresh: true, 
        defaultValue: this.json['chartData'] 
      },                        
    ]
  }


  toCloneObject() {

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'chartEngine',
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
