
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

    this.emit('addBarChartLayer')
  }

}