import { Editor } from "el/editor/manager/Editor";
import { AxisThemeEditor } from "../common/AxisThemeEditor";
import { ChartSeriesEditor } from "../common/ChartSeriesEditor";
import { ChartThemeEditor } from "../common/ChartThemeEditor";
import { ChartXAxisEditor } from "../common/ChartXAxisEditor";
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
    editor.registElement({ 
        AddBarChart,
        FontThemeEditor,
        AxisThemeEditor,
        LegendOptionsEditor,
        ChartThemeEditor,
        ChartSeriesEditor,
        ChartXAxisEditor
    })

    editor.registerCommand({
        command: 'addBarChartLayer',
        execute: (editor) => {
            editor.emit('addLayerView', BAR_CHART_TYPE, { 

                'background-color': 'transparent',
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
    })

    editor.registerShortCut({
        category: 'BarChart',    
        key: 'c',
        command: 'addBarChartLayer', 
        args: [],
        when: 'CanvasView',
        description: 'Add BarChart Layer'
    })
}

