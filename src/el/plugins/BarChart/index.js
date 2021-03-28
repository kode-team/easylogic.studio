import { Editor } from "el/editor/manager/Editor";
import AddBarChart from "./AddBarChart";
import BarChartHTMLRender from "./BarChartHTMLRender";
import { BarChartLayer } from "./BarChartLayer";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    console.log(editor);

    editor.registerElement({ 
        AddBarChart
    })
    editor.registerComponent('bar-chart', BarChartLayer )
    editor.registerRenderer('html', 'bar-chart', new BarChartHTMLRender() )

}

