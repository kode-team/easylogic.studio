import LayerRender from 'el/editor/renderer/HTMLRenderer/LayerRender';
import { BAR_CHART_TYPE } from './constants';

const ChartLayerMemory = {}
  
export default class BarChartHTMLRender extends LayerRender {

  async loadLibrary () {
    return await import(/* webpackChunkName: "toast-ui-chart" */ '@toast-ui/chart');
  }

  async update (item, currentElement) {
    const tuiChart = await this.loadLibrary();

    let $chartArea = currentElement.$(".chart-area");

    if ($chartArea) {

      const ChartView = tuiChart[item.chartType];

      if (ChartView && (Boolean(ChartLayerMemory[item.id]) === false || !$chartArea.el.chart)) {

        item.chartOption.chart.title = item.title;

        const chart = new ChartView({ 
          el: $chartArea.el, 
          data: item.chartData, 
          options: item.chartOption,
        });

        ChartLayerMemory[item.id] = chart;
        $chartArea.el.chart = chart;
      } else {
        const ChartInstance = ChartLayerMemory[item.id];

        if (ChartInstance) {
          let options = {...ChartInstance.getOptions()};
          options.chart = {...options.chart, title: item.chartTitle}; 
          ChartInstance.updateOptions(options);
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
      <div class='element-item ${BAR_CHART_TYPE}' data-id="${id}">
        ${this.toDefString(item)}
        <div class='chart-area' data-domdiff-pass="true" style="width:100%;height:100%;"></div>
      </div>`
  }

}