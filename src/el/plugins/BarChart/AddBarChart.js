
import MenuItem from "el/editor/ui/menu-items/MenuItem";
import { BAR_CHART_TYPE } from "./constants";

export default class AddBarChart extends MenuItem {
  getIconString() {
    return 'bar_chart';
  }

  getTitle() {
    return this.props.title || "Bar Chart";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('BarChartTestCommand')

    this.emit('addLayerView', BAR_CHART_TYPE, { 
      chartOption: {
        chart: { 
          title: 'Monthly Revenue', 
          width: 'auto', 
          height: 'auto' 
        },
      }, 
      chartData: {
        categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
          {
            name: 'Budget',
            data: [5000, 3000, 5000, 7000, 6000, 4000, 1000],
          },
          {
            name: 'Income',
            data: [8000, 4000, 7000, 2000, 6000, 3000, 5000],
          },
          {
            name: 'Expenses',
            data: [4000, 4000, 6000, 3000, 4000, 5000, 7000],
          },
          {
            name: 'Debt',
            data: [3000, 4000, 3000, 1000, 2000, 4000, 3000],
          },
        ],
      } 
    });
  }

}