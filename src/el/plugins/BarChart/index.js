import { Editor } from "el/editor/manager/Editor";
import { AxisThemeEditor } from "../common/AxisThemeEditor";
import { ChartSeriesEditor } from "../common/ChartSeriesEditor";
import { ChartThemeEditor } from "../common/ChartThemeEditor";
import { FontThemeEditor } from "../common/FontThemeEditor";
import { LegendOptionsEditor } from "../common/LegendOptionsEditor";
import AddBarChart from "./AddBarChart";
import BarChartHTMLRender from "./BarChartHTMLRender";
import { BarChartLayer } from "./BarChartLayer";
import { BarChartLayerInspector } from "./BarChartLayerInspector";
import { BAR_CHART_TYPE } from "./constants";



/**
 * 
 * initialize BarChart Plugin 
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    // register item layer 
    editor.registerItem(BAR_CHART_TYPE, BarChartLayer )    

    // register inspector editor 
    editor.registerInspector(BAR_CHART_TYPE, BarChartLayerInspector)

    // register html renderer 
    editor.registerRenderer('html', BAR_CHART_TYPE, new BarChartHTMLRender() )    

    // register control ui 
    editor.registerElement({ 
        AddBarChart,
        FontThemeEditor,
        AxisThemeEditor,
        LegendOptionsEditor,
        ChartThemeEditor,
        ChartSeriesEditor,
    })
}
