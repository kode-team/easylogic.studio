import LayerRender from 'el/editor/renderer/HTMLRenderer/LayerRender';
import { LINE_CHART_TYPE } from './constants';

const ChartLayerMemory = {}
  
export default class LineChartHTMLRender extends LayerRender {

  async loadLibrary () {
    return await import(/* webpackChunkName: "toast-ui-chart" */ '@toast-ui/chart');
  }

  async update (item, currentElement) {
    const tuiChart = await this.loadLibrary();

    let $chartArea = currentElement.$(".chart-area");

    if ($chartArea) {

      const ChartView = tuiChart[item.chartType];

      if (ChartView && (Boolean(ChartLayerMemory[item.id]) === false || !$chartArea.el.chart)) {
        const chart = new ChartView({ 
          el: $chartArea.el, 
          data: item.chartData, 
          options: item.chartOption,
        });

        ChartLayerMemory[item.id] = chart;
        $chartArea.el.chart = chart;
      } else {

        // 크기 변경에 대응하지 않는다. 
        if (item.lastChangedField['width'] || item.lastChangedField['height']) {
          return;
        }

        const ChartInstance = ChartLayerMemory[item.id];

        if (ChartInstance) {
          ChartInstance.updateOptions(item.chartOption);
        }

      }

    }

    super.update(item, currentElement);
  }    



  /**
  * 
  * @param {Item} item 
  */
  render (item) {
    var {id} = item;

    return /*html*/`
      <div class='element-item ${LINE_CHART_TYPE}' data-id="${id}">
        ${this.toDefString(item)}
        <div class='chart-area' data-domdiff-pass="true" style="width:100%;height:100%;"></div>
      </div>`
  }

}