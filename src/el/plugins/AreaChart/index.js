import { Editor } from "el/editor/manager/Editor";
import AddAreaChart from "./AddAreaChart";
import AreaChartHTMLRender from "./AreaChartHTMLRender";
import { AreaChartLayer } from "./AreaChartLayer";
import { AreaChartLayerInspector  } from "./AreaChartLayerInspector";
import { AREA_CHART_TYPE } from "./constants";

/**
 * 
 * initialize AreaChart Plugin 
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    // register item layer 
    editor.registerItem(AREA_CHART_TYPE, AreaChartLayer )    

    // register inspector editor 
    editor.registerInspector(AREA_CHART_TYPE, AreaChartLayerInspector)

    // register html renderer 
    editor.registerRenderer('html', AREA_CHART_TYPE, new AreaChartHTMLRender() )    

    // register control ui 
    editor.registElement({ 
        AddAreaChart,
    })
}
