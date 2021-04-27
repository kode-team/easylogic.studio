import { Component } from "../Component";
import icon from "el/editor/icon/icon";
import { ComponentManager } from "el/editor/manager/ComponentManager";

export class ChartLayer extends Component {

  getIcon () {
    return icon.chart;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'chart',
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
    return "Chart";
  }

}

ComponentManager.registerComponent('chart', ChartLayer);
 