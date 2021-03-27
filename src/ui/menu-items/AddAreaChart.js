import { registElement } from "@sapa/registerElement";
import MenuItem from "./MenuItem";

export default class AddAreaChart extends MenuItem {
  getIconString() {
    return 'chart';
  }

  getTitle() {
    return this.props.title || "Area Chart";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addLayerView', 'chart', { 
      chartType: 'AreaChart',
      chartOption: {
        chart: { 
          title: 'Average Temperature',
          width: 'auto',
          height: 'auto'
        },
        xAxis: { pointOnColumn: false, title: { text: 'Month' } },
        yAxis: { title: 'Temperature (Celsius)' },
      },
      chartData: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        series: [
          {
            name: 'Seoul',
            data: [20, 40, 25, 50, 15, 45, 33, 34, 20, 30, 22, 13],
          },
          {
            name: 'Sydney',
            data: [5, 30, 21, 18, 59, 50, 28, 33, 7, 20, 10, 30],
          },
          {
            name: 'Moscow',
            data: [30, 5, 18, 21, 33, 41, 29, 15, 30, 10, 33, 5],
          },
        ],
      },
    });
  }

}

registElement({ AddAreaChart })