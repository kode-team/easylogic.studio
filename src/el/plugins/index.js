import { Editor } from "el/editor/manager/Editor"
import AreaChart from "./AreaChart";
import BarChart from "./BarChart"
import LineChart from "./LineChart";
import ReactComponent from "./ReactComponent";
import SimplePlugin from "./SimplePlugin";

Editor.registerPlugin(BarChart);
Editor.registerPlugin(AreaChart);
Editor.registerPlugin(LineChart);
Editor.registerPlugin(SimplePlugin);
Editor.registerPlugin(ReactComponent)